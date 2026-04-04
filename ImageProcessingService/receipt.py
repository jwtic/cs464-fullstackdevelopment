import io
from typing import List

import re
from google import genai
from PIL import Image

# --- DIRECT CONFIG ---
# Hardcoded API Key for Gemini
GEMINI_API_KEY = "AIzaSyBVbVNNqI3wAI2bwfPAF4w-aOEGDG4DhPI"

RECEIPT_PROMPT = """    
Extract food and drink items from the receipt.

Return ONLY a comma-separated list.

Example output:
Sweet Tarts, Jasmine Rice

Rules:
- No sentences
- No explanations
- No prefixes
- No extra text
- Output must start immediately with the first item

Receipt:
"""

def _parse_comma_list(text: str) -> List[str]:
    # 🔥 STEP 0: HARD CLEAN LLM PREFIXES
    text = text.strip()

    # Remove everything before colon (common pattern)
    if ":" in text:
        text = text.split(":", 1)[-1].strip()

    # Remove common "chatty" phrases explicitly
    text = re.sub(
        r"(?i)(here are.*?:|here is.*?:|the following.*?:|extracted.*?:)",
        "",
        text
    ).strip()

    # Remove leading sentences without colon (fallback)
    text = re.sub(
        r"(?i)^(here are|here is|the following|these are).*?\n",
        "",
        text
    ).strip()

    # 1. Split by newlines and commas
    parts = text.replace("\n", ",").split(",")

    clean_items = []
    ban_words = ["here", "list", "receipt", "items", "analysis", "following"]

    for p in parts:
        item = p.strip()
        
        # Skip empty strings
        if not item:
            continue
            
        # Skip long "sentence-like" chunks
        if len(item.split()) > 5:
            continue
            
        # Skip chatty leftovers
        if any(word in item.lower() for word in ban_words):
            continue
            
        clean_items.append(item.title())

    return clean_items

class ReceiptGeminiAnalyzer:
    """
    Specialist class for analyzing grocery receipts using Gemini 2.5 Flash.
    This class is imported and used by main.py.
    """
    def __init__(self) -> None:
        # Initialize the Google GenAI client with your hardcoded key
        self.client = genai.Client(api_key=GEMINI_API_KEY)

    def analyze(self, image_bytes: bytes) -> List[str]:
        """
        The main method called by main.py. 
        Takes raw image bytes and returns a cleaned list of food items.
        """
        # Convert raw bytes into a format PIL (and Gemini) can read
        img = Image.open(io.BytesIO(image_bytes))
        
        # Using gemini-2.5-flash as the high-performance model
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[RECEIPT_PROMPT, img],
        )
        
        # Extract the text and convert it to a list
        text = (response.text or "").strip()
        return _parse_comma_list(text)
