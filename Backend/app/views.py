from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
import razorpay

from .models import *
from .serializers import *


# ------------------------------
# 🔑 Razorpay Initialization
# ------------------------------
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


# ------------------------------
# 🌐 Simple Home Endpoint
# ------------------------------
def home(request):
    return HttpResponse("Hello!")


# ------------------------------
# 📦 PACKAGE CRUD
# ------------------------------
class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# ------------------------------
# 🧍 PATIENT CRUD
# ------------------------------
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]


# ------------------------------
# 🧪 TEST CRUD + Filter
# ------------------------------
class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'package']


# ------------------------------
# ⏰ TIMESLOT CRUD + Filters
# ------------------------------
class TimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['test', 'date', 'available']

    def get_queryset(self):
        queryset = TimeSlot.objects.all()
        test_id = self.request.query_params.get("test_id")
        date = self.request.query_params.get("date")
        available = self.request.query_params.get("available")

        if test_id:
            queryset = queryset.filter(test_id=test_id)
        if date:
            queryset = queryset.filter(date=date)
        if available in ['true', 'false']:
            queryset = queryset.filter(available=(available == 'true'))

        return queryset


# ------------------------------
# 🩺 CONSULTATION CRUD
# ------------------------------
class ConsultViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]


# ------------------------------
# 👨‍⚕️ CONSULTATION TIMESLOT CRUD
# ------------------------------
class ConsultTimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultTimeSlotSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['doctor', 'date', 'available']

    def get_queryset(self):
        queryset = ConsultTimeSlot.objects.all()
        doctor_id = self.request.query_params.get("doctor_id")
        date = self.request.query_params.get("date")

        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if date:
            queryset = queryset.filter(date=date)

        return queryset


# ------------------------------
# 🧾 BOOKING CRUD
# ------------------------------
class BookingViewSet(viewsets.ModelViewSet):
    """
    Supports:
      - GET (list/filter bookings)
      - POST (create new booking)
      - DELETE / PUT for admin management
    """
    queryset = Booking.objects.select_related("patient", "test", "timeslot").all()
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['test', 'timeslot__date']

    def get_queryset(self):
        # Return only bookings of the logged-in patient if ?mine=true
        qs = super().get_queryset()
        mine = self.request.query_params.get("mine")
        if mine and self.request.user.role == "patient":
            return qs.filter(patient__user=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return BookingCreateSerializer
        return BookingSerializer

    def perform_create(self, serializer):
        """
        Handles booking creation and updates related TimeSlot counters.
        Prevents overbooking for limited slots.
        """
        timeslot = serializer.validated_data['timeslot']

        # Prevent booking if slot unavailable or full
        if not timeslot.available:
            raise serializers.ValidationError({"timeslot": "This timeslot is not available."})
        if not timeslot.unlimited_patients and timeslot.booked_slots >= timeslot.max_patients:
            raise serializers.ValidationError({"timeslot": "This timeslot is fully booked."})

        # Save booking
        booking = serializer.save()

        # Update slot counters
        if not timeslot.unlimited_patients:
            timeslot.booked_slots += 1
            timeslot.available_slots = max(timeslot.max_patients - timeslot.booked_slots, 0)
            timeslot.available = timeslot.booked_slots < timeslot.max_patients
        timeslot.save()

        return booking
    
    def get_serializer_class(self):
        if self.action == "create":
            return BookingCreateSerializer
        return BookingSerializer

    def get_serializer_context(self):
        # pass request to serializer
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


# ------------------------------    
# 💳 RAZORPAY ORDER CREATION
# ------------------------------
class CreateOrderView(APIView):
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


# ------------------------------
# 💰 PAYMENT VERIFICATION
# ------------------------------
class VerifyPaymentView(APIView):
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
            return Response({'status': 'Payment Successful'}, status=status.HTTP_200_OK)
        except razorpay.errors.SignatureVerificationError:
            return Response(
                {'status': 'Payment Failed', 'error': 'Signature verification failed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
