from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from core.database import get_db
from models.product import Product
from schemas.product import ProductResponse, ProductCreate

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def get_products(
    department: Optional[str] = Query(None, description="Filter by department: women, men, unisex"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by title"),
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if department and department.lower() != "all":
        query = query.filter(Product.department == department.lower())
    if category and category.lower() != "all":
        query = query.filter(Product.category == category)
    if search:
        query = query.filter(Product.title.ilike(f"%{search}%"))
    return query.all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    product = Product(
        title=product_in.title,
        description=product_in.description,
        price=product_in.price,
        category=product_in.category,
        department=product_in.department,
        sizes=product_in.sizes,
        badge=product_in.badge,
        image_url=product_in.image_url,
        in_stock=product_in.in_stock
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

