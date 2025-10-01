from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Branch, Test, Patient
from .serializers import *


def home(request):
    return HttpResponse("Hello!")


# ✅ BranchViewSet using ModelViewSet
class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [permissions.AllowAny]

    # You can override if you want extra control
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# ✅ TestViewSet using ModelViewSet
class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.AllowAny]

    # Override list (optional)
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Override create (optional)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Override retrieve (optional)
    def retrieve(self, request, pk=None, *args, **kwargs):
        test = self.get_object()
        serializer = self.get_serializer(test)
        return Response(serializer.data)

    # Override update (optional)
    def update(self, request, pk=None, *args, **kwargs):
        test = self.get_object()
        serializer = self.get_serializer(test, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Override destroy (optional)
    def destroy(self, request, pk=None, *args, **kwargs):
        test = self.get_object()
        test.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]


class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.AllowAny]


