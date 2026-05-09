"""
Sensor Routes — /sensor/simulate and /sensor/status
"""

import random
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

router = APIRouter()

SCENARIOS = {
    "normal": {
        "temperature": round(random.uniform(36.2, 37.2), 1),
        "moisture": round(random.uniform(45, 65), 1),
        "color_status": "green",
        "label": "Healthy Healing",
        "description": "All sensors within normal range. Healing progressing well.",
    },
    "warning": {
        "temperature": round(random.uniform(37.8, 38.8), 1),
        "moisture": round(random.uniform(25, 40), 1),
        "color_status": "yellow",
        "label": "Early Warning",
        "description": "Slight elevation in temperature. Monitor closely.",
    },
    "critical": {
        "temperature": round(random.uniform(39.0, 40.5), 1),
        "moisture": round(random.uniform(10, 22), 1),
        "color_status": "red",
        "label": "Critical Alert",
        "description": "High temperature and infection indicators detected. Urgent evaluation required.",
    },
    "dry": {
        "temperature": round(random.uniform(36.5, 37.4), 1),
        "moisture": round(random.uniform(5, 18), 1),
        "color_status": "yellow",
        "label": "Wound Too Dry",
        "description": "Moisture below optimal range. Re-dressing recommended.",
    },
}


@router.get("/simulate")
def simulate_sensors(scenario: str = Query("random")):
    """
    Return simulated sensor values for a given scenario.
    GET /sensor/simulate?scenario=normal|warning|critical|dry|random
    """
    if scenario == "random":
        key = random.choice(list(SCENARIOS.keys()))
        data = dict(SCENARIOS[key])
        # Re-randomize values slightly for variation
        data["temperature"] = round(random.uniform(35.5, 40.5), 1)
        data["moisture"] = round(random.uniform(10, 85), 1)
        data["color_status"] = random.choice(["green", "green", "yellow", "red"])
    else:
        if scenario not in SCENARIOS:
            return JSONResponse(
                status_code=400,
                content={"error": f"Unknown scenario: {scenario}. Use: normal, warning, critical, dry, random"}
            )
        data = dict(SCENARIOS[scenario])
        # Add slight variation per request
        data["temperature"] = round(data["temperature"] + random.uniform(-0.3, 0.3), 1)
        data["moisture"] = round(data["moisture"] + random.uniform(-3, 3), 1)

    return JSONResponse(content={
        "success": True,
        "scenario": scenario,
        "data": data,
    })


@router.get("/status")
def sensor_status():
    """Return live (simulated) sensor readings — intended for real-time polling."""
    temp = round(random.uniform(36.0, 39.5), 1)
    moisture = round(random.uniform(20, 80), 1)

    if temp > 38.5 or moisture < 20:
        color = "red"
    elif temp > 37.5 or moisture < 35:
        color = "yellow"
    else:
        color = "green"

    return JSONResponse(content={
        "success": True,
        "data": {
            "temperature": temp,
            "moisture": moisture,
            "color_status": color,
            "timestamp": __import__("time").time(),
        }
    })
