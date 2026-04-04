import io
import os
import time
from typing import List
import requests
from PIL import Image

class FridgeScannerAI:
    def __init__(self):
        # --- Using Environment Variables ---
        # This looks for the keys loaded by your env_loader.py
        self.subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY", "").strip()
        endpoint = os.getenv("AZURE_ENDPOINT", "").strip()
        
        # Validation: Crash early with a clear message if keys are missing
        if not self.subscription_key or not endpoint:
            raise RuntimeError(
                "Missing Azure Credentials! Ensure AZURE_SUBSCRIPTION_KEY "
                "and AZURE_ENDPOINT are set in your .env file."
            )

        self.endpoint = endpoint.rstrip("/") + "/"
        self.analyze_url = f"{self.endpoint}computervision/imageanalysis:analyze"
        
        self.fridge_whitelist = [
            "tomato", "egg", "banana", "pepper", "grape", "cabbage", "lettuce",
            "cucumber", "milk", "bottle", "juice", "strawberry", "berry", "orange",
        ]

    def _call_azure(self, image_bytes: bytes, features: str):
        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key,
            "Content-Type": "application/octet-stream"
        }
        params = {"api-version": "2024-02-01", "features": features}
        
        response = requests.post(self.analyze_url, headers=headers, params=params, data=image_bytes)
        
        if response.status_code == 429:
            time.sleep(5)
            return self._call_azure(image_bytes, features)
        
        if not response.ok:
            raise Exception(f"Azure API Error: {response.status_code} - {response.text}")
            
        return response.json()

    def _get_tiles(self, w, h):
        """Creates overlapping boxes to improve detection of small items."""
        tiles = []
        win_w, win_h, overlap = 600, 400, 150
        
        step_x = max(1, win_w - overlap)
        step_y = max(1, win_h - overlap)

        y_range = range(0, max(1, h - overlap), step_y)
        x_range = range(0, max(1, w - overlap), step_x)

        for y in y_range:
            for x in x_range:
                tiles.append((x, y, min(x + win_w, w), min(y + win_h, h)))
        
        return tiles if tiles else [(0, 0, w, h)]

    def scan_fridge_bytes(self, image_bytes: bytes) -> List[str]:
        """This is the main function called by main.py"""
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
                text = item.get('text', '').lower()
                for food in self.fridge_whitelist:
                    if food in text:
                        name = food.title() if food != "grape" else "Grapes"
                        inventory.add(name)

        return sorted(list(inventory))
