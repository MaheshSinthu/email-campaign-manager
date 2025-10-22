from rest_framework import serializers
from .models import Recipient, Campaign, EmailDeliveryLog

class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = ['id', 'name', 'email', 'is_subscribed', 'created_at']

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = [
            'id', 'name', 'subject_line', 'email_content', 'scheduled_time',
            'status', 'total_recipients', 'sent_count', 'failed_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['total_recipients', 'sent_count', 'failed_count', 'created_at', 'updated_at']

class EmailDeliveryLogSerializer(serializers.ModelSerializer):
    recipient_email = serializers.SerializerMethodField()

    class Meta:
        model = EmailDeliveryLog
        fields = ['id', 'campaign', 'recipient', 'recipient_email', 'status', 'failure_reason', 'sent_at']

    def get_recipient_email(self, obj):
        return obj.recipient.email
