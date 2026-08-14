"""
Lead ID generation — mirrors newLeadId() in src/lib/leads.ts.
"""

import re
from sqlalchemy.orm import Session
from app import models


def generate_lead_id(db: Session, gym_id: str) -> str:
    """
    Generate the next LD-XXXX id for a given gym.
    Scoped to the gym so IDs remain sequential per gym.
    """
    last = (
        db.query(models.Lead.id)
        .filter(models.Lead.gym_id == gym_id)
        .order_by(models.Lead.id.desc())
        .first()
    )
    if last is None:
        return "LD-1001"
    match = re.search(r"\d+", last[0])
    n = int(match.group()) if match else 1000
    return f"LD-{n + 1}"
