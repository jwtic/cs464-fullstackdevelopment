from io import BytesIO
import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from azure_combined import SmartPantryAI

app = FastAPI(title="Image Processing Service", version="1.0.0")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai = SmartPantryAI()


def _read_image_bytes(image_file: UploadFile) -> bytes:
    if not image_file.content_type or not image_file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    data = image_file.file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    return data


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/analyze/receipt")
def analyze_receipt(file: UploadFile = File(...)) -> dict:
    try:
        image_bytes = _read_image_bytes(file)
        items = ai.audit_receipt_bytes(image_bytes)
        return {"items": items}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Receipt analysis failed: {exc}") from exc


@app.post("/analyze/fridge")
def analyze_fridge(file: UploadFile = File(...)) -> dict:
    try:
        image_bytes = _read_image_bytes(file)
        # Validate image early for a clearer client error.
        Image.open(BytesIO(image_bytes)).verify()

        items = ai.scan_fridge_bytes(image_bytes)
        return {"items": items}
    except HTTPException:
        raise
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Could not parse image file.") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Fridge analysis failed: {exc}") from exc
