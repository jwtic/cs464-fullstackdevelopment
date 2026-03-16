from app.models import Ingredient

def test_create_ingredient():
    ingredient = Ingredient(
        user_id="user123",
        name="egg",
        quantity=4,
        unit="pcs"
    )

    assert ingredient.name == "egg"
    assert ingredient.quantity == 4
    assert ingredient.unit == "pcs"
    assert ingredient.source == "manual" #default


def test_default_quantity():
    ingredient = Ingredient(
        user_id="user123",
        name="milk"
    )

    assert ingredient.quantity == 1