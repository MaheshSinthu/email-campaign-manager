from django.db import models

class Recipient(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    is_subscribed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

class Campaign(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('SCHEDULED', 'Scheduled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
        ('PAUSED', 'Paused'),
    )
    name = models.CharField(max_length=255)
    subject_line = models.CharField(max_length=255)
    email_content = models.TextField()  # Plain text or HTML
    scheduled_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    total_recipients = models.IntegerField(default=0)
    sent_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Optional convenience
    recipients = models.ManyToManyField(Recipient, through='EmailDeliveryLog', blank=True)

    def __str__(self):
        return self.name

class EmailDeliveryLog(models.Model):
    STATUS_CHOICES = (
        ('SENT', 'Sent'),
        ('FAILED', 'Failed'),
    )

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='delivery_logs')
    recipient = models.ForeignKey(Recipient, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    failure_reason = models.TextField(blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('campaign', 'recipient')

    def __str__(self):
        return f"{self.campaign.name} - {self.recipient.email} - {self.status}"
