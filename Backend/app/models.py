from django.db import models

class Branch(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return f"{self.name}"


class Test(models.Model):
    testid=models.IntegerField(unique=True, null=False)
    name = models.CharField(max_length=255)
    available_time = models.DateTimeField()   # e.g., "Complete Blood Count"
    description = models.TextField(blank=True, null=True)  # optional details
    category = models.CharField(max_length=100, blank=True, null=True)
    branch= models.ForeignKey(Branch, on_delete=models.CASCADE,blank=True, null=True) # free text category
    price = models.DecimalField(max_digits=10, decimal_places=2)  # test price  # approx duration

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} - ₹{self.price}"
