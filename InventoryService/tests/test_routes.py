def test_add_ingredient(test_client):

    res = test_client.post(
        "/inventory?user_id=testuser",
        json={
            "name": "Egg",
            "quantity": 4,
            "unit": "pcs"
        }
    )

    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "egg"
    assert data["quantity"] == 4
    assert data["unit"] == "pcs"


def test_add_ingredient_case_insensitive_upsert(test_client):
    """Adding 'Tomato' then 'tomato' should accumulate quantity, not create duplicates."""
    test_client.post("/inventory?user_id=upsertuser", json={"name": "Tomato", "quantity": 2, "unit": "pcs"})
    test_client.post("/inventory?user_id=upsertuser", json={"name": "tomato", "quantity": 3, "unit": "pcs"})

    res = test_client.get("/inventory?user_id=upsertuser")
    items = res.json()
    tomato_items = [i for i in items if i["name"] == "tomato"]
    assert len(tomato_items) == 1
    assert tomato_items[0]["quantity"] == 5

def test_get_inventory(test_client):

    test_client.post(
        "/inventory?user_id=testuser",
        json={"name": "milk"}
    )

    res = test_client.get("/inventory?user_id=testuser")
    assert res.status_code == 200
    items = res.json()

    assert len(items) >= 1
    assert any(item["name"] == "milk" for item in items)

def test_inventory_per_user(test_client):

    test_client.post(
        "/inventory?user_id=user1",
        json={"name": "egg"}
    )

    res = test_client.get("/inventory?user_id=user2")

    assert res.status_code == 200
    assert len(res.json()) == 0

def test_add_ai_ingredients(test_client):
    payload = [
        {"name": "Tomato", "quantity": 3, "unit": "pcs"},
        {"name": "Cheese", "quantity": 200, "unit": "grams"}
    ]
    
    res = test_client.post("/inventory/ai?user_id=aiuser", json=payload)
    assert res.status_code == 200
    
    items = res.json()
    assert len(items) == 2
    assert items[0]["name"] == "tomato"
    assert items[1]["unit"] == "grams"

def test_update_ingredient(test_client):
    # Add ingredient first
    res = test_client.post("/inventory?user_id=upduser", json={"name": "butter", "quantity": 50, "unit": "grams"})
    item = res.json()
    item_id = item["id"]

    # Update the ingredient (you need an update route)
    res = test_client.put(
        f"/inventory/{item_id}?user_id=upduser",
        json={"name": "butter", "quantity": 100, "unit": "grams"}
    )
    assert res.status_code == 200
    updated = res.json()
    assert updated["quantity"] == 100
    assert updated["unit"] == "grams"

def test_delete_ingredient(test_client):
    # Add ingredient first
    res = test_client.post("/inventory?user_id=deluser", json={"name": "sugar", "quantity": 5})
    ingredient_id = res.json()["id"]

    # Delete it
    res = test_client.delete(f"/inventory/{ingredient_id}?user_id=deluser")
    assert res.status_code == 200
    data = res.json()
    assert data["message"] == "Ingredient deleted"

    # Should not exist anymore
    res2 = test_client.get("/inventory?user_id=deluser")
    items = res2.json()
    assert all(item["id"] != ingredient_id for item in items)