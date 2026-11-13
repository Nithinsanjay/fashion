from sqlalchemy.orm import Session
from core.database import SessionLocal, engine, Base
from models.product import Product
from models.user import User

SEED_PRODUCTS = [
    # --- WOMEN'S BOUTIQUE ---
    {
        "id": 101,
        "department": "women",
        "title": "Silk Wrap Midi Dress",
        "description": "Handpicked vintage silk wrap midi dress with delicate vintage floral styling.",
        "category": "Dresses",
        "price": 129.00,
        "sizes": ["XS", "S", "M", "L"],
        "badge": "Boutique Pick",
        "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
    },
    {
        "id": 102,
        "department": "women",
        "title": "Pastel Linen Blazer",
        "description": "Tailored retro pastel blazer with dual horn buttons and unstructured lapel.",
        "category": "Tops & Blouses",
        "price": 98.00,
        "sizes": ["S", "M", "L"],
        "badge": "Best Seller",
        "image_url": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
    },
    {
        "id": 103,
        "department": "women",
        "title": "Pleated High-Waist Trousers",
        "description": "Relaxed pleated vintage trousers cut from high-grade drape fabric.",
        "category": "Skirts & Pants",
        "price": 79.00,
        "sizes": ["XS", "S", "M"],
        "badge": None,
        "image_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    },
    {
        "id": 104,
        "department": "women",
        "title": "Minimalist Leather Crossbody",
        "description": "100% full-grain leather thrift shoulder bag with antiqued brass hardware.",
        "category": "Handbags",
        "price": 115.00,
        "sizes": ["One Size"],
        "badge": "New",
        "image_url": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    },

    # --- MEN'S STREETWEAR & ARCHIVE ---
    {
        "id": 201,
        "department": "men",
        "title": "Heavyweight Boxy Cotton Tee",
        "description": "280 GSM combed cotton vintage cut boxy tee with ribbed crew neck.",
        "category": "Heavy Tees",
        "price": 38.00,
        "sizes": ["S", "M", "L", "XL"],
        "badge": "Essential",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    },
    {
        "id": 202,
        "department": "men",
        "title": "Waxed Canvas Worker Jacket",
        "description": "Heavy-duty water-resistant waxed canvas outerwear with corduroy collar.",
        "category": "Jackets",
        "price": 145.00,
        "sizes": ["M", "L", "XL"],
        "badge": "Top Rated",
        "image_url": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    },
    {
        "id": 203,
        "department": "men",
        "title": "Raw Selvedge Denim 14oz",
        "description": "Japanese loom selvedge raw indigo denim jeans with custom hardware.",
        "category": "Denim & Pants",
        "price": 110.00,
        "sizes": ["30", "32", "34", "36"],
        "badge": None,
        "image_url": "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
    },
    {
        "id": 204,
        "department": "men",
        "title": "Vintage Pigment Dye Sweatshirt",
        "description": "Acid washed drop-shoulder crewneck pullover with vintage distressing.",
        "category": "Sweatshirts",
        "price": 74.00,
        "sizes": ["S", "M", "L", "XL"],
        "badge": "Popular",
        "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
    },

    # --- UNISEX NEUTRALS ---
    {
        "id": 301,
        "department": "unisex",
        "title": "450 GSM Oversized Fleece Hoodie",
        "description": "Ultra heavyweight double-layered brushed fleece hood with kangaroo pouch.",
        "category": "Oversized Hoodies",
        "price": 85.00,
        "sizes": ["S", "M", "L", "XL"],
        "badge": "Must Have",
        "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    },
    {
        "id": 302,
        "department": "unisex",
        "title": "Raw Canvas Heavy Tote",
        "description": "Thick 16oz raw cotton canvas everyday market tote with reinforced stitching.",
        "category": "Totes & Caps",
        "price": 32.00,
        "sizes": ["One Size"],
        "badge": None,
        "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    },
    {
        "id": 303,
        "department": "unisex",
        "title": "Ribbed Knit Beanie",
        "description": "Soft acrylic-wool blend cuffed beanie with retro woven label.",
        "category": "Totes & Caps",
        "price": 24.00,
        "sizes": ["One Size"],
        "badge": None,
        "image_url": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80",
    },
    {
        "id": 304,
        "department": "unisex",
        "title": "Relaxed Fit Lounge Pants",
        "description": "Garment-dyed fleece sweatpants with elasticated waistband and ankle cuffs.",
        "category": "Loungewear",
        "price": 62.00,
        "sizes": ["S", "M", "L"],
        "badge": "Restocked",
        "image_url": "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80",
    },
]

def init_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            for item in SEED_PRODUCTS:
                prod = Product(
                    id=item["id"],
                    title=item["title"],
                    description=item.get("description"),
                    price=item["price"],
                    category=item["category"],
                    department=item["department"],
                    sizes=item["sizes"],
                    badge=item["badge"],
                    image_url=item["image_url"],
                    in_stock=True
                )
                db.add(prod)
            db.commit()
            print("Successfully initialized and seeded products table in fashion_db!")
        else:
            print("Database already contains product records. Skipping seed.")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()

