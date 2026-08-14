"""
Leads router — POST, GET (list), GET (single), PATCH.

POST /api/leads is public (the booking form).
GET/PATCH require authentication (admin dashboard).
"""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, or_

from app import models, schemas
from app.dependencies import AuthUserDep, DbDep
from app.database import get_db
from app.id_gen import generate_lead_id
from app.config import settings

router = APIRouter(prefix="/api/leads", tags=["leads"])


# ---------------------------------------------------------------------------
# POST /api/leads — public, called from the booking form
# ---------------------------------------------------------------------------

@router.post("", response_model=schemas.LeadCreatedResponse, status_code=status.HTTP_201_CREATED)
def create_lead(payload: schemas.LeadCreate, db: DbDep):
    lead_id = generate_lead_id(db, settings.gym_id)

    lead = models.Lead(
        id=lead_id,
        gym_id=settings.gym_id,
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        goal=payload.goal,
        training_type=payload.program,
        preferred_time=payload.preferredTime,
        message=payload.message,
        source=payload.source,
        status="NEW",
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    return schemas.LeadCreatedResponse(
        id=lead.id,
        createdAt=lead.created_at,
    )


# ---------------------------------------------------------------------------
# GET /api/leads — authenticated, paginated, filterable
# ---------------------------------------------------------------------------

@router.get("", response_model=schemas.LeadListResponse)
def list_leads(
    current_user: AuthUserDep,
    db: DbDep,
    q: str | None = Query(default=None, description="Search name, phone, email, goal"),
    status_filter: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=200, alias="pageSize"),
):
    query = db.query(models.Lead).filter(models.Lead.gym_id == current_user.gym_id)

    if status_filter and status_filter != "ALL":
        query = query.filter(models.Lead.status == status_filter)

    if q:
        term = f"%{q.lower()}%"
        query = query.filter(
            or_(
                func.lower(models.Lead.name).like(term),
                func.lower(models.Lead.phone).like(term),
                func.lower(models.Lead.email).like(term),
                func.lower(models.Lead.goal).like(term),
                func.lower(models.Lead.id).like(term),
            )
        )

    total = query.count()
    leads = (
        query.order_by(models.Lead.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = [
        schemas.LeadListItem(
            id=lead.id,
            name=lead.name,
            phone=lead.phone,
            email=lead.email,
            goal=lead.goal,
            trainingType=lead.training_type,
            status=lead.status,
            source=lead.source,
            createdAt=lead.created_at,
            followUpOn=lead.follow_up_on,
        )
        for lead in leads
    ]

    return schemas.LeadListResponse(
        items=items,
        total=total,
        page=page,
        pageSize=page_size,
    )


# ---------------------------------------------------------------------------
# GET /api/leads/{id} — authenticated, returns full lead with notes
# ---------------------------------------------------------------------------

@router.get("/{lead_id}", response_model=schemas.LeadRead)
def get_lead(lead_id: str, current_user: AuthUserDep, db: DbDep):
    lead = (
        db.query(models.Lead)
        .filter(models.Lead.id == lead_id, models.Lead.gym_id == current_user.gym_id)
        .first()
    )
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

    return schemas.LeadRead(
        id=lead.id,
        gymId=lead.gym_id,
        name=lead.name,
        phone=lead.phone,
        email=lead.email,
        goal=lead.goal,
        trainingType=lead.training_type,
        preferredTime=lead.preferred_time,
        message=lead.message,
        status=lead.status,
        source=lead.source,
        createdAt=lead.created_at,
        updatedAt=lead.updated_at,
        followUpOn=lead.follow_up_on,
        lastContactedAt=lead.last_contacted_at,
        notes=[
            schemas.LeadNoteRead(
                id=n.id,
                author=n.author,
                body=n.body,
                createdAt=n.created_at,
            )
            for n in lead.notes
        ],
    )


# ---------------------------------------------------------------------------
# PATCH /api/leads/{id} — authenticated, partial update
# ---------------------------------------------------------------------------

@router.patch("/{lead_id}", response_model=schemas.LeadRead)
def update_lead(
    lead_id: str,
    payload: schemas.LeadUpdate,
    current_user: AuthUserDep,
    db: DbDep,
):
    lead = (
        db.query(models.Lead)
        .filter(models.Lead.id == lead_id, models.Lead.gym_id == current_user.gym_id)
        .first()
    )
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

    update_data = payload.model_dump(exclude_none=True)

    field_map = {
        "status": "status",
        "followUpOn": "follow_up_on",
        "lastContactedAt": "last_contacted_at",
        "trainingType": "training_type",
    }
    for schema_field, model_field in field_map.items():
        if schema_field in update_data:
            setattr(lead, model_field, update_data[schema_field])

    lead.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(lead)

    return get_lead(lead_id, current_user, db)
