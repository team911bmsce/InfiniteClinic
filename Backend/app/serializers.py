from rest_framework import serializers
from .models import *


class BranchSerializer(serializers.ModelSerializer):

    class Meta: 
        model=Branch
        fields=("name", "id")


class TestSerializer(serializers.ModelSerializer):
    branch = serializers.PrimaryKeyRelatedField( queryset=Branch.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Test
        fields = ("id", "testid", "name", "available_time", "description", "category", "branch", "price")

