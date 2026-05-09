"""
Predict Routes — /predict/image and /predict/full
"""

import io
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from PIL import Image

from services.yolo_service import predict_burn_image
from services.sensor_service import SensorInput, analyze_sensors
from services.hybrid_service import make_hybrid_decision

router = APIRouter()


@router.post("/image")
async def predict_from_image(file: UploadFile = File(...)):
    """
    Upload a burn image → returns YOLO detection results.
    Endpoint: POST /predict/image
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        result = predict_burn_image(image)
        return JSONResponse(content={"success": True, "data": result})
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.post("/full")
async def predict_full_hybrid(
    file: UploadFile = File(...),
    temperature: float = Form(...),
    moisture: float = Form(...),
    color_status: str = Form(...),
):
    """
    Upload image + sensor readings → full hybrid AI decision.
    Endpoint: POST /predict/full

    Form fields:
      - file: burn image
      - temperature: float (°C)
      - moisture: float (%)
      - color_status: "green" | "yellow" | "red"
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    if color_status.lower() not in ("green", "yellow", "red"):
        raise HTTPException(
            status_code=400,
            detail="color_status must be 'green', 'yellow', or 'red'"
        )

    try:
        # 1. Run YOLO on image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        yolo_result = predict_burn_image(image)

        # 2. Analyze sensor data
        sensor = SensorInput(
            temperature=temperature,
            moisture=moisture,
            color_status=color_status.lower(),
        )
        sensor_result = analyze_sensors(sensor)

        # 3. Combine into hybrid decision
        sensor_input_dict = {
            "temperature": temperature,
            "moisture": moisture,
            "color_status": color_status.lower(),
        }
        final = make_hybrid_decision(yolo_result, sensor_result, sensor_input_dict)

        return JSONResponse(content={
            "success": True,
            "data": final,
            "debug": {
                "yolo": yolo_result,
                "sensor": sensor_result,
            }
        })

    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
