from django.db import models

class Package(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return f"{self.name}"
    



class Test(models.Model):
    name = models.CharField(max_length=255)  # e.g., "Complete Blood Count"
    description = models.TextField(blank=True, null=True)  # optional details
    package= models.ForeignKey(Package, on_delete=models.CASCADE,blank=True, null=True) # free text category
    price = models.DecimalField(max_digits=10, decimal_places=2)  # test price  # approx duration
    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} - ₹{self.price}"



class Patient(models.Model):
    GENDER_CHOICES = (
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Other"),
    )
    first_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    phone_number = models.CharField(max_length=15, unique=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)


    def __str__(self):
        return f"{self.first_name} {self.last_name or ''}".strip()



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
    available = models.BooleanField(default=True)

    class Meta:
        ordering = ["date", "start_time"]
        unique_together = ("test", "date", "start_time", "end_time")

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.unlimited_patients and (self.max_patients is None or self.max_patients <= 0):
            raise ValidationError("max_patients must be set when unlimited_patients is False.")

    def __str__(self):
        status = "Unlimited" if self.unlimited_patients else f"Max {self.max_patients}"
        return f"{self.test.name} — {self.date} {self.start_time}-{self.end_time} ({status})"
