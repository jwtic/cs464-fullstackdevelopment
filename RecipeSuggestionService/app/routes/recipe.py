from fastapi import APIRouter, HTTPException
from app.schemas import RecipeSuggestRequest
from app.services.inventory_client import get_user_inventory
from app.services.ai_client import generate_recipe_suggestions

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.post("/suggest")
async def suggest_recipes(request: RecipeSuggestRequest):
    try:
        inventory_items = await get_user_inventory(request.user_id)

        if not inventory_items:
            return {
                "user_id": request.user_id,
                "recipes": []
            }

        ai_result = await generate_recipe_suggestions(inventory_items)

        return {
            "user_id": request.user_id,
            "recipes": ai_result.get("recipes", [])
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))