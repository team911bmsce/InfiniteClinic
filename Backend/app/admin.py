from django.contrib import admin
from .models import *
admin.site.register(Test)
admin.site.register(Package)
admin.site.register(Patient)
admin.site.register(TimeSlot)
admin.site.register(ConsultTimeSlot)
admin.site.register(Consultation)
# Register your models here.
