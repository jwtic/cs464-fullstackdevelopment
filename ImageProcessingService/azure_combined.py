import requests
import re
import io
import time
from PIL import Image
import os
from dotenv import load_dotenv
from ingredient_catalog import get_ingredient_catalog, init_ingredient_catalog_db

load_dotenv()


# This is a script not a container , RUN MAIN.PY for the container.

class SmartPantryAI:
    def __init__(self):
        self.subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY")
        self.endpoint = os.getenv("AZURE_ENDPOINT")
        if self.endpoint and not self.endpoint.endswith("/"):
            self.endpoint = f"{self.endpoint}/"
        self.analyze_url = f"{self.endpoint}computervision/imageanalysis:analyze"

        if not self.subscription_key:
            raise ValueError("Missing API Key! Please set AZURE_SUBSCRIPTION_KEY in your .env file.")
        if not self.endpoint:
            raise ValueError("Missing endpoint! Please set AZURE_ENDPOINT in your .env file.")
        
        # Seed/ensure ingredient catalog table exists.
        init_ingredient_catalog_db()
        self.shorthand_map = {
            "FLOU": "Flour", "BACON": "Bacon", "UNSALTD": "Butter",
            "YELL": "Onion", "MILK": "Milk", "EGGS": "Eggs"
        }
        self.fridge_whitelist = [
            "tomato", "egg", "banana", "pepper", "grape", "cabbage", "lettuce", 
            "cucumber", "milk", "bottle", "juice", "strawberry", "berry", "orange"
        ]

    def _call_azure(self, image_bytes, features):
        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key,
            "Content-Type": "application/octet-stream"
        }
        params = {"api-version": "2024-02-01", "features": features}
        
        response = requests.post(self.analyze_url, headers=headers, params=params, data=image_bytes)
        
        if response.status_code == 429:
            time.sleep(5)
            return self._call_azure(image_bytes, features)
        return response.json()

    def _extract_receipt_items_from_result(self, result):
        food_database = get_ingredient_catalog()
        lines = []
        for block in result.get("readResult", {}).get("blocks", []):
            for line in block.get("lines", []):
                lines.append(line["text"])

        detected = set()
        for line in lines:
            line_up = line.upper()
            for short, full in self.shorthand_map.items():
                if short in line_up:
                    detected.add(full)
            for food in food_database:
                if re.search(r'\b' + food.upper() + r'\b', line_up):
                    detected.add(food)

        return sorted(list(detected))

    def audit_receipt_bytes(self, image_bytes):
        result = self._call_azure(image_bytes, "read")
        return self._extract_receipt_items_from_result(result)

    def scan_fridge_bytes(self, image_bytes):
        img = Image.open(io.BytesIO(image_bytes))
        w, h = img.size

        tiles = self._get_tiles(w, h)
        inventory = set()

        for box in tiles:
            tile_img = img.crop(box)
            buf = io.BytesIO()
            tile_img.save(buf, format='PNG')

            result = self._call_azure(buf.getvalue(), "denseCaptions")
            captions = result.get('denseCaptionsResult', {}).get('values', [])

            for item in captions:
                text = item['text'].lower()
                for food in self.fridge_whitelist:
                    if food in text:
                        name = food.title() if food != "grape" else "Grapes"
                        inventory.add(name)

        return sorted(list(inventory))

    # API 1: RECEIPT
    def audit_receipt(self, image_path):
        print(f"\n--- [API: RECEIPT] Analyzing: {image_path} ---")
        with open(image_path, "rb") as f:
            data = f.read()

        return self.audit_receipt_bytes(data)

    # API 2: FRIDGE
    def scan_fridge(self, image_path):
        print(f"\n--- [API: FRIDGE] Scanning: {image_path} ---")
        with open(image_path, "rb") as f:
            data = f.read()

        inventory = self.scan_fridge_bytes(data)
        print("\n Fridge Scan Complete.")
        return inventory

    def _get_tiles(self, w, h):
        tiles = []
        win_w, win_h, overlap = 600, 400, 150
        for y in range(0, h - overlap, win_h - overlap):
            for x in range(0, w - overlap, win_w - overlap):
                tiles.append((x, y, min(x + win_w, w), min(y + win_h, h)))
        return tiles

if __name__ == "__main__":
    pantry = SmartPantryAI()

    # 1. Test Receipt API
    receipt_items = pantry.audit_receipt("1_NTUC-Receipt.jpg")
    print("Detected on Receipt:", receipt_items)

    # 2. Test Fridge API
"""     fridge_items = pantry.scan_fridge("Bm0SrO8A4Qv1EKnJJsanbChAFKLnkbYo1661523178_600x600.jpg.webp")
    print("Detected in Fridge:", fridge_items) """