import logging

from fastapi import APIRouter, Query, Request
from fastapi.responses import PlainTextResponse

from app.config import settings


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])


@router.get("/webhook", response_class=PlainTextResponse)
async def verify_webhook(
    hub_mode: str | None = Query(default=None, alias="hub.mode"),
    hub_verify_token: str | None = Query(default=None, alias="hub.verify_token"),
    hub_challenge: str | None = Query(default=None, alias="hub.challenge"),
):
    if (
        hub_mode == "subscribe"
        and hub_verify_token == settings.whatsapp_webhook_verify_token
        and hub_challenge is not None
    ):
        return PlainTextResponse(hub_challenge)

    return PlainTextResponse("Verification failed", status_code=403)


@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    payload = await request.json()

    logger.info("WhatsApp webhook received: %s", payload)

    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})

            for status in value.get("statuses", []):
                logger.info(
                    "WhatsApp message status: id=%s status=%s recipient=%s errors=%s",
                    status.get("id"),
                    status.get("status"),
                    status.get("recipient_id"),
                    status.get("errors"),
                )

    return {"status": "ok"}