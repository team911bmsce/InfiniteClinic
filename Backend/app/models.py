from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings


# ------------------------------
# 📦 PACKAGE MODEL
# ------------------------------
class Package(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


# ------------------------------
# 🧪 TEST MODEL
# ------------------------------
class Test(models.Model):
    name = models.CharField(max_length=255)  # e.g., "Complete Blood Count"
    description = models.TextField(blank=True, null=True)
    package = models.ForeignKey(Package, on_delete=models.CASCADE, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} - ₹{self.price}"


# ------------------------------
# 🩺 CONSULTATION MODEL
# ------------------------------
class Consultation(models.Model):
    docname = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["docname"]

    def __str__(self):
        return f"{self.docname} - ₹{self.price}"


# ------------------------------
# 👩‍⚕️ CONSULTATION TIMESLOTS
# ------------------------------
class ConsultTimeSlot(models.Model):
    doctor = models.ForeignKey(
        Consultation,
        on_delete=models.CASCADE,
        related_name="consultations"
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_patients = models.PositiveIntegerField(blank=True, null=True)
    unlimited_patients = models.BooleanField(default=True)
    available_slots = models.PositiveIntegerField(blank=True, null=True)
    booked_slots = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)

    class Meta:
        ordering = ["date", "start_time"]
        unique_together = ("doctor", "date", "start_time", "end_time")

    def clean(self):
        if not self.unlimited_patients and (self.max_patients is None or self.max_patients <= 0):
            raise ValidationError("max_patients must be set when unlimited_patients is False.")

    def save(self, *args, **kwargs):
        # Automatically manage available_slots when not unlimited
        if not self.unlimited_patients:
            if self.available_slots is None:
                self.available_slots = self.max_patients
        else:
            # If unlimited, available slots don’t matter
            self.available_slots = None

        # Mark slot unavailable if fully booked
        if not self.unlimited_patients and self.available_slots == 0:
            self.available = False

        super().save(*args, **kwargs)

    def __str__(self):
        status = "Unlimited" if self.unlimited_patients else f"{self.available_slots} available"
        return f"{self.doctor.docname} — {self.date} {self.start_time}-{self.end_time} ({status})"


# ------------------------------
# 🧍 PATIENT MODEL
# ------------------------------
class Patient(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="patient_profile", blank=True, null=True
    )
    first_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=1, choices=(
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Other"),
    ))
    phone_number = models.CharField(max_length=15, unique=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)

    def clean(self):
    # Only check role if a user is assigned
        if self.user and self.user.role != "patient":
            raise ValidationError("Linked user must have role 'patient'.")


    def save(self, *args, **kwargs):
    # full_clean will call clean() safely
        self.full_clean()
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.first_name}"


# ------------------------------
# ⏰ TEST TIMESLOTS MODEL
# ------------------------------
class TimeSlot(models.Model):
    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="timeslots"
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_patients = models.PositiveIntegerField(blank=True, null=True)
    unlimited_patients = models.BooleanField(default=True)
    available_slots = models.PositiveIntegerField(blank=True, null=True)
    booked_slots = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)

    class Meta:
        ordering = ["date", "start_time"]
        unique_together = ("test", "date", "start_time", "end_time")

    def clean(self):
        if not self.unlimited_patients and (self.max_patients is None or self.max_patients <= 0):
            raise ValidationError("max_patients must be set when unlimited_patients is False.")

    def save(self, *args, **kwargs):
        # Handle slot logic
        if not self.unlimited_patients:
            if self.available_slots is None:
                self.available_slots = self.max_patients - self.booked_slots
        else:
            self.available_slots = None  # Hide available_slots when unlimited is True

        # If all slots are filled, mark as unavailable
        if not self.unlimited_patients and self.booked_slots >= self.max_patients:
            self.available = False
        else:
            self.available = True

        super().save(*args, **kwargs)

    def __str__(self):
        status = "Unlimited" if self.unlimited_patients else f"{self.available_slots} available"
        return f"{self.test.name} — {self.date} {self.start_time}-{self.end_time} ({status})"


# ------------------------------
# 📅 BOOKING MODEL
# ------------------------------
class Booking(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="bookings")
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    timeslot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    booking_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-booking_date"]

    def __str__(self):
        return f"Booking for {self.patient.first_name} — {self.test.name} on {self.timeslot.date}"

