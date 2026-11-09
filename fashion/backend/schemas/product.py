from pydantic import BaseModel
from typing import List, Optional

class Product(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: str
    sizes: List[str]          # e.g., ["S", "M", "L", "XL"]
    colors: List[str]         # e.g., ["Black", "White", "Navy"]
    image_url: str
    in_stock: bool = True