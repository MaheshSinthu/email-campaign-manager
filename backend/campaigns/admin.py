from django.contrib import admin
from .models import Recipient, Campaign, EmailDeliveryLog

@admin.register(Recipient)
class RecipientAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_subscribed', 'created_at')
    search_fields = ('email', 'name')

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'scheduled_time', 'total_recipients', 'sent_count', 'failed_count')
    list_filter = ('status',)
    search_fields = ('name', 'subject_line')

@admin.register(EmailDeliveryLog)
class EmailDeliveryLogAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'recipient', 'status', 'sent_at')
    list_filter = ('status',)
    search_fields = ('recipient__email',)
