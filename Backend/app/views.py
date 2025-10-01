from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from .models import *
from .serializers import *
from rest_framework.response import Response
# Create your views here.

def home(request):
    return HttpResponse("Hello!")

class BranchViewSet(viewsets.ViewSet):
    permission_classes=[permissions.AllowAny]
    queryset=Branch.objects.all()
    serializer_class=BranchSerializer

    
    def list(self, request):
        queryset = Branch.objects.all() 
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class TestViewSet(viewsets.ViewSet):
    permission_classes=[permissions.AllowAny]
    queryset=Test.objects.all()
    serializer_class=TestSerializer

    
    def list(self, request):
        queryset = Test.objects.all() 
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else: 
            return Response(serializer.errors, status=400)
        

    def retrieve(self, request, pk=None):
        test = self.queryset.get(pk=pk)
        serializer = self.serializer_class(test)
        return Response(serializer.data)

    def update(self, request, pk=None):
        test = self.queryset.get(pk=pk)
        serializer=self.serializer_class(test, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else: 
            return Response(serializer.errors, status=400)


    def destroy(self, request, pk=None):
        test = self.queryset.get(pk=pk)
        test.delete()
        return Response(status=204)