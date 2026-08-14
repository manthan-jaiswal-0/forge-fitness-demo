"""
FastAPI dependencies — shared across routers.
"""

from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

# Re-export get_db as a typed dependency
DbDep = Annotated[Session, Depends(get_db)]


def get_current_user(request: Request, db: DbDep) -> models.AdminUser:
    """
    Session-based auth dependency.
    Reads user_id from the server-side session; raises 401 if not authenticated.
    """
    user_id: str | None = request.session.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user = db.get(models.AdminUser, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session refers to a user that no longer exists",
        )
    return user


AuthUserDep = Annotated[models.AdminUser, Depends(get_current_user)]
