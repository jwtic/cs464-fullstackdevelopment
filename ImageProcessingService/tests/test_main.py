import io
import os

from fastapi.testclient import TestClient
from PIL import Image

os.environ.setdefault("AZURE_SUBSCRIPTION_KEY", "test-key")
os.environ.setdefault("AZURE_ENDPOINT", "https://example.cognitiveservices.azure.com/")

import main as service_main


client = TestClient(service_main.app)


def _make_png_bytes() -> bytes:
    image = Image.new("RGB", (8, 8), color="white")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_receipt_success(monkeypatch) -> None:
    monkeypatch.setattr(service_main.ai, "audit_receipt_bytes", lambda _: ["Milk", "Eggs"])

    response = client.post(
        "/analyze/receipt",
        files={"file": ("receipt.png", _make_png_bytes(), "image/png")},
    )

    assert response.status_code == 200
    assert response.json() == {"items": ["Milk", "Eggs"]}


def test_analyze_receipt_rejects_non_image() -> None:
    response = client.post(
        "/analyze/receipt",
        files={"file": ("note.txt", b"not-an-image", "text/plain")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Uploaded file must be an image."


def test_analyze_receipt_rejects_empty_file() -> None:
    response = client.post(
        "/analyze/receipt",
        files={"file": ("empty.png", b"", "image/png")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Uploaded file is empty."


def test_analyze_receipt_returns_500_on_ai_error(monkeypatch) -> None:
    def _raise(_: bytes):
        raise RuntimeError("azure failed")

    monkeypatch.setattr(service_main.ai, "audit_receipt_bytes", _raise)

    response = client.post(
        "/analyze/receipt",
        files={"file": ("receipt.png", _make_png_bytes(), "image/png")},
    )

    assert response.status_code == 500
    assert "Receipt analysis failed" in response.json()["detail"]


def test_analyze_fridge_success(monkeypatch) -> None:
    monkeypatch.setattr(service_main.ai, "scan_fridge_bytes", lambda _: ["Tomato", "Milk"])

    response = client.post(
        "/analyze/fridge",
        files={"file": ("fridge.png", _make_png_bytes(), "image/png")},
    )

    assert response.status_code == 200
    assert response.json() == {"items": ["Tomato", "Milk"]}


def test_analyze_fridge_rejects_invalid_image() -> None:
    response = client.post(
        "/analyze/fridge",
        files={"file": ("bad.png", b"not-a-real-image", "image/png")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Could not parse image file."
