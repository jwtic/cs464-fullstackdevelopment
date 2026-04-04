"""
Integration tests for the Inventory Service.
Requires the service to be running via docker compose.
"""
import os
import time
import requests
import pytest

BASE_URL = os.getenv("INVENTORY_SERVICE_URL", "http://localhost:5001")
TEST_USER = "integration-test-user"


def wait_for_service(url: str, timeout: int = 60) -> bool:
    start = time.time()
    while time.time() - start < timeout:
        try:
            response = requests.get(f"{url}/inventory/", params={"user_id": TEST_USER}, timeout=5)
            if response.status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(2)
    return False


@pytest.fixture(scope="session", autouse=True)
def wait_for_services():
    assert wait_for_service(BASE_URL), f"Inventory service not available at {BASE_URL}"


def test_get_empty_inventory():
    response = requests.get(f"{BASE_URL}/inventory/", params={"user_id": TEST_USER})
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_add_ingredient():
    response = requests.post(
        f"{BASE_URL}/inventory/",
        params={"user_id": TEST_USER},
        json={"name": "eggs", "quantity": 6, "unit": "pcs"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "eggs"
    assert data["quantity"] == 6
    assert data["unit"] == "pcs"
    assert "id" in data


def test_get_inventory_contains_added_item():
    response = requests.get(f"{BASE_URL}/inventory/", params={"user_id": TEST_USER})
    assert response.status_code == 200
    items = response.json()
    assert any(item["name"] == "eggs" for item in items)


def test_update_ingredient():
    # Add an item to update
    add_res = requests.post(
        f"{BASE_URL}/inventory/",
        params={"user_id": TEST_USER},
        json={"name": "milk", "quantity": 1, "unit": "litre"}
    )
    item_id = add_res.json()["id"]

    update_res = requests.put(
        f"{BASE_URL}/inventory/{item_id}",
        params={"user_id": TEST_USER},
        json={"name": "milk", "quantity": 2, "unit": "litre"}
    )
    assert update_res.status_code == 200
    assert update_res.json()["quantity"] == 2


def test_delete_ingredient():
    # Add an item to delete
    add_res = requests.post(
        f"{BASE_URL}/inventory/",
        params={"user_id": TEST_USER},
        json={"name": "butter", "quantity": 1, "unit": "block"}
    )
    item_id = add_res.json()["id"]

    del_res = requests.delete(
        f"{BASE_URL}/inventory/{item_id}",
        params={"user_id": TEST_USER}
    )
    assert del_res.status_code == 200
    assert del_res.json()["message"] == "Ingredient deleted"

    # Confirm it's gone
    get_res = requests.get(f"{BASE_URL}/inventory/", params={"user_id": TEST_USER})
    ids = [item["id"] for item in get_res.json()]
    assert item_id not in ids


def test_inventory_isolation_between_users():
    # Add item for user A
    requests.post(
        f"{BASE_URL}/inventory/",
        params={"user_id": "user-a"},
        json={"name": "secret_ingredient"}
    )

    # User B should not see it
    response = requests.get(f"{BASE_URL}/inventory/", params={"user_id": "user-b"})
    assert response.status_code == 200
    assert all(item["name"] != "secret_ingredient" for item in response.json())
