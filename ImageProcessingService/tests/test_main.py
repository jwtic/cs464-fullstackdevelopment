import io
import os
import pytest
from fastapi.testclient import TestClient
from PIL import Image

@pytest.fixture(autouse=True)
def mock_env(monkeypatch):
    monkeypatch.setenv("AZURE_SUBSCRIPTION_KEY", "test-key")
    monkeypatch.setenv("AZURE_ENDPOINT", "https://example.azure.com/")
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-key")

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
    data = response.json()
    
    assert data["status"] == "online"
    assert data["message"] == "Smart Pantry AI is ready"
    assert data["gemini_configured"] is True
    assert data["azure_configured"] is True

def test_analyze_receipt_success(monkeypatch) -> None:
    class _Fake:
        def analyze(self, _: bytes):
            return ["Milk", "Eggs"]

    # Mock the getter to return our fake analyzer
    monkeypatch.setattr(service_main, "get_receipt_analyzer", lambda: _Fake())

    response = client.post(
        "/analyze/receipt",
        files={"file": ("receipt.png", _make_png_bytes(), "image/png")},
    )

    assert response.status_code == 200
    assert response.json() == {"status": "success", "items": ["Milk", "Eggs"]}

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
    class _Fake:
        def analyze(self, _: bytes):
            raise RuntimeError("gemini failed")

    monkeypatch.setattr(service_main, "get_receipt_analyzer", lambda: _Fake())

    response = client.post(
        "/analyze/receipt",
        files={"file": ("receipt.png", _make_png_bytes(), "image/png")},
    )

    assert response.status_code == 500
    assert "Receipt analysis failed" in response.json()["detail"]

def test_analyze_fridge_success(monkeypatch) -> None:
    class _Fake:
        def scan_fridge_bytes(self, _: bytes):
            return ["Tomato", "Milk"]

    monkeypatch.setattr(service_main, "get_fridge_scanner", lambda: _Fake())

    response = client.post(
        "/analyze/fridge",
        files={"file": ("fridge.png", _make_png_bytes(), "image/png")},
    )

    assert response.status_code == 200
    assert response.json() == {"status": "success", "items": ["Tomato", "Milk"]}

def test_analyze_fridge_rejects_invalid_image() -> None:
    response = client.post(
        "/analyze/fridge",
        files={"file": ("bad.png", b"not-a-real-image", "image/png")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or corrupt image format."
