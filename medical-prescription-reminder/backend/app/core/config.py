# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    # Application Metadata
    PROJECT_NAME: str = "MedScript API"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"

    # Security (JWT)
    # Default provided for local dev; MUST be overridden in production .env
    SECRET_KEY: str = "your-super-secret-key-for-local-dev"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS Configurations (Allows frontend to communicate with backend)
    # E.g., ["http://localhost:5173", "https://your-vercel-app.vercel.app"]
    BACKEND_CORS_ORIGINS: List[str] = ["*"] 

    # Database
    DATABASE_URL: str = "sqlite:///./medscript.db"

    # External APIs
    GEMINI_API_KEY: str = ""

    # Pydantic v2 Config to read from .env file
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        case_sensitive=True,
        extra="ignore"
    )

# Instantiate the settings so it can be imported across the app
settings = Settings()