"""
Auth router — login, logout, me.
Uses HTTP-only session cookies backed by itsdangerous.
Passwords hashed with Argon2 (via argon2-cffi).
"""

import uuid

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import APIRouter, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.config import settings
from app.dependencies import AuthUserDep, DbDep

router = APIRouter(prefix="/api/auth", tags=["auth"])

_ph = PasswordHasher()


@router.post("/login", response_model=schemas.AuthUser)
def login(payload: schemas.LoginRequest, request: Request, db: DbDep):
    user = db.query(models.AdminUser).filter(
        models.AdminUser.email == payload.email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    try:
        _ph.verify(user.password_hash, payload.password)
    except VerifyMismatchError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Rehash if Argon2 parameters have changed (e.g. after a settings upgrade)
    if _ph.check_needs_rehash(user.password_hash):
        user.password_hash = _ph.hash(payload.password)
        db.commit()

    request.session["user_id"] = user.id
    return schemas.AuthUser(id=user.id, email=user.email, gymId=user.gym_id)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request):
    request.session.clear()


@router.get("/me", response_model=schemas.AuthUser)
def me(current_user: AuthUserDep):
    return schemas.AuthUser(
        id=current_user.id,
        email=current_user.email,
        gymId=current_user.gym_id,
    )
