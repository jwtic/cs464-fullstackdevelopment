"""Database models for User Service."""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, DateTime,
    ForeignKey, Index, Enum
)
from sqlalchemy.orm import validates, relationship
from passlib.hash import bcrypt

from .database import Base


class User(Base):
    """User model for authentication and profile management."""

    __tablename__ = "users"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False
    )
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    display_name = Column(String(80), nullable=True)
    bio = Column(String(280), nullable=True)
    avatar_url = Column(String, nullable=True)
    role = Column(String(10), default="USER", nullable=False)
    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
        server_default="1"
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    last_login = Column(DateTime, nullable=True)
    email_notification = Column(Boolean, default=True, nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.is_active is None:
            self.is_active = True
        if self.role is None:
            self.role = "USER"

    def set_password(self, password: str):
        """Hash and set user password."""
        self.password_hash = bcrypt.hash(password)

    def verify_password(self, password: str) -> bool:
        """Verify password against stored hash."""
        return bcrypt.verify(password, self.password_hash)

    @validates("email")
    def validate_email(self, key, email):  # pylint: disable=unused-argument
        """Validate email format."""
        if "@" not in email:
            raise ValueError("Invalid email address")
        return email



