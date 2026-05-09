#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Aesthetic Skin — Development Startup Script
# ─────────────────────────────────────────────────────────────
set -e

echo ""
echo "  ╔═══════════════════════════════════════╗"
echo "  ║     Aesthetic Skin AI Dashboard       ║"
echo "  ║     ITEX'26 · Qassim University       ║"
echo "  ╚═══════════════════════════════════════╝"
echo ""

# Check model
MODEL_PATH="backend/model/best.pt"
if [ ! -f "$MODEL_PATH" ]; then
  echo "  ⚠  WARNING: YOLO model not found at $MODEL_PATH"
  echo "  ⚠  Run training/train_yolo.py or copy your best.pt to backend/model/"
  echo ""
fi

# Start backend
echo "  ▶  Starting FastAPI backend on http://localhost:8000 ..."
cd backend
pip install -r requirements.txt -q
uvicorn app:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 2

# Start frontend
echo "  ▶  Starting React frontend on http://localhost:5173 ..."
cd frontend
npm install -q
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "  ✅ System running:"
echo "     Frontend:  http://localhost:5173"
echo "     Backend:   http://localhost:8000"
echo "     API Docs:  http://localhost:8000/api/docs"
echo ""
echo "  ℹ  To swap AI model: replace backend/model/best.pt and restart"
echo ""
echo "  Press Ctrl+C to stop all services."
echo ""

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '  Stopped.'" EXIT
wait
