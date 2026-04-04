import logging
import os
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Ingredient
from app.schemas import IngredientCreate, IngredientAI
from app.auth import get_user_id_or_query
from app.services.smart_pantry_ai import SmartPantryAI
from app.services.image_processing_client import detect_via_image_service, get_image_processing_service_url


router = APIRouter(prefix="/inventory", tags=["inventory"])
logger = logging.getLogger(__name__)

ALLOW_DETECTION_FALLBACK = os.getenv("ALLOW_DETECTION_FALLBACK", "false").lower() == "true"


def _fallback_detected_names(mode: str) -> list[str]:
    if mode == "receipt":
        return ["Milk", "Eggs", "Bread", "Butter"]
    return ["Tomato", "Milk", "Eggs", "Onion"]


@router.get("/")
def get_inventory(
    user_id: str = Depends(get_user_id_or_query),
    db: Session = Depends(get_db)
):
    items = db.query(Ingredient).filter(
        Ingredient.user_id == user_id
    ).all()

    return items


@router.post("/")
def add_ingredient(
    ingredient: IngredientCreate,
    user_id: str = Depends(get_user_id_or_query),
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
    user_id: str = Depends(get_user_id_or_query),
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


@router.post("/detect", response_model=List[IngredientAI])
async def detect_ingredients(
    image: UploadFile = File(...),
    mode: str = "fridge",
):
    """
    Detect ingredients from an uploaded image.

    When IMAGE_PROCESSING_SERVICE_URL is set, requests are forwarded to that service
    (Gemini for receipts, Azure-based pipeline for fridge). Otherwise uses the
    in-process SmartPantryAI (Azure) implementation.
    """
    if mode not in {"fridge", "receipt"}:
        raise HTTPException(status_code=400, detail="mode must be 'fridge' or 'receipt'")

    content = await image.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty image upload")

    try:
        if get_image_processing_service_url():
            names = await detect_via_image_service(
                content,
                mode,
                image.filename or "upload.jpg",
                image.content_type,
            )
        else:
            pantry = SmartPantryAI()
            names = pantry.detect_ingredients(content, mode=mode)  # type: ignore[arg-type]
    except Exception as e:
        if ALLOW_DETECTION_FALLBACK:
            logger.warning(
                "Ingredient detection failed; using placeholder fallback: %s",
                e,
                exc_info=True,
            )
            names = _fallback_detected_names(mode)
        else:
            raise HTTPException(status_code=500, detail=f"Detection failed: {e}") from e

    # Return IngredientAI objects (quantity/unit can be refined later)
    return [IngredientAI(name=n, quantity=1, unit=None) for n in names]
@router.put("/{ingredient_id}")
def update_ingredient(
    ingredient_id: str,
    ingredient: IngredientCreate,
    user_id: str = Depends(get_user_id_or_query),
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
    user_id: str = Depends(get_user_id_or_query),
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