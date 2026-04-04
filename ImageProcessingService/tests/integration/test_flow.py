"""
Integration tests for the Image Processing Service.
Requires the service to be running via docker compose.

Tests that call the Azure CV API require real credentials.
Tests without API calls (health, validation) always run.
"""
import io
import os
import time
import requests
import pytest
from PIL import Image

BASE_URL = os.getenv("IMAGE_SERVICE_URL", "http://localhost:5003")
HAS_AZURE_KEY = (
    bool(os.getenv("AZURE_SUBSCRIPTION_KEY", "").strip())
    and os.getenv("AZURE_SUBSCRIPTION_KEY") != "placeholder"
)


def wait_for_service(url: str, path: str = "/health", timeout: int = 60) -> bool:
    start = time.time()
    while time.time() - start < timeout:
        try:
            response = requests.get(f"{url}{path}", timeout=5)
            if response.status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(2)
    return False


def make_png_bytes() -> bytes:
    image = Image.new("RGB", (8, 8), color="white")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


@pytest.fixture(scope="session", autouse=True)
def wait_for_services():
    assert wait_for_service(BASE_URL, "/health", timeout=60), \
        f"Image processing service not available at {BASE_URL}"


def test_service_health():
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_receipt_rejects_non_image():
    response = requests.post(
        f"{BASE_URL}/analyze/receipt",
        files={"file": ("note.txt", b"not-an-image", "text/plain")},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Uploaded file must be an image."


def test_analyze_fridge_rejects_non_image():
    response = requests.post(
        f"{BASE_URL}/analyze/fridge",
        files={"file": ("note.txt", b"not-an-image", "text/plain")},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Uploaded file must be an image."


@pytest.mark.skipif(not HAS_AZURE_KEY, reason="AZURE_SUBSCRIPTION_KEY not set — skipping live Azure test")
def test_analyze_receipt_with_real_image():
    response = requests.post(
        f"{BASE_URL}/analyze/receipt",
        files={"file": ("receipt.png", make_png_bytes(), "image/png")},
    )
    assert response.status_code == 200
    assert "items" in response.json()
    assert isinstance(response.json()["items"], list)


@pytest.mark.skipif(not HAS_AZURE_KEY, reason="AZURE_SUBSCRIPTION_KEY not set — skipping live Azure test")
def test_analyze_fridge_with_real_image():
    response = requests.post(
        f"{BASE_URL}/analyze/fridge",
        files={"file": ("fridge.png", make_png_bytes(), "image/png")},
    )
    assert response.status_code == 200
    assert "items" in response.json()
    assert isinstance(response.json()["items"], list)
