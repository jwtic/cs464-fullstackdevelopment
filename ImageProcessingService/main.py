import os
import io
import uvicorn
from typing import Dict, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from receipt import ReceiptGeminiAnalyzer
from fridge import FridgeScannerAI

app = FastAPI(title="Smart Pantry Image Service", version="1.0.0")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

_receipt_analyzer: Optional[ReceiptGeminiAnalyzer] = None
_fridge_scanner: Optional[FridgeScannerAI] = None


def get_receipt_analyzer() -> ReceiptGeminiAnalyzer:
    global _receipt_analyzer
    if _receipt_analyzer is None:
        _receipt_analyzer = ReceiptGeminiAnalyzer()
    return _receipt_analyzer


def get_fridge_scanner() -> FridgeScannerAI:
    global _fridge_scanner
    if _fridge_scanner is None:
        _fridge_scanner = FridgeScannerAI()
    return _fridge_scanner


def _validate_and_read_image(image_file: UploadFile) -> bytes:
    """Basic validation to ensure the upload is a valid image."""
    if not image_file.content_type or not image_file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    data = image_file.file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        img = Image.open(io.BytesIO(data))
        img.verify()
        return data
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or corrupt image format.")


@app.get("/health")
def health_check():
    gemini = bool((os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or "").strip())
    azure = bool(
        (os.getenv("AZURE_SUBSCRIPTION_KEY") or "").strip()
        and (os.getenv("AZURE_ENDPOINT") or "").strip()
    )
    return {
        "status": "online",
        "message": "Smart Pantry AI is ready",
        "gemini_configured": gemini,
        "azure_configured": azure,
    }


@app.post("/analyze/receipt")
async def analyze_receipt(file: UploadFile = File(...)) -> Dict:
    try:
        image_bytes = _validate_and_read_image(file)
        items = get_receipt_analyzer().analyze(image_bytes)
        return {"status": "success", "items": items}
    except HTTPException:
        raise
    except Exception as exc:
        print(f"Receipt Error: {exc}")
        raise HTTPException(status_code=500, detail=f"Receipt analysis failed: {str(exc)}")


@app.post("/analyze/fridge")
async def analyze_fridge(file: UploadFile = File(...)) -> Dict:
    try:
        image_bytes = _validate_and_read_image(file)
        items = get_fridge_scanner().scan_fridge_bytes(image_bytes)
        return {"status": "success", "items": items}
    except HTTPException:
        raise
    except Exception as exc:
        print(f"Fridge Error: {exc}")
        raise HTTPException(status_code=500, detail=f"Fridge analysis failed: {str(exc)}")


if __name__ == "__main__":
    print("Starting Unified Image Service on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
