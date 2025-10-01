from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("test", TestViewSet, basename="test")
router.register("branch", BranchViewSet, basename="branch")

urlpatterns = router.urls

