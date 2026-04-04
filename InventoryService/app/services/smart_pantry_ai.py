import io
import os
import re
import time
from typing import Literal

import requests
from PIL import Image
from dotenv import load_dotenv


load_dotenv()


class SmartPantryAI:
    def __init__(self):
        self.subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY")
        self.endpoint = os.getenv("AZURE_ENDPOINT")

        if not self.subscription_key:
            raise ValueError("Missing API Key! Please set AZURE_SUBSCRIPTION_KEY in your .env file.")
        if not self.endpoint:
            raise ValueError("Missing endpoint! Please set AZURE_ENDPOINT in your .env file.")

        if not self.endpoint.endswith("/"):
            self.endpoint += "/"

        self.analyze_url = f"{self.endpoint}computervision/imageanalysis:analyze"

        # Knowledge Bases
        self.food_database = [
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
        self.shorthand_map = {
            "FLOU": "Flour",
            "BACON": "Bacon",
            "UNSALTD": "Butter",
            "YELL": "Onion",
            "MILK": "Milk",
            "EGGS": "Eggs",
        }
        self.fridge_whitelist = [
            "tomato",
            "egg",
            "banana",
            "pepper",
            "grape",
            "cabbage",
            "lettuce",
            "cucumber",
            "milk",
            "bottle",
            "juice",
            "strawberry",
            "berry",
            "orange",
        ]

    def _call_azure(self, image_bytes: bytes, features: str):
        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key,
            "Content-Type": "application/octet-stream",
        }
        params = {"api-version": "2024-02-01", "features": features}

        # Avoid accidentally using corporate/system proxy env vars which can break outbound TLS.
        # If you *need* a proxy, set it explicitly in code/env and remove this override.
        session = requests.Session()
        session.trust_env = False
        response = session.post(self.analyze_url, headers=headers, params=params, data=image_bytes, timeout=60)
        if response.status_code == 429:
            time.sleep(5)
            return self._call_azure(image_bytes, features)
        response.raise_for_status()
        return response.json()

    def audit_receipt_bytes(self, image_bytes: bytes) -> list[str]:
        result = self._call_azure(image_bytes, "read")
        lines: list[str] = []
        for block in result.get("readResult", {}).get("blocks", []):
            for line in block.get("lines", []):
                lines.append(line["text"])

        detected: set[str] = set()
        for line in lines:
            line_up = line.upper()
            for short, full in self.shorthand_map.items():
                if short in line_up:
                    detected.add(full)
            for food in self.food_database:
                if re.search(r"\b" + food.upper() + r"\b", line_up):
                    detected.add(food)

        return sorted(detected)

    def scan_fridge_bytes(self, image_bytes: bytes) -> list[str]:
        img = Image.open(io.BytesIO(image_bytes))
        w, h = img.size
        tiles = self._get_tiles(w, h)
        inventory: set[str] = set()

        for box in tiles:
            tile_img = img.crop(box)
            buf = io.BytesIO()
            tile_img.save(buf, format="PNG")
            result = self._call_azure(buf.getvalue(), "denseCaptions")
            captions = result.get("denseCaptionsResult", {}).get("values", [])
            for item in captions:
                text = item.get("text", "").lower()
                for food in self.fridge_whitelist:
                    if food in text:
                        name = food.title() if food != "grape" else "Grapes"
                        inventory.add(name)

        return sorted(inventory)

    def detect_ingredients(self, image_bytes: bytes, mode: Literal["fridge", "receipt"] = "fridge") -> list[str]:
        if mode == "receipt":
            return self.audit_receipt_bytes(image_bytes)
        return self.scan_fridge_bytes(image_bytes)

    def _get_tiles(self, w: int, h: int):
        tiles = []
        win_w, win_h, overlap = 600, 400, 150
        for y in range(0, h - overlap, win_h - overlap):
            for x in range(0, w - overlap, win_w - overlap):
                tiles.append((x, y, min(x + win_w, w), min(y + win_h, h)))
        return tiles

