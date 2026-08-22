"""
Database initialization: creates tables and seeds the default gym + admin user.
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
            gym = models.Gym(
                id=settings.gym_id,
                name=settings.gym_name,
            )
            db.add(gym)
            db.commit()
            print(f"[init_db] Created gym: {settings.gym_id}")

        # Prepare the configured password
        password_to_hash = settings.admin_password_hash or "changeme"

        if not password_to_hash.startswith("$argon2"):
            hashed = _ph.hash(password_to_hash)
        else:
            hashed = password_to_hash

        # Find existing admin
        existing_admin = (
            db.query(models.AdminUser)
            .filter(models.AdminUser.email == settings.admin_email)
            .first()
        )

        if existing_admin is None:
            # Create admin if it doesn't exist
            admin = models.AdminUser(
                id=str(uuid.uuid4()),
                email=settings.admin_email,
                password_hash=hashed,
                gym_id=settings.gym_id,
            )

            db.add(admin)
            db.commit()

            print(f"[init_db] Created admin user: {settings.admin_email}")

        else:
            # TEMPORARY: update existing admin password
            existing_admin.password_hash = hashed
            db.commit()

            print(f"[init_db] Updated admin password: {settings.admin_email}")

    finally:
        db.close()