import json
import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from app.main import app
from app.services.ai_client import generate_recipe_suggestions

client = TestClient(app)

MOCK_USER_ID = "test-user-123"
MOCK_INVENTORY = ["chicken", "rice", "onions"]
MOCK_RECIPES_RESPONSE = {
    "recipes": [
        {
            "name": "Chicken Fried Rice",
            "ingredients_used": ["chicken", "rice", "onions"],
            "missing_ingredients": ["soy sauce", "egg"],
            "steps": ["Cook rice", "Cook chicken", "Mix everything"],
            "estimated_time": "20 mins",
            "difficulty": "medium"
        }
    ]
}


@pytest.mark.asyncio
async def test_generate_recipe_suggestions_client():
    with patch("app.services.ai_client.httpx.AsyncClient") as MockClient:
        # Mock the client inside "async with"
        mock_client = AsyncMock()
        MockClient.return_value.__aenter__.return_value = mock_client

        # Create mock response
        mock_response = AsyncMock()

        # IMPORTANT: make post() awaitable
        mock_client.post = AsyncMock(return_value=mock_response)

        # IMPORTANT: make these SYNC (not async)
        mock_response.raise_for_status = lambda: None
        mock_response.json = lambda: {
            "choices": [
                {
                    "message": {
                        "content": json.dumps(MOCK_RECIPES_RESPONSE)
                    }
                }
            ]
        }

        result = await generate_recipe_suggestions(MOCK_INVENTORY)

        assert result == MOCK_RECIPES_RESPONSE

        call_kwargs = mock_client.post.call_args.kwargs
        assert "json" in call_kwargs
        assert "messages" in call_kwargs["json"]

@patch("app.routes.recipe.get_user_inventory")
@patch("app.routes.recipe.generate_recipe_suggestions")
def test_suggest_recipes_endpoint(mock_ai_generate, mock_get_inventory):
    mock_get_inventory.return_value = MOCK_INVENTORY
    mock_ai_generate.return_value = MOCK_RECIPES_RESPONSE

    response = client.post("/recipes/suggest", json={"user_id": MOCK_USER_ID})

    assert response.status_code == 200
    data = response.json()

    assert data["user_id"] == MOCK_USER_ID
    assert len(data["recipes"]) == 1
    assert data["recipes"][0]["name"] == "Chicken Fried Rice"

    mock_get_inventory.assert_called_once_with(MOCK_USER_ID)
    mock_ai_generate.assert_called_once_with(MOCK_INVENTORY)