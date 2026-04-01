import os
import time
from typing import List

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError


DEFAULT_INGREDIENTS = [
    "Butter",
    "Onion",
    "Bacon",
    "Milk",
    "Flour",
    "Eggs",
    "Chicken",
    "Rice",
    "Bread",
    "Apple",
    "Banana",
    "Tomato",
    "Coffee",
]


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://admin:password@db:5432/imageprocessingdb",
)
engine = create_engine(DATABASE_URL)


def init_ingredient_catalog_db() -> None:
    for _ in range(10):
        try:
            with engine.begin() as connection:
                connection.execute(
                    text(
                        """
                        CREATE TABLE IF NOT EXISTS ingredient_catalog (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL UNIQUE
                        )
                        """
                    )
                )

                count = connection.execute(
                    text("SELECT COUNT(1) FROM ingredient_catalog")
                ).scalar_one()
                if count == 0:
                    connection.execute(
                        text(
                            "INSERT INTO ingredient_catalog (name) VALUES (:name) ON CONFLICT (name) DO NOTHING"
                        ),
                        [{"name": name} for name in DEFAULT_INGREDIENTS],
                    )
            return
        except OperationalError:
            time.sleep(2)
    raise RuntimeError("Ingredient catalog database is not reachable.")


def get_ingredient_catalog() -> List[str]:
    init_ingredient_catalog_db()
    with engine.connect() as connection:
        rows = connection.execute(
            text("SELECT name FROM ingredient_catalog ORDER BY name ASC")
        ).fetchall()
        return [row[0] for row in rows]
