import pytest
from unittest.mock import patch, AsyncMock

from app.services.inventory_client import get_user_inventory

MOCK_USER_ID = "test-user-123"
MOCK_RESPONSE = {
    "ingredients": ["chicken", "rice", "onions"]
}


@pytest.mark.asyncio
async def test_get_user_inventory():
    with patch("app.services.inventory_client.httpx.AsyncClient") as MockClient:
        # mock client inside async with
        mock_client = AsyncMock()
        MockClient.return_value.__aenter__.return_value = mock_client

        # mock response
        mock_response = AsyncMock()

        # make GET awaitable
        mock_client.get = AsyncMock(return_value=mock_response)

        # IMPORTANT: sync methods
        mock_response.raise_for_status = lambda: None
        mock_response.json = lambda: MOCK_RESPONSE

        # call function
        result = await get_user_inventory(MOCK_USER_ID)

        # assertions
        assert result == MOCK_RESPONSE

        # verify correct request
        mock_client.get.assert_called_once_with(
            "http://inventory-service:5001/inventory/",
            params={"user_id": MOCK_USER_ID}
        )