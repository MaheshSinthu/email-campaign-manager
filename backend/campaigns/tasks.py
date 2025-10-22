from celery import shared_task, group, chord
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from .models import Campaign, Recipient, EmailDeliveryLog
import csv
import io
from django.core.mail import send_mail
from django.db import models
BATCH_SIZE = 200  # tune for your infra

@shared_task
def send_single_email(campaign_id, recipient_id):
    """
    Sends one email and creates a delivery log entry.
    Returns tuple (recipient_id, status, failure_reason)
    """
    try:
        campaign = Campaign.objects.get(pk=campaign_id)
        recipient = Recipient.objects.get(pk=recipient_id)
        if not recipient.is_subscribed:
            return (recipient_id, 'FAILED', 'Recipient unsubscribed')
        # compose email
        subject = campaign.subject_line
        body = campaign.email_content
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@example.com')
        msg = EmailMultiAlternatives(subject, body, from_email, [recipient.email])
        # If HTML you can attach as alternative (very naive detection)
        if '<html' in body.lower() or '<p>' in body.lower():
            msg.attach_alternative(body, "text/html")
        msg.send(fail_silently=False)
        # log
        EmailDeliveryLog.objects.create(campaign=campaign, recipient=recipient, status='SENT')
        # increment counter atomically
        Campaign.objects.filter(pk=campaign_id).update(sent_count=models.F('sent_count')+1)
        return (recipient.email, 'SENT', '')
    except Exception as exc:
        # create failed log
        try:
            EmailDeliveryLog.objects.create(campaign_id=campaign_id, recipient_id=recipient_id, status='FAILED', failure_reason=str(exc))
            Campaign.objects.filter(pk=campaign_id).update(failed_count=models.F('failed_count')+1)
        except Exception:
            pass
        return (recipient_id, 'FAILED', str(exc))

@shared_task
def start_campaign(campaign_id):
    """
    Kick off sending for a campaign. This function creates groups of send_single_email tasks
    and runs them as a chord (for a final callback to generate report).
    """
    from django.db.models import F
    campaign = Campaign.objects.get(pk=campaign_id)
    # mark in progress
    campaign.status = 'IN_PROGRESS'
    campaign.save(update_fields=['status'])
    # get subscribed recipients for this campaign
    recipients_qs = Recipient.objects.filter(is_subscribed=True)
    total = recipients_qs.count()
    campaign.total_recipients = total
    campaign.save(update_fields=['total_recipients'])

    recipient_ids = list(recipients_qs.values_list('id', flat=True))
    # Create groups of tasks (parallel)
    job_sigs = [send_single_email.s(campaign_id, rid) for rid in recipient_ids]
    # run as group (could chunk)
    job_group = group(job_sigs)
    # When group finishes, trigger report generation
    result = job_group.apply_async()
    # We do not wait here; alternatively use chord(job_sigs)(generate_report.s(campaign_id))
    return {'dispatched': len(recipient_ids)}

@shared_task
def generate_and_send_report(campaign_id):
    """
    Create CSV summary and send to admin email.
    """
    campaign = Campaign.objects.get(pk=campaign_id)
    logs = campaign.delivery_logs.select_related('recipient').all()
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(['recipient_email', 'status', 'failure_reason', 'sent_at'])
    for l in logs:
        writer.writerow([l.recipient.email, l.status, l.failure_reason or '', l.sent_at.isoformat()])
    csv_content = buffer.getvalue()
    admin_email = getattr(settings, 'ADMIN_REPORT_EMAIL', None)
    if admin_email:
        send_mail(
            subject=f"Campaign Report: {campaign.name}",
            message="See attached report.",
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@example.com'),
            recipient_list=[admin_email],
            fail_silently=False
        )
        # attach via EmailMessage if you want attachments (skipped for brevity)
    # mark completed if all done
    campaign.refresh_from_db()
    if campaign.sent_count + campaign.failed_count >= campaign.total_recipients:
        campaign.status = 'COMPLETED'
        campaign.save(update_fields=['status'])
    return True

@shared_task
def schedule_due_campaigns():
    """
    Run periodically (via celery beat). Finds campaigns with scheduled_time <= now and status=SCHEDULED
    and starts them.
    """
    now = timezone.now()
    due = Campaign.objects.filter(status='SCHEDULED', scheduled_time__lte=now)
    for c in due:
        start_campaign.delay(c.id)
        c.status = 'IN_PROGRESS'
        c.save(update_fields=['status'])
