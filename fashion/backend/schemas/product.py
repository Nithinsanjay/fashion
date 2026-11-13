from pydantic import BaseModel
from typing import List, Optional

class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    category: str
    department: str = "unisex"
    sizes: List[str] = []
    badge: Optional[str] = None
    image_url: str
    in_stock: bool = True

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

ProductResponse = Product
