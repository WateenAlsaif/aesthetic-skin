"""
Hybrid Decision Service — Combines YOLO image result + sensor data
Produces final clinical decision: burn severity, infection risk, alert, recommendation.
"""

from typing import Literal


ALERT_LEVELS = {
    "CRITICAL": "🚨 CRITICAL — Immediate medical intervention required",
    "HIGH": "⚠️ HIGH — Urgent clinical evaluation needed",
    "MEDIUM": "🟡 MEDIUM — Close monitoring required",
    "LOW": "✅ LOW — Routine care, continue monitoring",
}

RECOMMENDATIONS = {
    ("Severe", "HIGH"): [
        "Immediate hospital admission required",
        "Broad-spectrum antibiotic therapy",
        "Wound debridement evaluation",
        "Pain management protocol",
        "Contact burn specialist within 1 hour",
    ],
    ("Severe", "MEDIUM"): [
        "Clinical evaluation within 4 hours",
        "Topical antimicrobial dressing change",
        "Monitor temperature every 2 hours",
        "Ensure adequate hydration",
        "Document wound progression",
    ],
    ("Severe", "LOW"): [
        "Daily dressing changes",
        "Monitor for infection signs",
        "Nutritional support for healing",
        "Follow up with burn clinic in 48 hours",
    ],
    ("Moderate", "HIGH"): [
        "Urgent outpatient or ER evaluation",
        "Culture wound for pathogen identification",
        "Antimicrobial dressing application",
        "Systemic antibiotic consideration",
        "Increase monitoring frequency",
    ],
    ("Moderate", "MEDIUM"): [
        "Dressing change every 24–48 hours",
        "Topical antiseptic application",
        "Monitor moisture and temperature daily",
        "Outpatient follow-up in 3 days",
    ],
    ("Moderate", "LOW"): [
        "Continue current dressing protocol",
        "Keep wound moist and covered",
        "Follow up in 5–7 days",
        "Patient education on wound care",
    ],
    ("Mild", "HIGH"): [
        "Reassess burn classification — possible underestimation",
        "Apply antimicrobial ointment",
        "Monitor for spreading redness or swelling",
        "Medical evaluation recommended",
    ],
    ("Mild", "MEDIUM"): [
        "Clean and cover wound daily",
        "Apply soothing moisturizer",
        "Watch for signs of worsening",
        "Self-care with pharmacist guidance",
    ],
    ("Mild", "LOW"): [
        "Cool water rinse if recent burn",
        "Apply aloe vera or burn gel",
        "Cover with non-stick dressing",
        "Healing expected within 7–10 days",
    ],
}


def compute_alert_level(burn_label: str, infection_risk: str, sensor_score: int = 0) -> str:
    """
    Determine overall alert level from burn severity and infection risk.
    """
    if burn_label == "Severe" and infection_risk == "HIGH":
        return "CRITICAL"
    elif burn_label == "Severe" or infection_risk == "HIGH":
        return "HIGH"
    elif burn_label == "Moderate" or infection_risk == "MEDIUM":
        return "MEDIUM"
    else:
        return "LOW"


def get_recommendations(burn_label: str, infection_risk: str) -> list:
    """Get clinical recommendations based on burn + infection combination."""
    key = (burn_label, infection_risk)
    return RECOMMENDATIONS.get(key, [
        "Consult a healthcare professional",
        "Monitor wound closely",
        "Keep wound clean and covered",
    ])


def make_hybrid_decision(
    yolo_result: dict,
    sensor_result: dict,
    sensor_input: dict,
) -> dict:
    """
    Combine YOLO image prediction + sensor analysis into final decision.

    Args:
        yolo_result: Output from yolo_service.predict_burn_image()
        sensor_result: Output from sensor_service.analyze_sensors()
        sensor_input: Raw sensor readings dict

    Returns:
        Complete clinical decision dictionary
    """
    burn_label = yolo_result.get("burn_label", "Mild")
    burn_class = yolo_result.get("burn_class", 0)
    image_confidence = yolo_result.get("confidence", 0.0)

    infection_risk = sensor_result.get("infection_risk", "LOW")
    healing_status = sensor_result.get("healing_status", "Progressing")
    sensor_score = sensor_result.get("sensor_score", 0)

    # Escalate burn label if infection risk is high and image confidence is low
    if infection_risk == "HIGH" and image_confidence < 0.5:
        if burn_label == "Mild":
            burn_label = "Moderate"
        elif burn_label == "Moderate":
            burn_label = "Severe"

    alert_level = compute_alert_level(burn_label, infection_risk, sensor_score)
    recommendations = get_recommendations(burn_label, infection_risk)

    # Healing prediction
    if burn_label == "Severe":
        healing_days = "21–60+ days"
    elif burn_label == "Moderate":
        healing_days = "10–21 days"
    else:
        healing_days = "5–10 days"

    if infection_risk == "HIGH":
        healing_days = "Extended — infection delaying recovery"
    elif healing_status == "Delayed":
        healing_days = f"{healing_days} (delayed)"

    return {
        # Image results
        "burn_severity": burn_label,
        "burn_class": burn_class,
        "image_confidence": round(image_confidence, 4),
        "burn_description": yolo_result.get("description", ""),

        # Sensor results
        "temperature": sensor_input.get("temperature"),
        "moisture": sensor_input.get("moisture"),
        "color_status": sensor_input.get("color_status"),
        "infection_risk": infection_risk,
        "healing_status": healing_status,

        # Final decision
        "alert_level": alert_level,
        "alert_message": ALERT_LEVELS[alert_level],
        "recommendations": recommendations,
        "estimated_healing_time": healing_days,

        # Meta
        "analysis_model": sensor_result.get("model", "RuleBased"),
        "total_detections": yolo_result.get("total_detections", 0),
    }
