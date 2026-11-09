from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from schemas.product import Product

app = FastAPI(title="Clothing Store API", version="1.0.0")

# Allow React app (running on localhost:5173) to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Clothing Inventory
SAMPLE_PRODUCTS = [
    {
        "id": 1,
        "title": "Classic Oversized Heavyweight Tee",
        "description": "100% premium combed cotton heavyweight t-shirt with a relaxed boxy fit.",
        "price": 34.99,
        "category": "T-Shirts",
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Vintage Black", "Off-White", "Sage Green"],
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        "in_stock": True
    },
    {
        "id": 2,
        "title": "Vintage Washed Pullover Hoodie",
        "description": "Fleece-lined 450 GSM luxury hoodie with drop shoulders and ribbed cuffs.",
        "price": 79.99,
        "category": "Hoodies",
        "sizes": ["M", "L", "XL"],
        "colors": ["Charcoal", "Mocha", "Heather Grey"],
        "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
        "in_stock": True
    },
    {
        "id": 3,
        "title": "Relaxed Straight Denim Jeans",
        "description": "Durable 14oz raw selvedge denim designed with a timeless straight leg cut.",
        "price": 89.99,
        "category": "Pants",
        "sizes": ["30", "32", "34", "36"],
        "colors": ["Light Wash", "Raw Indigo"],
        "image_url": "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
        "in_stock": True
    },
    {
        "id": 4,
        "title": "Minimalist Worker Overshirt",
        "description": "Cotton canvas button-up utility jacket with dual chest pockets.",
        "price": 64.99,
        "category": "Jackets",
        "sizes": ["S", "M", "L"],
        "colors": ["Khaki", "Navy"],
        "image_url": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
        "in_stock": True
    }
]

@app.get("/")
def read_root():
    return {"message": "Clothing Store API is running"}

@app.get("/api/products", response_model=List[Product])
def get_products():
    return SAMPLE_PRODUCTS

@app.get("/api/products/{product_id}", response_model=Product)
def get_product(product_id: int):
    for prod in SAMPLE_PRODUCTS:
        if prod["id"] == product_id:
            return prod
    return {"error": "Product not found"}