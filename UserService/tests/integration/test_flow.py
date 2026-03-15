"""
Integration test for user service flow.
Tests the complete user registration, authentication, and notification flow.
"""
import os
import time
import requests
import pytest
from typing import Dict, Any

# Test configuration
BASE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:5001")
TIMEOUT = 30


def wait_for_service(url: str, timeout: int = 30) -> bool:
    """Wait for service to be available."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(f"{url}/", timeout=5)
            if response.status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(1)
    return False


@pytest.fixture(scope="session", autouse=True)
def wait_for_services():
    """Wait for all services to be ready before running tests."""
    assert wait_for_service(BASE_URL), f"User service not available at {BASE_URL}"


def test_service_health():
    """Test that the user service is healthy."""
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data


def test_user_registration_flow():
    """Test complete user registration flow."""
    # Test user registration
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    assert response.status_code == 201
    
    user = response.json()
    assert user["username"] == "testuser"
    assert user["email"] == "test@example.com"
    assert "password" not in user


def test_user_authentication_flow():
    """Test user authentication flow."""
    # Login with the registered user
    login_data = {
        "username_or_email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    assert response.status_code == 200
    
    auth_data = response.json()
    assert "access_token" in auth_data
    assert auth_data["token_type"] == "bearer"
    
    # Test protected endpoint
    headers = {"Authorization": f"Bearer {auth_data['access_token']}"}
    response = requests.get(f"{BASE_URL}/users/me", headers=headers)
    assert response.status_code == 200
    
    user_profile = response.json()
    assert user_profile["email"] == "test@example.com"


def test_user_profile_update():
    """Test user profile update functionality."""
    # Login first
    login_data = {
        "username_or_email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Update profile
    update_data = {
        "display_name": "Test User",
        "bio": "This is a test user"
    }
    
    response = requests.patch(f"{BASE_URL}/users/me", json=update_data, headers=headers)
    assert response.status_code == 200
    
    updated_user = response.json()
    assert updated_user["display_name"] == "Test User"
    assert updated_user["bio"] == "This is a test user"


def test_notification_creation():
    """Test notification creation - user service should not create notifications."""
    # Login first
    login_data = {
        "username_or_email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # User service should not have notification creation endpoint
    # It only consumes notifications from RabbitMQ
    response = requests.post(f"{BASE_URL}/notifications", json={}, headers=headers)
    assert response.status_code == 404  # Endpoint should not exist


if __name__ == "__main__":
    pytest.main([__file__, "-v"])