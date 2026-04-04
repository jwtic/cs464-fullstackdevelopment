import os
from typing import Optional

import httpx


def get_image_processing_service_url() -> Optional[str]:
    raw = os.getenv("IMAGE_PROCESSING_SERVICE_URL", "").strip()
    return raw.rstrip("/") if raw else None


async def detect_via_image_service(
    image_bytes: bytes,
    mode: str,
    filename: str,
    content_type: Optional[str],
) -> list[str]:
    base = get_image_processing_service_url()
    if not base:
        raise RuntimeError("IMAGE_PROCESSING_SERVICE_URL is not configured")

    path = "/analyze/receipt" if mode == "receipt" else "/analyze/fridge"
    url = f"{base}{path}"
    ct = content_type or "application/octet-stream"
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            url,
            files={"file": (filename or "upload.jpg", image_bytes, ct)},
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            body = (exc.response.text or "").strip()
            if len(body) > 800:
                body = body[:800] + "…"
            raise RuntimeError(
                f"Image processing service returned {exc.response.status_code}"
                + (f": {body}" if body else "")
            ) from exc
        data = response.json()

    items = data.get("items")
    if not isinstance(items, list):
        raise ValueError("Image processing service returned an invalid payload (expected 'items' list).")
    return [str(x).strip() for x in items if str(x).strip()]
