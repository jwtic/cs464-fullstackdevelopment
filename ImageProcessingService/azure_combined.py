import requests
import re
import io
import time
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()

class SmartPantryAI:
    def __init__(self):
        self.subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY")
        self.endpoint = os.getenv("AZURE_ENDPOINT")
        self.analyze_url = f"{self.endpoint}computervision/imageanalysis:analyze"

        if not self.subscription_key:
            raise ValueError("Missing API Key! Please set AZURE_SUBSCRIPTION_KEY in your .env file.")
        
        # Knowledge Bases
        self.food_database = [
            "Butter", "Onion", "Bacon", "Milk", "Flour", "Eggs", 
            "Chicken", "Rice", "Bread", "Apple", "Banana", "Tomato", "Coffee"
        ]
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

    # API 1: RECEIPT
    def audit_receipt(self, image_path):
        print(f"\n--- [API: RECEIPT] Analyzing: {image_path} ---")
        with open(image_path, "rb") as f:
            data = f.read()
        
        result = self._call_azure(data, "read")
        lines = []
        for block in result.get("readResult", {}).get("blocks", []):
            for line in block.get("lines", []):
                lines.append(line["text"])

        detected = set()
        for line in lines:
            line_up = line.upper()
            for short, full in self.shorthand_map.items():
                if short in line_up: detected.add(full)
            for food in self.food_database:
                if re.search(r'\b' + food.upper() + r'\b', line_up): detected.add(food)
        
        return sorted(list(detected))

    # API 2: FRIDGE
    def scan_fridge(self, image_path):
        print(f"\n--- [API: FRIDGE] Scanning: {image_path} ---")
        img = Image.open(image_path)
        w, h = img.size
        
        tiles = self._get_tiles(w, h)
        inventory = set()

        for i, box in enumerate(tiles):
            print(f" Scanning Window {i+1}/{len(tiles)}...", end="\r")
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
        
        print("\n Fridge Scan Complete.")
        return sorted(list(inventory))

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