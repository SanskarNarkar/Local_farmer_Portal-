from django.core.management.base import BaseCommand
from api.models import Product, Order, OrderItem, Review


class Command(BaseCommand):
    help = 'Seed initial products, orders, and reviews into the database.'

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write(self.style.WARNING('Products already exist. Skipping seeding.'))
            return

        products = [
            {
                'title': 'Fresh Apples', 'category': 'fruits', 'price': 120,
                'image': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=500&q=80',
                'farmer': 'Rajesh Farms', 'rating': 4.5,
                'description': 'Fresh, crispy and juicy apples.'
            },
            {
                'title': 'Bananas', 'category': 'fruits', 'price': 60,
                'image': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80',
                'farmer': 'Tropical Fruits Co.', 'rating': 4.0,
                'description': 'Sweet and nutritious bananas.'
            },
            {
                'title': 'Potatoes', 'category': 'vegetables', 'price': 30,
                'image': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80',
                'farmer': 'Root Vegetables Ltd.', 'rating': 3.8,
                'description': 'Freshly harvested potatoes.'
            },
            {
                'title': 'Carrots', 'category': 'vegetables', 'price': 40,
                'image': 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=500&q=80',
                'farmer': 'Organic Valley', 'rating': 4.1,
                'description': 'Crunchy and sweet carrots.'
            },
        ]

        created_products = [Product.objects.create(**p) for p in products]
        self.stdout.write(self.style.SUCCESS(f'Created {len(created_products)} products.'))

        # Create one sample order
        order = Order.objects.create(status='Delivered')
        OrderItem.objects.create(order=order, product=created_products[0], quantity=2, price=created_products[0].price)
        OrderItem.objects.create(order=order, product=created_products[1], quantity=3, price=created_products[1].price)
        self.stdout.write(self.style.SUCCESS('Created 1 sample order with items.'))

        # Create a couple reviews
        Review.objects.create(product=created_products[0], rating=5, comment='Excellent quality!')
        Review.objects.create(product=created_products[1], rating=4, comment='Perfectly ripe.')
        self.stdout.write(self.style.SUCCESS('Created sample reviews.'))

        self.stdout.write(self.style.SUCCESS('Seeding complete.'))


