"""
Sensor Simulation — Generates realistic sensor readings for testing.
Replace this module's get_simulated_readings() with real ESP32 data later.
"""

import random
import time
from dataclasses import dataclass, asdict


@dataclass
class SensorReading:
    temperature: float      # °C
    moisture: float         # %
    color_status: str       # "green" | "yellow" | "red"
    timestamp: str


def get_simulated_readings(
    scenario: str = "random"
) -> dict:
    """
    Generate realistic simulated sensor data.

    Scenarios:
      "random"   — random state
      "normal"   — healthy healing
      "warning"  — early infection signs
      "critical" — active infection / severe burn
    """
    if scenario == "normal":
        temp = round(random.uniform(36.0, 37.2), 1)
        moisture = round(random.uniform(50.0, 75.0), 1)
        color = "green"

    elif scenario == "warning":
        temp = round(random.uniform(37.3, 38.5), 1)
        moisture = round(random.uniform(25.0, 45.0), 1)
        color = random.choice(["yellow", "yellow", "red"])

    elif scenario == "critical":
        temp = round(random.uniform(38.6, 40.5), 1)
        moisture = round(random.uniform(10.0, 30.0), 1)
        color = "red"

    else:  # random
        temp = round(random.uniform(35.5, 40.5), 1)
        moisture = round(random.uniform(10.0, 90.0), 1)
        color = random.choice(["green", "green", "yellow", "yellow", "red"])

    return {
        "temperature": temp,
        "moisture": moisture,
        "color_status": color,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "simulation",
        # ESP32 integration note:
        # Replace above with real serial/HTTP read from ESP32
        # e.g. requests.get("http://esp32-local-ip/sensors").json()
    }


# --- Future ESP32 Integration ---
def get_esp32_readings(esp32_ip: str = "192.168.1.100") -> dict:
    """
    Read sensor data from a real ESP32 device over HTTP.
    Uncomment and use this once hardware is connected.
    """
    # import requests
    # response = requests.get(f"http://{esp32_ip}/sensors", timeout=3)
    # data = response.json()
    # return {
    #     "temperature": data["temp_celsius"],
    #     "moisture":    data["moisture_pct"],
    #     "color_status": data["color"],   # "green" | "yellow" | "red"
    #     "timestamp":   data["ts"],
    #     "source":      "esp32",
    # }
    raise NotImplementedError("Connect your ESP32 and configure the IP address.")
