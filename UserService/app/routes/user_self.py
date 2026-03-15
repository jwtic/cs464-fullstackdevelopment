"""User and authentication routes."""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter()


@router.post(
    "/auth/register",
    response_model=schemas.UserPublic,
    status_code=201
)
def register_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    if db.query(models.User).filter(
        models.User.email == payload.email
    ).first():
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )
    if db.query(models.User).filter(
        models.User.username == payload.username
    ).first():
        raise HTTPException(
            status_code=409,
            detail="Username already taken"
        )

    user = models.User(username=payload.username, email=payload.email)
    user.set_password(payload.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/auth/login")
def login_user(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    user = (
        db.query(models.User)
        .filter(
            (models.User.email == payload.username_or_email) |
            (models.User.username == payload.username_or_email)
        )
        .first()
    )
    if not user or not user.verify_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user.last_login = datetime.utcnow()
    db.commit()

    token = auth.create_access_token({
        "sub": str(user.id),
        "role": user.role,
        "username": user.username
    })
    return {"access_token": token, "token_type": "bearer"}


@router.get("/users/me", response_model=schemas.UserPublic)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    """Get current user profile."""
    return current_user


@router.get("/users", response_model=list[schemas.UserPublic])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """Get all active users."""
    users = db.query(models.User).filter(
        models.User.is_active == True
    ).all()
    print(f"[DEBUG] Found {len(users)} users from DB")
    for user in users:
        print(f"[DEBUG] User: id={user.id}, username={user.username}, email={user.email}")
    return users


@router.patch("/users/me", response_model=schemas.UserPublic)
def update_me(
    payload: schemas.UserUpdateSelf,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """Update current user profile."""
    if not current_user.is_active:
        raise HTTPException(403, "Account is inactive")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

#Actual version
@router.delete("/users/me", status_code=204)
def deactivate_me(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """Deactivate current user account."""
    current_user.is_active = False
    db.commit()
    return None


#TESTING PURPOSES ONLY
# @router.delete("/users/me", status_code=500)
# def deactivate_me(
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(auth.get_current_user),
# ):
#     """Deactivate current user account."""
#     current_user.is_active = False
#     db.commit()
#     return None