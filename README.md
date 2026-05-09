# Aesthetic Skin — AI Smart Regenerative Bandage
### ITEX'26 · Qassim University

> AI-powered burn wound analysis system combining computer vision (YOLOv8) and smart sensor fusion for real-time clinical assessment.

---

## 🚀 Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt

# Place your YOLO model here:
# backend/model/best.pt

uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## 🔄 Replacing the AI Model (Model Swap)

The system is designed for easy model replacement:

1. **Train or retrain your YOLOv8 model** (see `training/train_yolo.py`)
2. **Copy the new weights:**
   ```bash
   cp path/to/your/new/best.pt backend/model/best.pt
   ```
3. **Restart the backend:**
   ```bash
   uvicorn app:app --reload
   ```
4. **Done.** The frontend automatically uses the new model without any code changes.

No frontend changes. No API changes. No QR code changes.

---

## 📁 Project Structure

```
aesthetic-skin/
├── backend/
│   ├── app.py                   # FastAPI main app
│   ├── model/
│   │   └── best.pt              # ← PLACE YOUR YOLO MODEL HERE
│   ├── routes/
│   │   ├── predict.py           # POST /predict/image, /predict/full
│   │   └── sensor.py            # GET /sensor/simulate, /sensor/status
│   ├── services/
│   │   ├── yolo_service.py      # YOLOv8 inference
│   │   ├── sensor_service.py    # Sensor data analysis
│   │   └── hybrid_service.py    # Combined AI decision engine
│   ├── sensor_simulation/
│   │   └── simulate.py          # Sensor simulation logic
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Hero, features, how it works
│   │   │   └── Dashboard.jsx    # Main analysis dashboard
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── SensorPanel.jsx
│   │   │   └── ResultsPanel.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── tailwind.config.js
│
├── training/
│   ├── train_yolo.py
│   └── ...
│
└── dataset/
    └── ...
```

---

## 🌐 API Endpoints

| Method | Endpoint             | Description                          |
|--------|----------------------|--------------------------------------|
| GET    | /health              | System health check                  |
| GET    | /api/version         | Version + model info                 |
| POST   | /predict/image       | YOLO burn classification (image only)|
| POST   | /predict/full        | Hybrid: image + sensor fusion        |
| GET    | /sensor/simulate     | Simulated sensor values              |
| GET    | /sensor/status       | Live sensor polling                  |
| GET    | /api/docs            | Swagger UI docs                      |

---

## 🤖 AI Classes

| Class | Label    | Description                              |
|-------|----------|------------------------------------------|
| 0     | Mild     | 1st degree — superficial, outer layer    |
| 1     | Moderate | 2nd degree — partial thickness, blisters|
| 2     | Severe   | 3rd degree — full thickness, urgent care |

---

## 🏥 Features

- **Landing Page** — Medical hero, features, how-it-works
- **AI Dashboard** — Image upload, YOLO inference, confidence scoring
- **Sensor Panel** — Temperature, moisture, color sensor simulation
- **Hybrid Decision** — Combines image + sensor for infection risk + recommendations
- **Alert System** — LOW / MEDIUM / HIGH / CRITICAL levels
- **Model-swappable** — Replace best.pt → restart → done

---

## 🔮 Future: Real ESP32 Sensor Integration

Replace simulated values with real sensor data:

```python
# In backend/routes/sensor.py, replace GET /sensor/status with:
# Read from ESP32 via serial or HTTP
import serial
ser = serial.Serial('/dev/ttyUSB0', 9600)
data = ser.readline().decode().strip()
# Parse and return real values
```

---

## 👥 Team

| Name | Role |
|------|------|
| Layan Abdulaziz Altuwejri | Team Leader, Medicine Researcher |
| Weam Abdulaziz Altuwejri | Business Administration, Marketing |
| Dalaa Abdulaziz Altuwejri | Electrical Engineering & AI |
| Wateen Alssiff | Computer Science |

**Contact:** laian123890@gmail.com  
**Institution:** Qassim University, Saudi Arabia  
**Event:** ITEX 2026

---

*Heal Smarter. Recover Faster. Live Better.*
