"""
Aesthetic Skin — FastAPI Backend
AI-Powered Smart Regenerative Bandage System

Architecture: Model-swappable. Replace backend/model/best.pt and restart.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routes.predict import router as predict_router
from routes.sensor import router as sensor_router

app = FastAPI(
    title="Aesthetic Skin API",
    description="AI-powered burn wound analysis — image detection + sensor fusion",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS — allow React dev server and production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production via env var
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/predict", tags=["Prediction"])
app.include_router(sensor_router, prefix="/sensor", tags=["Sensor"])


@app.get("/health", tags=["System"])
def health_check():
    from pathlib import Path
    model_path = Path(__file__).parent / "model" / "best.pt"
    return {
        "status": "online",
        "system": "Aesthetic Skin AI",
        "version": "1.0.0",
        "model_loaded": model_path.exists(),
        "model_path": str(model_path),
    }


@app.get("/api/version", tags=["System"])
def get_version():
    return {
        "version": "1.0.0",
        "model": "YOLOv8 + Rule-Based Sensor Fusion",
        "classes": ["Mild (1st degree)", "Moderate (2nd degree)", "Severe (3rd degree)"],
        "team": "Qassim University · ITEX'26",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
