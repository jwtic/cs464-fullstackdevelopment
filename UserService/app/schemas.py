"""Pydantic schemas for request/response validation."""
from datetime import datetime
from typing import Optional, Literal
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


# =========================
# User Schemas
# =========================

class UserCreate(BaseModel):
    """Schema for creating a new user."""
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)
    email_notification: Optional[bool] = True


class UserLogin(BaseModel):
    """Schema for user login."""
    username_or_email: str
    password: str


class UserUpdateSelf(BaseModel):
    """Schema for updating user profile."""
    display_name: Optional[str] = Field(None, max_length=80)
    bio: Optional[str] = Field(None, max_length=280)
    avatar_url: Optional[str] = None
    email_notification: Optional[bool] = True


class UserPublic(BaseModel):
    """Schema for public user information."""
    id: UUID
    username: str
    email: EmailStr
    display_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    role: str
    is_active: bool
    email_notification: Optional[bool] = True

    class Config:
        """Pydantic configuration."""
        from_attributes = True
