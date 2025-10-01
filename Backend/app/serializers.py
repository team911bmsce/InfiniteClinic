from rest_framework import serializers
from .models import *


class BranchSerializer(serializers.ModelSerializer):

    class Meta: 
        model=Branch
        fields=("name", "id")


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


class TestSerializer(serializers.ModelSerializer):
    branch = serializers.PrimaryKeyRelatedField( queryset=Branch.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Test
        fields = ("id", "testid", "name","description", "branch", "price")


class TimeSlotSerializer(serializers.ModelSerializer):
    # Optional: display test name in read-only mode
    test_name = serializers.CharField(source="test.name", read_only=True)

    class Meta:
        model = TimeSlot
        fields = (
            "slotid",
            "test",
            "test_name",  # for frontend display
            "date",
            "start_time",
            "end_time",
            "max_patients",
        )

