from rest_framework import serializers
from .models import Product, Order, OrderItem, Review


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'status', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        if not items_data:
            raise serializers.ValidationError({'items': 'Order must include at least one item'})
        order = Order.objects.create(**validated_data)
        for item in items_data:
            if 'price' not in item:
                item['price'] = item['product'].price
            OrderItem.objects.create(order=order, **item)
        return order


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


