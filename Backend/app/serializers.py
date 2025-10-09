from rest_framework import serializers
from .models import *


class PackageSerializer(serializers.ModelSerializer):

    class Meta: 
        model=Package
        fields=("name", "id")


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


class TestSerializer(serializers.ModelSerializer):
    package = serializers.PrimaryKeyRelatedField( queryset=Package.objects.all(), allow_null=True, required=False)
    class Meta:
        model = Test
        fields = "__all__"

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = "__all__"


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
            "available",
        )

    def validate(self, data):
        if not data.get("unlimited_patients") and not data.get("max_patients"):
            raise serializers.ValidationError({
                "max_patients": "This field is required when unlimited_patients is False."
            })
        return data



class ConsultTimeSlotSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)

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
            "available",
        )

    def validate(self, data):
        if not data.get("unlimited_patients") and not data.get("max_patients"):
            raise serializers.ValidationError({"max_patients": "This field is required when unlimited_patients is False."})
        
        return data



