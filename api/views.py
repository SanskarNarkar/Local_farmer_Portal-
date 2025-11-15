from rest_framework import viewsets, permissions
from .models import Product, Order, Review
from .serializers import ProductSerializer, OrderSerializer, ReviewSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('id')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-date')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

# Create your views here.
