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


class TimeSlotSerializer(serializers.ModelSerializer):
    test_name = serializers.CharField(source="test.name", read_only=True)

    class Meta:
        model = TimeSlot
        fields = (
            "id",             # ← Add this line
            "test",
            "test_name",
            "date",
            "start_time",
            "end_time",
            "max_patients",
        )


