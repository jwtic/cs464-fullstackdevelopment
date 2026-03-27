from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Ingredient
from app.schemas import IngredientCreate, IngredientAI
from app.auth import get_current_user_id


router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("/")
def get_inventory(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    items = db.query(Ingredient).filter(
        Ingredient.user_id == user_id
    ).all()

    return items


@router.post("/")
def add_ingredient(
    ingredient: IngredientCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    item = Ingredient(
        user_id=user_id,
        name=ingredient.name,
        quantity=ingredient.quantity,
        unit=ingredient.unit
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.post("/ai")
def add_ai_ingredients(
    ingredients: List[IngredientAI],
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    saved_items = []

    for ing in ingredients:
        item = Ingredient(
            user_id=user_id,
            name=ing.name,
            quantity=ing.quantity,
            unit=ing.unit
        )

        db.add(item)
        saved_items.append(item)

    db.commit()

    for item in saved_items:
        db.refresh(item)

    return saved_items


@router.put("/{ingredient_id}")
def update_ingredient(
    ingredient_id: str,
    ingredient: IngredientCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    item = db.query(Ingredient).filter(
        Ingredient.id == ingredient_id,
        Ingredient.user_id == user_id
    ).first()

    if not item:
        return {"error": "Ingredient not found"}

    item.name = ingredient.name
    item.quantity = ingredient.quantity
    item.unit = ingredient.unit

    db.commit()
    db.refresh(item)

    return item


@router.delete("/{ingredient_id}")
def delete_ingredient(
    ingredient_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    item = db.query(Ingredient).filter(
        Ingredient.id == ingredient_id,
        Ingredient.user_id == user_id
    ).first()

    if not item:
        return {"error": "Ingredient not found"}

    db.delete(item)
    db.commit()

    return {"message": "Ingredient deleted"}