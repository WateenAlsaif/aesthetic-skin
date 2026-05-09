# AI Model Folder

Place your trained YOLOv8 model here:

```
backend/model/best.pt
```

## How to train

```bash
cd training
python train_yolo.py
```

After training, `best.pt` will be saved to `runs/detect/train/weights/best.pt`.
Copy it here:

```bash
cp ../training/runs/detect/train/weights/best.pt .
```

## To swap the model later

Simply:
1. Copy new `best.pt` here (overwrite old one)
2. Restart the backend: `uvicorn app:app --reload`
3. Done — frontend auto-uses new model

No code changes needed.
