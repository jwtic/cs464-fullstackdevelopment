import io
import os
import re
from typing import List
from google import genai
from PIL import Image

# --- PROMPT CONFIG ---
RECEIPT_PROMPT = """
Extract food and drink items from the receipt.
Return ONLY a comma-separated list.

Rules:
- No sentences, explanations, or prefixes.
- No extra text.
- Output must start immediately with the first item.

Example output:
Sweet Tarts, Jasmine Rice
"""

def _parse_comma_list(text: str) -> List[str]:
    """Cleans up the LLM response to ensure only ingredient strings remain."""
    text = text.strip()

    # Remove common AI prefixes (e.g., "Here is the list: ")
    if ":" in text:
        text = text.split(":", 1)[-1].strip()

    text = re.sub(r"(?i)(here are.*?:|here is.*?:|the following.*?:|extracted.*?:)", "", text).strip()
    text = re.sub(r"(?i)^(here are|here is|the following|these are).*?\n", "", text).strip()

    parts = text.replace("\n", ",").split(",")
    clean_items = []
    ban_words = ["here", "list", "receipt", "items", "analysis", "following"]

    for p in parts:
        item = p.strip()
        if not item:
            continue
        # Skip sentences (ingredients are usually short)
        if len(item.split()) > 5:
            continue
        # Skip chatty leftovers
        if any(word in item.lower() for word in ban_words):
            continue
        clean_items.append(item.title())

    return clean_items

class ReceiptGeminiAnalyzer:
    """
    Specialist class for analyzing grocery receipts using Gemini.
    Initialized lazily by main.py.
    """
    def __init__(self) -> None:
        # Pull the key from environment variables (loaded via env_loader in main.py)
        key = os.getenv("GEMINI_API_KEY", "").strip()
        
        if not key:
            raise RuntimeError(
                "GEMINI_API_KEY is missing! Check your .env file."
            )
            
        self.client = genai.Client(api_key=key)

    def analyze(self, image_bytes: bytes) -> List[str]:
        """Takes raw image bytes and returns a cleaned list of food items."""
        img = Image.open(io.BytesIO(image_bytes))
        
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[RECEIPT_PROMPT, img],
        )
        
        text = (response.text or "").strip()
        return _parse_comma_list(text)
