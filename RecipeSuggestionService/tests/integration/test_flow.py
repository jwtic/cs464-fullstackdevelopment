"""
Integration tests for the Recipe Suggestion Service.
Requires the service (and inventory service) to be running via docker compose.

Note: Tests that call the AI API require a valid GEMINI_API_KEY.
Tests that use an empty inventory avoid the AI call entirely and run without a key.
"""
import os
import time
import requests
import pytest

BASE_URL = os.getenv("RECIPE_SERVICE_URL", "http://localhost:5002")
INVENTORY_URL = os.getenv("INVENTORY_SERVICE_URL", "http://localhost:5001")
HAS_API_KEY = bool(os.getenv("GEMINI_API_KEY", "").strip()) and os.getenv("GEMINI_API_KEY") != "placeholder"


def wait_for_service(url: str, path: str = "/openapi.json", timeout: int = 60) -> bool:
    start = time.time()
    while time.time() - start < timeout:
        try:
            response = requests.get(f"{url}{path}", timeout=5)
            if response.status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(2)
    return False


@pytest.fixture(scope="session", autouse=True)
def wait_for_services():
    assert wait_for_service(INVENTORY_URL, "/openapi.json", timeout=60), \
        f"Inventory service not available at {INVENTORY_URL}"
    assert wait_for_service(BASE_URL, "/openapi.json", timeout=60), \
        f"Recipe service not available at {BASE_URL}"


def test_recipe_service_is_up():
    response = requests.get(f"{BASE_URL}/openapi.json")
    assert response.status_code == 200


def test_suggest_recipes_empty_inventory_returns_empty():
    """A user with no inventory items gets an empty recipe list (no AI call made)."""
    response = requests.post(
        f"{BASE_URL}/recipes/suggest",
        json={"user_id": "no-items-user"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "no-items-user"
    assert data["recipes"] == []


@pytest.mark.skipif(not HAS_API_KEY, reason="GEMINI_API_KEY not set — skipping live AI test")
def test_suggest_recipes_with_ingredients():
    """Passes ingredients directly to bypass inventory lookup and calls the real AI."""
    response = requests.post(
        f"{BASE_URL}/recipes/suggest",
        json={
            "user_id": "ai-test-user",
            "ingredients": ["chicken", "rice", "onion"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "recipes" in data
    assert isinstance(data["recipes"], list)
