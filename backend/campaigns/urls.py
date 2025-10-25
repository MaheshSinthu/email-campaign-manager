from django.urls import path
from .views import (
    CampaignListCreateAPIView,
    CampaignDetailAPIView,
    StartCampaignAPIView,
    RecipientBulkUploadAPIView,
    CampaignDeliveryLogAPIView,
    RecipientListAPIView,
    PauseCampaignAPIView,
    ResumeCampaignAPIView,
    CancelCampaignAPIView,
    ScheduleDraftCampaignAPIView,
)

urlpatterns = [
    path('campaigns/', CampaignListCreateAPIView.as_view(), name='campaign-list-create'),
    path('campaigns/<int:pk>/', CampaignDetailAPIView.as_view(), name='campaign-detail'),
    path('campaigns/<int:pk>/start/', StartCampaignAPIView.as_view(), name='campaign-start'),
    path('campaigns/<int:pk>/logs/', CampaignDeliveryLogAPIView.as_view(), name='campaign-logs'),
    path('recipients/upload/', RecipientBulkUploadAPIView.as_view(), name='recipients-upload'),
    path('recipients/', RecipientListAPIView.as_view(), name='recipient-list'),
    path('campaigns/<int:pk>/pause/', PauseCampaignAPIView.as_view(), name='campaign-pause'),
    path('campaigns/<int:pk>/resume/', ResumeCampaignAPIView.as_view(), name='campaign-resume'),
    path('campaigns/<int:pk>/cancel/', CancelCampaignAPIView.as_view(), name='campaign-cancel'),
    path('campaigns/<int:pk>/schedule/', ScheduleDraftCampaignAPIView.as_view(), name='schedule-campaign'),
]
