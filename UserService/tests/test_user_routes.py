def test_register_user(test_client):
    res = test_client.post("/auth/register", json={
        "username": "charlie",
        "email": "charlie@example.com",
        "password": "mysecret"
    })
    assert res.status_code == 201
    data = res.json()
    assert data["username"] == "charlie"
    assert "password" not in data  # never return passwords

def test_register_duplicate_email(test_client):
    test_client.post("/auth/register", json={
        "username": "david",
        "email": "dup@example.com",
        "password": "pwd12345"
    })
    res = test_client.post("/auth/register", json={
        "username": "david2",
        "email": "dup@example.com",
        "password": "pwd12345"
    })
    assert res.status_code == 409

def test_login_user(test_client):
    # Register first
    test_client.post("/auth/register", json={
        "username": "eve",
        "email": "eve@example.com",
        "password": "testpass"
    })
    res = test_client.post("/auth/login", json={
        "username_or_email": "eve@example.com",
        "password": "testpass"
    })
    assert res.status_code == 200
    token = res.json()["access_token"]
    assert token.startswith("ey")

def test_get_me(test_client):
    # Login
    login = test_client.post("/auth/login", json={
        "username_or_email": "eve@example.com",
        "password": "testpass"
    })
    token = login.json()["access_token"]

    # Access profile
    res = test_client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "eve@example.com"

def test_update_profile(test_client):
    login = test_client.post("/auth/login", json={
        "username_or_email": "eve@example.com",
        "password": "testpass"
    })
    token = login.json()["access_token"]
    res = test_client.patch(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"display_name": "Eve Queen", "bio": "Hello!"}
    )
    assert res.status_code == 200
    updated = res.json()
    assert updated["display_name"] == "Eve Queen"

def test_soft_delete_user(test_client):
    login = test_client.post("/auth/login", json={
        "username_or_email": "eve@example.com",
        "password": "testpass"
    })
    token = login.json()["access_token"]

    res = test_client.delete("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 204

    # Should fail to access profile now
    res2 = test_client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert res2.status_code == 403
