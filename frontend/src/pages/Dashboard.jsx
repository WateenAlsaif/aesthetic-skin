import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Cpu, FlaskConical, Loader2, Zap, Activity, RefreshCw, Info } from 'lucide-react'
import ImageUploader from '../components/ImageUploader'
import SensorPanel from '../components/SensorPanel'
import ResultsPanel from '../components/ResultsPanel'

const DEFAULT_SENSORS = {
  temperature: 36.8,
  moisture: 55.0,
  color_status: 'green',
}

// ── Live Sensor Monitor Widget ────────────────────
function LiveMonitor({ sensors }) {
  const tempColor = sensors.temperature > 38.5 ? '#f87171' : sensors.temperature > 37.5 ? '#fbbf24' : '#34d399'
  const moistColor = sensors.moisture < 20 ? '#f87171' : sensors.moisture > 80 ? '#fbbf24' : '#38bdf8'
  const colorDot = { green: '#34d399', yellow: '#fbbf24', red: '#f87171' }[sensors.color_status] || '#34d399'

  return (
    <div style={{
      display: 'flex', gap: 14, flexWrap: 'wrap',
      padding: '14px 18px',
      background: 'rgba(10,22,40,0.5)',
      borderRadius: 14,
      border: '1px solid rgba(56,189,248,0.08)',
      marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} className="dot-pulse" />
        <span style={{ fontSize: '0.68rem', color: '#5d7fa3' }}>Live Sensors</span>
      </div>
      <div style={{ display: 'flex', gap: 24, marginLeft: 'auto', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: tempColor }}>
          🌡 {sensors.temperature}°C
        </span>
        <span style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: moistColor }}>
          💧 {sensors.moisture}%
        </span>
        <span style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: colorDot }}>
          ● {sensors.color_status.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [sensors, setSensors] = useState(DEFAULT_SENSORS)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('full') // 'full' | 'image'
  const [analysisTime, setAnalysisTime] = useState(null)
  const timerRef = useRef(null)

  function handleImageSelect(file) {
    if (!file) { setImage(null); setPreview(null); return }
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  async function runAnalysis() {
    if (!image) { setError('Please upload a burn wound image first.'); return }
    setError(null)
    setLoading(true)
    setResult(null)
    const t0 = Date.now()

    try {
      const formData = new FormData()
      formData.append('file', image)

      let res
      if (mode === 'full') {
        formData.append('temperature', sensors.temperature)
        formData.append('moisture', sensors.moisture)
        formData.append('color_status', sensors.color_status)
        res = await axios.post('https://aesthetic-skin-api.onrender.com/predict/full', formData)
      } else {
        res = await axios.post('https://aesthetic-skin-api.onrender.com/predict/image', formData)
      }

      setResult(res.data.data)
      setAnalysisTime(((Date.now() - t0) / 1000).toFixed(2))
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Analysis failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1 className="font-display" style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
          color: '#e8f0fe',
          letterSpacing: '-0.03em',
          marginBottom: 8,
          lineHeight: 1.1,
          fontWeight: 800,
        }}>
          AI Wound Analysis{' '}
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Dashboard</span>
        </h1>
        <p style={{ color: '#5d7fa3', fontSize: '0.85rem', maxWidth: 560, margin: '0 auto' }}>
          Upload a burn wound image, configure sensor readings, and receive a complete AI-powered clinical assessment.
        </p>
      </div>

      {/* Live sensor monitor strip */}
      <LiveMonitor sensors={sensors} />

      {/* Mode toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(56,189,248,0.1)',
          borderRadius: 12,
          padding: 4,
          display: 'flex', gap: 4,
        }}>
          {[
            { id: 'full',  label: 'Hybrid AI (Image + Sensors)', icon: Zap },
            { id: 'image', label: 'Image Only',                  icon: FlaskConical },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              style={{
                padding: '7px 18px',
                borderRadius: 9,
                border: 'none',
                background: mode === id ? 'rgba(56,189,248,0.12)' : 'transparent',
                color: mode === id ? '#38bdf8' : '#5d7fa3',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: mode === id ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: mode === 'full'
          ? 'minmax(260px, 1fr) minmax(260px, 1fr) minmax(320px, 1.5fr)'
          : 'minmax(280px, 1fr) minmax(320px, 1.6fr)',
        gap: 20,
        alignItems: 'start',
      }}>

        {/* Column 1 — Upload */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#38bdf8' }} />
            <span style={{ fontSize: '0.65rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Wound Image
            </span>
          </div>

          <div className="card" style={{ padding: 14, marginBottom: 12 }}>
            <ImageUploader
              onImageSelect={handleImageSelect}
              selectedImage={image}
              preview={preview}
            />
          </div>

          {/* Mode info */}
          {mode === 'image' && (
            <div style={{
              marginBottom: 10,
              padding: '10px 13px',
              borderRadius: 10,
              background: 'rgba(56,189,248,0.06)',
              border: '1px solid rgba(56,189,248,0.15)',
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <Info size={13} color="#38bdf8" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', color: '#5d7fa3', lineHeight: 1.5 }}>
                Image-only mode: YOLO detection without sensor data. Switch to Hybrid AI for full analysis.
              </span>
            </div>
          )}

          {/* Run button */}
          <button
            className="btn-primary"
            onClick={runAnalysis}
            disabled={loading || !image}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '0.9rem',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading || !image ? 'none' : '0 6px 24px rgba(248,113,50,0.4)',
            }}
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
              : <><Cpu size={16} /> Run AI Analysis</>
            }
          </button>

          {/* Analysis time */}
          {analysisTime && !loading && (
            <div style={{
              marginTop: 8,
              textAlign: 'center',
              fontSize: '0.68rem',
              color: '#34d399',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              ✓ Completed in {analysisTime}s
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 10,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.25)',
              color: '#f87171',
              fontSize: '0.78rem',
              lineHeight: 1.5,
            }}>
              {error.includes('best.pt') || error.includes('model not found')
                ? '⚠ AI model (best.pt) not found. Place your trained model at backend/model/best.pt'
                : error
              }
            </div>
          )}
        </div>

        {/* Column 2 — Sensors (hybrid mode only) */}
        {mode === 'full' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f87132' }} />
              <span style={{ fontSize: '0.65rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Sensor Readings
              </span>
            </div>
            <SensorPanel sensors={sensors} setSensors={setSensors} loading={loading} />
          </div>
        )}

        {/* Column 3 — Results */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa' }} />
            <span style={{ fontSize: '0.65rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              AI Decision Output
            </span>
            {result && (
              <span className="badge badge-violet" style={{ marginLeft: 'auto' }}>New Result</span>
            )}
          </div>
          <div className="card" style={{ padding: '18px 20px' }}>
            <ResultsPanel result={result} />
          </div>
        </div>
      </div>

      {/* ── System Info Strip ─────────────────── */}
      <div style={{
        marginTop: 36,
        padding: '14px 24px',
        borderRadius: 14,
        background: 'rgba(56,189,248,0.03)',
        border: '1px solid rgba(56,189,248,0.08)',
        display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {[
          { label: 'Vision Model', value: 'YOLOv8n' },
          { label: 'Sensor Model', value: 'Rule-Based + RF' },
          { label: 'Classes', value: 'Mild / Moderate / Severe' },
          { label: 'Dataset', value: 'Roboflow Burn Wound v1' },
          { label: 'Sensors', value: 'Temp · Moisture · Color' },
          { label: 'Team', value: "Qassim University · ITEX'26" },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#2d4a68', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{label}</div>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: '#5d7fa3' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Model replacement notice */}
      <div style={{
        marginTop: 12,
        padding: '10px 18px',
        borderRadius: 10,
        background: 'rgba(167,139,250,0.05)',
        border: '1px solid rgba(167,139,250,0.15)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Activity size={13} color="#a78bfa" />
        <span style={{ fontSize: '0.7rem', color: '#5d7fa3' }}>
          <strong style={{ color: '#a78bfa' }}>Model-swappable architecture:</strong>{' '}
          Replace <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#38bdf8' }}>backend/model/best.pt</code>{' '}
          with your retrained weights and restart the backend — the frontend automatically uses the new model.
        </span>
      </div>
    </div>
  )
}
