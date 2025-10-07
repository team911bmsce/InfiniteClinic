from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("test", TestViewSet, basename="tests")
router.register("packages", PackageViewSet, basename="packages")
router.register("patients", PatientViewSet, basename="patients")
router.register("timeslot", TimeSlotViewSet, basename="timeslot")


urlpatterns = router.urls + [

]
