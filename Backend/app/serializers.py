from rest_framework import serializers
from .models import *


# ------------------------------
# 📦 PACKAGE
# ------------------------------
class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ("id", "name")


# ------------------------------
# 🧍 PATIENT
# ------------------------------
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


# ------------------------------
# 🧪 TEST
# ------------------------------
class TestSerializer(serializers.ModelSerializer):
    package = serializers.PrimaryKeyRelatedField(
        queryset=Package.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = Test
        fields = "__all__"


# ------------------------------
# 🩺 CONSULTATION
# ------------------------------
class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = "__all__"


# ------------------------------
# ⏰ TEST TIMESLOTS
# ------------------------------
class TimeSlotSerializer(serializers.ModelSerializer):
    test_name = serializers.CharField(source="test.name", read_only=True)

    class Meta:
        model = TimeSlot
        fields = (
            "id",
            "test",
            "test_name",
            "date",
            "start_time",
            "end_time",
            "max_patients",
            "unlimited_patients",
            "available_slots",
            "booked_slots",
            "available",
        )

    def validate(self, data):
        """Ensure slot logic is valid."""
        unlimited = data.get("unlimited_patients", getattr(self.instance, "unlimited_patients", True))
        max_patients = data.get("max_patients", getattr(self.instance, "max_patients", None))

        if not unlimited and not max_patients:
            raise serializers.ValidationError({
                "max_patients": "This field is required when unlimited_patients is False."
            })

        return data

    def to_representation(self, instance):
        """Hide available_slots in response when unlimited_patients=True."""
        rep = super().to_representation(instance)
        if instance.unlimited_patients:
            rep["available_slots"] = None
        return rep


# ------------------------------
# 👨‍⚕️ CONSULTATION TIMESLOTS
# ------------------------------
class ConsultTimeSlotSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.docname", read_only=True)

    class Meta:
        model = ConsultTimeSlot
        fields = (
            "id",
            "doctor",
            "doctor_name",
            "date",
            "start_time",
            "end_time",
            "max_patients",
            "unlimited_patients",
            "available_slots",
            "booked_slots",
            "available",
        )

    def validate(self, data):
        unlimited = data.get("unlimited_patients", getattr(self.instance, "unlimited_patients", True))
        max_patients = data.get("max_patients", getattr(self.instance, "max_patients", None))

        if not unlimited and not max_patients:
            raise serializers.ValidationError({
                "max_patients": "This field is required when unlimited_patients is False."
            })

        return data

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.unlimited_patients:
            rep["available_slots"] = None
        return rep


# ------------------------------
# 📅 BOOKING
# ------------------------------
class BookingSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.first_name", read_only=True)
    test_name = serializers.CharField(source="test.name", read_only=True)
    slot_date = serializers.DateField(source="timeslot.date", read_only=True)
    slot_time = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = (
            "id",
            "patient",
            "patient_name",
            "test",
            "test_name",
            "timeslot",
            "slot_date",
            "slot_time",
            "booking_date",
        )

    def get_slot_time(self, obj):
        return f"{obj.timeslot.start_time} - {obj.timeslot.end_time}"


# ------------------------------
# ➕ BOOKING CREATION SERIALIZER
# ------------------------------
from django.db import transaction

class BookingCreateSerializer(serializers.ModelSerializer):
    """Used when admin creates a booking for a patient."""
    patient_name = serializers.CharField(source="patient.first_name", read_only=True)
    test_name = serializers.CharField(source="test.name", read_only=True)
    slot_date = serializers.DateField(source="timeslot.date", read_only=True)

    class Meta:
        model = Booking
        fields = (
            "id",
            "patient",
            "patient_name",
            "test",
            "test_name",
            "timeslot",
            "slot_date",
            "booking_date",
        )
        read_only_fields = ("booking_date",)

    def validate(self, data):
        """Ensure you cannot book a full or unavailable timeslot."""
        timeslot = data["timeslot"]
        if not timeslot.available:
            raise serializers.ValidationError("This time slot is not available.")
        if not timeslot.unlimited_patients and timeslot.booked_slots >= timeslot.max_patients:
            raise serializers.ValidationError("This time slot is fully booked.")
        return data

    def create(self, validated_data):
        """Create booking and automatically update slot counts atomically."""
        with transaction.atomic():
            ts = validated_data["timeslot"]

            # Re-fetch timeslot with select_for_update to prevent race conditions
            ts = TimeSlot.objects.select_for_update().get(id=ts.id)

            if not ts.unlimited_patients:
                if ts.booked_slots >= ts.max_patients:
                    raise serializers.ValidationError("This time slot is fully booked.")
                ts.booked_slots += 1
                ts.available_slots = max(ts.max_patients - ts.booked_slots, 0)
                ts.available = ts.booked_slots < ts.max_patients
                ts.save(update_fields=["booked_slots", "available_slots", "available"])

            # Create the booking
            booking = Booking.objects.create(**validated_data)

        return booking
