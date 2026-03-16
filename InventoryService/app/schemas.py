from typing import Optional
from pydantic import BaseModel, Field
from uuid import UUID


class IngredientCreate(BaseModel):
    name: str = Field(max_length=100)
    quantity: float = 1
    unit: Optional[str] = None


class IngredientAI(BaseModel):
    name: str
    quantity: int = 1
    unit: str | None = None
    # ingredients: list[str]


class IngredientPublic(BaseModel):
    id: UUID
    name: str
    quantity: float
    unit: Optional[str]

    class Config:
        from_attributes = True