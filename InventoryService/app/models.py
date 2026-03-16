import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Ingredient(Base):
    """Ingredient stored in user's fridge."""

    __tablename__ = "ingredients"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    user_id = Column(String(36), nullable=False)
    name = Column(String(100), nullable=False)
    quantity = Column(Float, default=1, nullable=False)
    unit = Column(String(20), default="pcs", nullable=True)
    source = Column(String(20), default="manual", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __init__(self, **kwargs):
        kwargs.setdefault("quantity", 1)
        kwargs.setdefault("unit", "pcs")
        kwargs.setdefault("source", "manual")
        super().__init__(**kwargs)