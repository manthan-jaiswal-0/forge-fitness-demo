"""
Database initialization: creates tables and seeds the default gym + admin user.
Run once on first startup or after a fresh DB.
"""

import uuid
from argon2 import PasswordHasher

from app.database import Base, engine, SessionLocal
from app import models
from app.config import settings

_ph = PasswordHasher()


def init_db() -> None:
    # Create all tables (idempotent — won't drop existing data)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Seed the gym if it doesn't exist
        gym = db.get(models.Gym, settings.gym_id)
        if gym is None:
            gym = models.Gym(id=settings.gym_id, name=settings.gym_name)
            db.add(gym)
            db.commit()
            print(f"[init_db] Created gym: {settings.gym_id}")

        # Seed the admin user if it doesn't exist
        existing_admin = (
            db.query(models.AdminUser)
            .filter(models.AdminUser.email == settings.admin_email)
            .first()
        )
        if existing_admin is None:
            password_to_hash = settings.admin_password_hash or "changeme"
            # If admin_password_hash looks like a raw password (no $argon2 prefix), hash it.
            # If it already IS an Argon2 hash (from a previous run), store it directly.
            if not password_to_hash.startswith("$argon2"):
                hashed = _ph.hash(password_to_hash)
            else:
                hashed = password_to_hash

            admin = models.AdminUser(
                id=str(uuid.uuid4()),
                email=settings.admin_email,
                password_hash=hashed,
                gym_id=settings.gym_id,
            )
            db.add(admin)
            db.commit()
            print(f"[init_db] Created admin user: {settings.admin_email}")
            if not settings.admin_password_hash:
                print("[init_db] WARNING: admin password is 'changeme'. Set ADMIN_PASSWORD_HASH in .env")
    finally:
        db.close()
