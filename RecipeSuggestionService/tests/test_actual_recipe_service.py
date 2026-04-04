import pytest
from app.services.ai_client import generate_recipe_suggestions


@pytest.mark.asyncio
async def test_generate_recipe_suggestions_real_output():
    ingredients = ["chicken", "rice", "onions"]

    result = await generate_recipe_suggestions(ingredients)

    print("\n=== AI OUTPUT ===")
    print(result)

    assert "recipes" in result