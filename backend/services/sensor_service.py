"""
Sensor Service — Temperature, Moisture & Color Sensor Analysis
Analyzes individual sensor readings and produces risk indicators.
"""

from dataclasses import dataclass
from typing import Literal
import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent / "model" / "sensor_model.joblib"

ColorStatus = Literal["green", "yellow", "red"]


@dataclass
class SensorInput:
    temperature: float      # Celsius (e.g. 36.5)
    moisture: float         # Percentage 0-100 (e.g. 45.0)
    color_status: str       # "green" | "yellow" | "red"


def color_to_int(color: str) -> int:
    """Encode color sensor reading to int for model input."""
    return {"green": 0, "yellow": 1, "red": 2}.get(color.lower(), 1)


def analyze_sensors_rule_based(sensor: SensorInput) -> dict:
    """
    Rule-based sensor analysis as fallback when ML model is not trained yet.
    Returns infection_risk, healing_status, sensor_alert.
    """
    temp = sensor.temperature
    moisture = sensor.moisture
    color = sensor.color_status.lower()

    # Temperature analysis
    if temp > 38.5:
        temp_risk = "high"
        temp_note = "Elevated temperature may indicate infection"
    elif temp > 37.5:
        temp_risk = "medium"
        temp_note = "Slightly elevated — monitor closely"
    else:
        temp_risk = "low"
        temp_note = "Temperature within normal range"

    # Moisture analysis
    if moisture < 20:
        moisture_risk = "high"
        moisture_note = "Critically dry — risk of delayed healing"
    elif moisture < 40:
        moisture_risk = "medium"
        moisture_note = "Low moisture — apply hydrogel dressing"
    elif moisture > 80:
        moisture_risk = "medium"
        moisture_note = "Excess moisture — risk of maceration"
    else:
        moisture_risk = "low"
        moisture_note = "Moisture level optimal for healing"

    # Color sensor analysis
    if color == "red":
        color_risk = "high"
        color_note = "Red indicator — infection detected by sensor"
    elif color == "yellow":
        color_risk = "medium"
        color_note = "Yellow indicator — early warning, monitor"
    else:
        color_risk = "low"
        color_note = "Green indicator — no infection detected"

    # Combined risk score
    risk_scores = {"low": 0, "medium": 1, "high": 2}
    total = risk_scores[temp_risk] + risk_scores[moisture_risk] + risk_scores[color_risk]

    if total >= 4:
        infection_risk = "HIGH"
        healing_status = "Compromised"
    elif total >= 2:
        infection_risk = "MEDIUM"
        healing_status = "Delayed"
    else:
        infection_risk = "LOW"
        healing_status = "Progressing"

    return {
        "infection_risk": infection_risk,
        "healing_status": healing_status,
        "temperature_analysis": {"risk": temp_risk, "note": temp_note},
        "moisture_analysis": {"risk": moisture_risk, "note": moisture_note},
        "color_analysis": {"risk": color_risk, "note": color_note},
        "sensor_score": total,
    }


def analyze_sensors_ml(sensor: SensorInput) -> dict:
    """Use trained ML model for sensor inference."""
    try:
        model = joblib.load(MODEL_PATH)
        features = np.array([[
            sensor.temperature,
            sensor.moisture,
            color_to_int(sensor.color_status),
        ]])
        prediction = model.predict(features)[0]
        proba = model.predict_proba(features)[0]
        confidence = float(max(proba))

        # prediction: 0=LOW, 1=MEDIUM, 2=HIGH
        risk_labels = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}
        healing_labels = {0: "Progressing", 1: "Delayed", 2: "Compromised"}

        return {
            "infection_risk": risk_labels[prediction],
            "healing_status": healing_labels[prediction],
            "ml_confidence": round(confidence, 4),
            "model": "RandomForest",
        }
    except FileNotFoundError:
        # ML model not trained yet — fall back to rule-based
        result = analyze_sensors_rule_based(sensor)
        result["model"] = "RuleBased"
        return result


def analyze_sensors(sensor: SensorInput) -> dict:
    """Main entry — tries ML first, falls back to rules."""
    try:
        result = analyze_sensors_ml(sensor)
    except Exception:
        result = analyze_sensors_rule_based(sensor)
        result["model"] = "RuleBased"
    return result
