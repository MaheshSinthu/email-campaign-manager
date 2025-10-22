from django.urls import path
from .views import (
    CampaignListCreateAPIView,
    CampaignDetailAPIView,
    StartCampaignAPIView,
    RecipientBulkUploadAPIView,
    CampaignDeliveryLogAPIView
)

urlpatterns = [
    path('campaigns/', CampaignListCreateAPIView.as_view(), name='campaign-list-create'),
    path('campaigns/<int:pk>/', CampaignDetailAPIView.as_view(), name='campaign-detail'),
    path('campaigns/<int:pk>/start/', StartCampaignAPIView.as_view(), name='campaign-start'),
    path('campaigns/<int:pk>/logs/', CampaignDeliveryLogAPIView.as_view(), name='campaign-logs'),
    path('recipients/upload/', RecipientBulkUploadAPIView.as_view(), name='recipients-upload'),
]
