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
        related_name="timeslots"  # allows test.timeslots.all()
    )
    date = models.DateField()           # date of the slot
    start_time = models.TimeField()     # start time of the slot
    end_time = models.TimeField()       # end time of the slot
    max_patients = models.PositiveIntegerField(default=1)  # number of patients allowed

    class Meta:
        ordering = ["date", "start_time"]
        unique_together = ("test", "date", "start_time", "end_time")
        # prevents duplicate slots for the same test at the same time

    def __str__(self):
        return f"{self.test.name} - {self.date} {self.start_time} to {self.end_time} ({self.max_patients} patients)"


