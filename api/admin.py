from django.contrib import admin
from .models import Product, Order, OrderItem, Review


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'price', 'farmer', 'rating')
    search_fields = ('title', 'farmer')
    list_filter = ('category',)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'status')
    inlines = [OrderItemInline]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'rating', 'date')

# Register your models here.
