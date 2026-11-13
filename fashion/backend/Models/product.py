from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, DateTime
from datetime import datetime, timezone
from core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(1000), nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    department = Column(String(50), nullable=False, default="unisex", index=True)
    sizes = Column(JSON, nullable=False, default=list)
    badge = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=False)
    in_stock = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

