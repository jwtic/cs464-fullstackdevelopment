from passlib.hash import bcrypt
from app.models import User

def test_password_hashing():
    user = User(username="alice", email="a@x.com")
    user.set_password("secret123")
    assert user.password_hash != "secret123"  # hashed, not plain
    assert bcrypt.verify("secret123", user.password_hash)

def test_password_verification():
    user = User(username="bob", email="b@x.com")
    user.set_password("strongpass")
    assert user.verify_password("strongpass") is True
    assert user.verify_password("wrongpass") is False

def test_default_fields():
    user = User(username="john", email="j@x.com", password_hash="123")
    assert user.is_active is True
    assert user.role == "USER"
    assert user.display_name is None
