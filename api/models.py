from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('fruits', 'Fruits'),
        ('vegetables', 'Vegetables'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(blank=True)
    farmer = models.CharField(max_length=200)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.title


class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=32, default='Pending')

    def __str__(self) -> str:
        return f"Order #{self.id}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)

# Create your models here.
