import os
from typing import Optional
from fastapi import Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="http://localhost:5000/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="http://localhost:5000/auth/login",
    auto_error=False,
)


def decode_user_id_from_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    return user_id


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    """Decode JWT and return the user_id (sub claim)."""
    return decode_user_id_from_token(token)


def get_user_id_or_query(
    user_id: Optional[str] = Query(default=None),
    token: Optional[str] = Depends(oauth2_scheme_optional),
) -> str:
    """Use JWT when present, otherwise allow user_id query for local/dev flows."""
    if token:
        return decode_user_id_from_token(token)
    if user_id:
        return user_id
    raise HTTPException(status_code=401, detail="Missing auth token or user_id")
