from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, parsers
from django.shortcuts import get_object_or_404
from .models import Campaign, Recipient, EmailDeliveryLog
from .serializers import CampaignSerializer, RecipientSerializer, EmailDeliveryLogSerializer
from .utils import parse_csv, parse_excel, validate_and_clean_rows
from .tasks import start_campaign
from django.db import IntegrityError, transaction

class CampaignListCreateAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = Campaign.objects.all().order_by('-created_at')
        serializer = CampaignSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CampaignSerializer(data=request.data)
        if serializer.is_valid():
            campaign = serializer.save()
            return Response(CampaignSerializer(campaign).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CampaignDetailAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk)
        data = CampaignSerializer(campaign).data
        # add aggregate counts
        data['total_recipients'] = campaign.total_recipients
        data['sent_count'] = campaign.sent_count
        data['failed_count'] = campaign.failed_count
        return Response(data)

class StartCampaignAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk)
        if campaign.status not in ('SCHEDULED', 'DRAFT'):
            return Response({'detail': 'Campaign cannot be started in current status.'}, status=status.HTTP_400_BAD_REQUEST)
        # Kick off sending via celery
        start_campaign.delay(campaign.id)
        campaign.status = 'IN_PROGRESS'
        campaign.save(update_fields=['status'])
        return Response({'detail': 'Campaign started'}, status=status.HTTP_202_ACCEPTED)

class RecipientBulkUploadAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [parsers.MultiPartParser]

    def post(self, request):
        """
        Upload file under key 'file' (csv or xlsx). Returns counts and invalid rows.
        """
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({'detail': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        ext = uploaded_file.name.split('.')[-1].lower()
        if ext in ('csv',):
            rows = parse_csv(uploaded_file)
        elif ext in ('xlsx', 'xls'):
            rows = parse_excel(uploaded_file)
        else:
            return Response({'detail': 'Unsupported file type'}, status=status.HTTP_400_BAD_REQUEST)

        valid, invalid = validate_and_clean_rows(rows)

        created = 0
        duplicates = 0
        errors = []
        # bulk create efficiently: gather recipients to create (dedupe against DB)
        existing_emails = set(Recipient.objects.filter(email__in=[r['email'] for r in valid]).values_list('email', flat=True))
        to_create = []
        for r in valid:
            if r['email'] in existing_emails:
                duplicates += 1
                continue
            to_create.append(Recipient(name=r['name'], email=r['email'], is_subscribed=True))
        if to_create:
            Recipient.objects.bulk_create(to_create, ignore_conflicts=True)
            created = len(to_create)

        return Response({
            'created': created,
            'duplicates': duplicates,
            'invalid_rows': invalid
        }, status=status.HTTP_200_OK)

class CampaignDeliveryLogAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk)
        logs = campaign.delivery_logs.select_related('recipient').all().order_by('-sent_at')
        serializer = EmailDeliveryLogSerializer(logs, many=True)
        return Response(serializer.data)
