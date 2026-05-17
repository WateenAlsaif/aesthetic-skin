"""
YOLO Service — Burn Wound Image Classification
================================================
Supports the trained YOLOv8 classification model (yolov8n-cls / yolov8s-cls).
Fully backwards-compatible: also handles detection models if best.pt is detection.

Model is loaded once at first call (lazy load) and cached for the server lifetime.
To hot-swap: replace backend/model/best.pt and call reload_model() or restart.

Classes (match training dataset):
  0 → Mild     (1st degree — superficial)
  1 → Moderate (2nd degree — partial thickness)
  2 → Severe   (3rd degree — full thickness)
"""

from pathlib import Path
from PIL import Image

# ─── Lazy model cache ──────────────────────────────────────
_model       = None
_model_type  = None   # "classify" | "detect"

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


# ─── Model loading ─────────────────────────────────────────

def reload_model():
    """Force-reload the model from disk. Call after replacing best.pt."""
    global _model, _model_type
    _model      = None
    _model_type = None
    _load_model()


def _load_model():
    global _model, _model_type

    if _model is not None:
        return _model

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"YOLO model not found at {MODEL_PATH}. "
            "Run training/train_yolo.py first, or copy best.pt to backend/model/."
        )

    from ultralytics import YOLO
    model = YOLO(str(MODEL_PATH))

    # Auto-detect task type from model metadata
    task = getattr(model, "task", None)
    if task is None:
        # Fallback: check model name string
        name = str(MODEL_PATH).lower()
        task = "classify" if "cls" in name else "detect"

    _model      = model
    _model_type = "classify" if task == "classify" else "detect"
    return _model


# ─── Inference ─────────────────────────────────────────────

def predict_burn_image(image: Image.Image) -> dict:
    """
    Run inference on a PIL Image.

    Returns dict matching the shape the rest of the backend expects:
      burn_class       int     0 / 1 / 2
      burn_label       str     "Mild" / "Moderate" / "Severe"
      confidence       float   0.0 – 1.0
      description      str     clinical description
      detections       list    all bounding boxes (empty for classification)
      total_detections int
      all_probs        dict    {label: probability}  (classification only)
    """
    model = _load_model()

    results = model(image, verbose=False)

    burn_class  = 0
    burn_conf   = 0.0
    detections  = []
    all_probs   = {}

    if _model_type == "classify":
        # ── Classification model ──────────────────────────
        probs = results[0].probs
        if probs is not None:
            burn_class = int(probs.top1)
            burn_conf  = float(probs.top1conf)
            raw        = probs.data.tolist()
            all_probs  = {
                CLASS_NAMES.get(i, str(i)): round(float(p), 4)
                for i, p in enumerate(raw)
                if i in CLASS_NAMES
            }
        else:
            # Shouldn't happen, but handle gracefully
            burn_class = 0
            burn_conf  = 0.0
            all_probs  = {v: 0.0 for v in CLASS_NAMES.values()}

    else:
        # ── Detection model (legacy / fallback) ──────────
        import numpy as np

        boxes = results[0].boxes
        if boxes is not None and len(boxes) > 0:
            confs     = boxes.conf.cpu().numpy()
            best_idx  = int(np.argmax(confs))
            burn_class = int(boxes.cls[best_idx].cpu().numpy())
            burn_conf  = float(confs[best_idx])

            for box in boxes:
                cls  = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()
                detections.append({
                    "class_id":   cls,
                    "class_name": CLASS_NAMES.get(cls, "Unknown"),
                    "confidence": round(conf, 4),
                    "bbox":       [round(v, 1) for v in xyxy],
                })
        else:
            # No detections — return low-confidence mild
            burn_class = 0
            burn_conf  = 0.1

        all_probs = {v: 0.0 for v in CLASS_NAMES.values()}
        all_probs[CLASS_NAMES.get(burn_class, str(burn_class))] = round(burn_conf, 4)

    return {
        "burn_class":        burn_class,
        "burn_label":        CLASS_NAMES.get(burn_class, "Unknown"),
        "confidence":        round(burn_conf, 4),
        "description":       CLASS_DESCRIPTIONS.get(burn_class, ""),
        "detections":        detections,
        "total_detections":  len(detections),
        "all_probs":         all_probs,
        "model_type":        _model_type or "unknown",
    }
