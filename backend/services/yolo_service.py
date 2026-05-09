"""
YOLO Service — Burn Wound Image Detection
Uses trained YOLOv8 model to detect and classify burn severity.

Classes:
  0 → Mild burn (1st degree)
  1 → Moderate burn (2nd degree)
  2 → Severe burn (3rd degree)
"""

import os
from pathlib import Path
from typing import Optional
import numpy as np
from PIL import Image

# Lazy-load ultralytics to avoid slow startup
_model = None

MODEL_PATH = Path(__file__).parent.parent / "model" / "best.pt"

CLASS_NAMES = {
    0: "Mild",
    1: "Moderate",
    2: "Severe",
}

CLASS_DESCRIPTIONS = {
    0: "1st degree — superficial burn affecting outer skin layer",
    1: "2nd degree — partial thickness burn with blistering",
    2: "3rd degree — full thickness burn, requires immediate care",
}


def _load_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"YOLO model not found at {MODEL_PATH}. "
                "Run training/train_yolo.py first to train and save the model."
            )
        from ultralytics import YOLO
        _model = YOLO(str(MODEL_PATH))
    return _model


def predict_burn_image(image: Image.Image) -> dict:
    """
    Run YOLO inference on a PIL Image.

    Returns:
        dict with:
          - burn_class (int): 0, 1, or 2
          - burn_label (str): "Mild", "Moderate", or "Severe"
          - confidence (float): 0.0 – 1.0
          - description (str): clinical description
          - detections (list): all bounding boxes found
    """
    model = _load_model()

    # Run inference
    results = model(image, verbose=False)

    detections = []
    best_class = 0
    best_conf = 0.0

    for result in results:
        if result.boxes is not None:
            for box in result.boxes:
                cls = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()
                detections.append({
                    "class_id": cls,
                    "class_name": CLASS_NAMES.get(cls, "Unknown"),
                    "confidence": round(conf, 4),
                    "bbox": [round(v, 1) for v in xyxy],
                })
                # Track highest-confidence detection
                if conf > best_conf:
                    best_conf = conf
                    best_class = cls

    # If no detections, run classification-style (take highest class score)
    if not detections:
        probs = results[0].probs
        if probs is not None:
            best_class = int(probs.top1)
            best_conf = float(probs.top1conf.item())
        else:
            # Fallback: no detections found
            best_class = 0
            best_conf = 0.3

    return {
        "burn_class": best_class,
        "burn_label": CLASS_NAMES.get(best_class, "Unknown"),
        "confidence": round(best_conf, 4),
        "description": CLASS_DESCRIPTIONS.get(best_class, ""),
        "detections": detections,
        "total_detections": len(detections),
    }
