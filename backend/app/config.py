"""
Forge Fitness backend configuration.
Reads from environment variables / .env file.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/forge_fitness"

    # Security
    secret_key: str = "change-me-in-production-use-openssl-rand-hex-32"
    session_max_age: int = 60 * 60 * 8  # 8 hours in seconds

    # CORS
    frontend_origin: str = "http://localhost:3000"

    # Admin credentials (hashed password stored at startup)
    admin_email: str = "admin@forgefitness.demo"
    # Default: "changeme" — MUST be overridden in production via env var
    admin_password_hash: str = ""

    # App
    gym_id: str = "forge-fitness-mumbai"
    gym_name: str = "Forge Fitness Mumbai"


settings = Settings()
