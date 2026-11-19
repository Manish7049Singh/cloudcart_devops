"""
Database Seed Script for FastAPI E-Commerce Application.
Populates initial categories, products, admin account, and demo customer.
Safe to run multiple times (skips existing records).
"""

from datetime import datetime
from app.db.database import SessionLocal, Base, engine
from app.models.models import User, Category, Product
from app.core.security import get_password_hash
import app.models.models

def seed():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Users
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            admin_user = User(
                username="admin",
                email="admin@ecommerce.dev",
                password=get_password_hash("AdminPass123!"),
                full_name="Admin Administrator",
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            print("Created Admin user: username='admin', password='AdminPass123!'")

        demo_user = db.query(User).filter(User.username == "demouser").first()
        if not demo_user:
            demo_user = User(
                username="demouser",
                email="demouser@ecommerce.dev",
                password=get_password_hash("UserPass123!"),
                full_name="Demo Customer",
                role="user",
                is_active=True
            )
            db.add(demo_user)
            print("Created Demo Customer: username='demouser', password='UserPass123!'")

        db.commit()

        # 2. Seed Categories
        categories_data = [
            "Electronics & Gadgets",
            "Audio & Accessories",
            "Wearables & Smartwatches",
            "Footwear & Sneakers",
            "Home & Workspace"
        ]

        category_map = {}
        for cat_name in categories_data:
            cat = db.query(Category).filter(Category.name == cat_name).first()
            if not cat:
                cat = Category(name=cat_name)
                db.add(cat)
                db.commit()
                db.refresh(cat)
                print(f"Created category: {cat_name} (id={cat.id})")
            category_map[cat_name] = cat.id

        # 3. Seed Products
        products_data = [
            {
                "title": "Sony WH-1000XM5 Wireless Headphones",
                "description": "Industry-leading noise canceling wireless over-ear headphones with 2 processors, 8 microphones, and up to 30 hours of battery life.",
                "price": 399,
                "discount_percentage": 12.5,
                "rating": 4.8,
                "stock": 35,
                "brand": "Sony",
                "thumbnail": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
                ],
                "is_published": True,
                "category_id": category_map["Audio & Accessories"]
            },
            {
                "title": "Apple Watch Ultra 2 GPS + Cellular",
                "description": "Rugged and capable smartwatch designed for endurance athletes, outdoor adventurers, and water sports enthusiasts with precision GPS.",
                "price": 799,
                "discount_percentage": 5.0,
                "rating": 4.9,
                "stock": 20,
                "brand": "Apple",
                "thumbnail": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80"
                ],
                "is_published": True,
                "category_id": category_map["Wearables & Smartwatches"]
            },
            {
                "title": "Nike Air Max 270 React Running Shoes",
                "description": "Nike's first lifestyle Air unit meets the softest, smoothest, and most resilient foam yet in the Nike Air Max 270 React.",
                "price": 160,
                "discount_percentage": 15.0,
                "rating": 4.6,
                "stock": 50,
                "brand": "Nike",
                "thumbnail": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
                ],
                "is_published": True,
                "category_id": category_map["Footwear & Sneakers"]
            },
            {
                "title": "Minimalist Ergonomic Mechanical Keyboard",
                "description": "Customizable hot-swappable mechanical keyboard featuring RGB backlighting, Bluetooth 5.1 multi-device connectivity, and PBT keycaps.",
                "price": 129,
                "discount_percentage": 10.0,
                "rating": 4.7,
                "stock": 42,
                "brand": "Keychron",
                "thumbnail": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"
                ],
                "is_published": True,
                "category_id": category_map["Electronics & Gadgets"]
            },
            {
                "title": "Minimalist Studio Desk Lamp with Wireless Charging",
                "description": "Architectural aluminum LED desk lamp with touch dimming, color temperature tuning, and an integrated 15W Qi fast charging base.",
                "price": 89,
                "discount_percentage": 8.0,
                "rating": 4.5,
                "stock": 60,
                "brand": "Lumina",
                "thumbnail": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
                ],
                "is_published": True,
                "category_id": category_map["Home & Workspace"]
            },
            {
                "title": "Sony Alpha 7 IV Full-frame Mirrorless Camera",
                "description": "33MP full-frame Exmor R CMOS sensor, 4K 60p 10-bit 4:2:2 video, real-time autofocus tracking for humans, animals, and birds.",
                "price": 2498,
                "discount_percentage": 4.0,
                "rating": 4.9,
                "stock": 12,
                "brand": "Sony",
                "thumbnail": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
                ],
                "is_published": True,
                "category_id": category_map["Electronics & Gadgets"]
            },
            {
                "title": "Bose QuietComfort Earbuds II",
                "description": "Customized noise cancellation and sound performance with CustomTune technology. Featherweight fit with all-day comfort.",
                "price": 279,
                "discount_percentage": 14.0,
                "rating": 4.6,
                "stock": 28,
                "brand": "Bose",
                "thumbnail": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
                ],
                "is_published": True,
                "category_id": category_map["Audio & Accessories"]
            },
            {
                "title": "Adidas Ultraboost Light 23 Sneaker",
                "description": "Experience epic energy return with the lightweight Boost midsole. Continental Better Rubber outsole delivers maximum grip.",
                "price": 190,
                "discount_percentage": 10.0,
                "rating": 4.7,
                "stock": 38,
                "brand": "Adidas",
                "thumbnail": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
                "images": [
                    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80"
                ],
                "is_published": True,
                "category_id": category_map["Footwear & Sneakers"]
            }
        ]

        for p_data in products_data:
            existing_p = db.query(Product).filter(Product.title == p_data["title"]).first()
            if not existing_p:
                p = Product(
                    created_at=datetime.utcnow(),
                    **p_data
                )
                db.add(p)
                print(f"Created product: {p_data['title']}")

        db.commit()
        print("Database seeding completed successfully.")

    except Exception as e:
        db.rollback()
        print("Seeding error:", e)
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
