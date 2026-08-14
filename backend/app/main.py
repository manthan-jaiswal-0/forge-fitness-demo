"""
Forge Fitness — FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.config import settings
from app.init_db import init_db
from app.routers import leads, auth

app = FastAPI(
    title="Forge Fitness API",
    description="Gym Growth Platform backend — lead capture and management.",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the Vite dev server and the production frontend origin
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,  # required for session cookies
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ---------------------------------------------------------------------------
# Session middleware (HTTP-only cookie, signed with SECRET_KEY)
# ---------------------------------------------------------------------------
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.secret_key,
    max_age=settings.session_max_age,
    same_site="lax",      # "strict" blocks cross-site requests; "lax" is safe for same-domain
    https_only=False,     # set to True behind HTTPS in production
    session_cookie="forge_session",
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(leads.router)
app.include_router(auth.router)


# ---------------------------------------------------------------------------
# Startup: create tables and seed initial data
# ---------------------------------------------------------------------------
@app.on_event("startup")
def on_startup():
    init_db()


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok"}
