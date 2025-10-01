from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("test", TestViewSet, basename="test")
router.register("branch", BranchViewSet, basename="branch")
router.register("patients", PatientViewSet, basename="patient")
router.register("timeslot", TimeSlotViewSet, basename="timeslot")


urlpatterns = router.urls

