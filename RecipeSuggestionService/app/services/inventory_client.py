import os
import httpx

INVENTORY_SERVICE_URL = os.getenv("INVENTORY_SERVICE_URL", "http://inventory-service:5001")


async def get_user_inventory(user_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{INVENTORY_SERVICE_URL}/inventory/",
            params={"user_id": user_id}
        )
        response.raise_for_status()
        return response.json()