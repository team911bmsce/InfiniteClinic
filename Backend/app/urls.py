from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("test", TestViewSet, basename="tests")
router.register("packages", PackageViewSet, basename="packages")
router.register("patients", PatientViewSet, basename="patients")
router.register("timeslot", TimeSlotViewSet, basename="timeslot")
router.register("consultations", ConsultViewSet, basename="consultation")
router.register("ctimeslot", ConsultTimeSlotViewSet, basename="ctimeslot")
router.register("booking", BookingViewSet, basename="booking")  # <-- Added Booking

urlpatterns = [
    path('', home, name='home'),
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
]

urlpatterns += router.urls
