from pydantic import BaseModel
from typing import List


class RecipeSuggestRequest(BaseModel):
    user_id: str


class RecipeItem(BaseModel):
    name: str
    ingredients_used: List[str]
    missing_ingredients: List[str]
    steps: List[str]
    estimated_time: str
    difficulty: str


class RecipeSuggestResponse(BaseModel):
    user_id: str
    recipes: List[RecipeItem]