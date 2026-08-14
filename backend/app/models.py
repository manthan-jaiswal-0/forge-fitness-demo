"""
SQLAlchemy ORM models.

Schema is designed for the Gym Growth Platform:
- A `gyms` table makes data multi-tenant-extensible from day one.
- Each lead belongs to a gym via `gym_id`.
- Notes are deferred to Phase 2 but the table is included so Alembic
  generates the schema correctly from the start.
"""

from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Gym(Base):
    __tablename__ = "gyms"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, server_default=func.now()
    )

    leads: Mapped[list["Lead"]] = relationship("Lead", back_populates="gym")


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    gym_id: Mapped[str] = mapped_column(
        String(100), ForeignKey("gyms.id", ondelete="CASCADE"), nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    goal: Mapped[str] = mapped_column(String(100), nullable=False)
    training_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    preferred_time: Mapped[str | None] = mapped_column(String(100), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(String(30), nullable=False, default="NEW", index=True)
    source: Mapped[str] = mapped_column(String(200), nullable=False, default="Website — Book Free Trial")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, server_default=func.now()
    )
    follow_up_on: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_contacted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    gym: Mapped["Gym"] = relationship("Gym", back_populates="leads")
    notes: Mapped[list["LeadNote"]] = relationship(
        "LeadNote", back_populates="lead", cascade="all, delete-orphan", order_by="LeadNote.created_at"
    )


class LeadNote(Base):
    """
    Deferred to Phase 2 but included in schema from the start.
    """
    __tablename__ = "lead_notes"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    lead_id: Mapped[str] = mapped_column(
        String(20), ForeignKey("leads.id", ondelete="CASCADE"), nullable=False, index=True
    )
    author: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, server_default=func.now()
    )

    lead: Mapped["Lead"] = relationship("Lead", back_populates="notes")


class AdminUser(Base):
    """
    Single admin account. No user management UI yet.
    Password stored as Argon2 hash; never plaintext.
    """
    __tablename__ = "admin_users"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    email: Mapped[str] = mapped_column(String(200), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(500), nullable=False)
    gym_id: Mapped[str] = mapped_column(
        String(100), ForeignKey("gyms.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, server_default=func.now()
    )
