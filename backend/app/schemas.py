"""
Pydantic schemas — the explicit contract between frontend and backend.

These types mirror the TypeScript types in src/lib/leads-api.ts and src/lib/leads.ts.
Field names use camelCase in the JSON API to match the frontend convention.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


# ---------------------------------------------------------------------------
# Lead statuses (mirrors LEAD_STATUSES in src/lib/leads.ts)
# ---------------------------------------------------------------------------

LeadStatusType = Literal["NEW", "CONTACTED", "TRIAL_BOOKED", "JOINED", "LOST"]


# ---------------------------------------------------------------------------
# Lead Create — mirrors LeadPayload in src/lib/leads-api.ts
# ---------------------------------------------------------------------------

class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    phone: str = Field(..., min_length=7, max_length=30)
    email: EmailStr | None = None
    goal: str = Field(..., min_length=1, max_length=100)
    program: str | None = Field(default=None, max_length=100)
    preferredTime: str | None = Field(default=None, max_length=100)
    message: str | None = Field(default=None, max_length=2000)
    source: str = Field(default="Website — Book Free Trial", max_length=200)

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Name cannot be blank")
        return stripped

    @field_validator("phone")
    @classmethod
    def phone_valid(cls, v: str) -> str:
        digits = "".join(c for c in v if c.isdigit())
        if len(digits) < 7 or len(digits) > 15:
            raise ValueError("Phone must contain 7–15 digits")
        return v.strip()


# ---------------------------------------------------------------------------
# Lead Created Response — mirrors LeadResponse in src/lib/leads-api.ts
# ---------------------------------------------------------------------------

class LeadCreatedResponse(BaseModel):
    id: str
    createdAt: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Lead Note (read-only for now)
# ---------------------------------------------------------------------------

class LeadNoteRead(BaseModel):
    id: str
    author: str
    body: str
    createdAt: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Lead Read — full lead object, mirrors Lead in src/lib/leads.ts
# ---------------------------------------------------------------------------

class LeadRead(BaseModel):
    id: str
    gymId: str
    name: str
    phone: str
    email: str | None
    goal: str
    trainingType: str | None
    preferredTime: str | None
    message: str | None
    status: str
    source: str
    createdAt: datetime
    updatedAt: datetime
    followUpOn: datetime | None
    lastContactedAt: datetime | None
    notes: list[LeadNoteRead] = []

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Lead List Item — lighter version for the table view
# ---------------------------------------------------------------------------

class LeadListItem(BaseModel):
    id: str
    name: str
    phone: str
    email: str | None
    goal: str
    trainingType: str | None
    status: str
    source: str
    createdAt: datetime
    followUpOn: datetime | None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Lead Update — PATCH /api/leads/{id}
# All fields optional; only provided fields are updated.
# ---------------------------------------------------------------------------

class LeadUpdate(BaseModel):
    status: LeadStatusType | None = None
    followUpOn: datetime | None = None
    lastContactedAt: datetime | None = None
    trainingType: str | None = Field(default=None, max_length=100)

    @model_validator(mode="after")
    def at_least_one_field(self) -> "LeadUpdate":
        if all(v is None for v in self.model_dump().values()):
            raise ValueError("At least one field must be provided for update")
        return self


# ---------------------------------------------------------------------------
# Paginated Lead List Response
# ---------------------------------------------------------------------------

class LeadListResponse(BaseModel):
    items: list[LeadListItem]
    total: int
    page: int
    pageSize: int


# ---------------------------------------------------------------------------
# Auth schemas
# ---------------------------------------------------------------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class AuthUser(BaseModel):
    id: str
    email: str
    gymId: str
