from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *
import razorpay
from django.conf import settings

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

from .models import *
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend



def home(request):
    return HttpResponse("Hello!")


class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]



class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'package']  # backend filter


class TimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSlotSerializer

    def get_queryset(self):
        queryset = TimeSlot.objects.all()
        test_id = self.request.query_params.get("test_id")
        if test_id:
            queryset = queryset.filter(test_id=test_id)
        return queryset
    
class ConsultViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]


class ConsultTimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultTimeSlotSerializer

    def get_queryset(self):
        queryset = ConsultTimeSlot.objects.all()
        doctor_id = self.request.query_params.get("doctor_id")
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        return queryset




class CreateOrderView(APIView):
    """
    API View to create a Razorpay Order.
    This is the first step in the payment process.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        amount = 34900  # amount in paise (Rs. 349.00)
        currency = 'INR'

        try:
            razorpay_order = razorpay_client.order.create(dict(
                amount=amount,
                currency=currency,
                payment_capture='1'
            ))
            return Response(
                {
                    'order_id': razorpay_order['id'],
                    'amount': razorpay_order['amount'],
                    'currency': razorpay_order['currency']
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyPaymentView(APIView):
    """
    API View to verify the payment signature.
    This is the final step to confirm payment success.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        payment_id = request.data.get('razorpay_payment_id', '')
        order_id = request.data.get('razorpay_order_id', '')
        signature = request.data.get('razorpay_signature', '')

        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }

        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
            return Response(
                {'status': 'Payment Successful'},
                status=status.HTTP_200_OK
            )
        except razorpay.errors.SignatureVerificationError:
            return Response(
                {
                    'status': 'Payment Failed',
                    'error': 'Signature verification failed'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


