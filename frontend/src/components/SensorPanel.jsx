import { useState } from 'react'
import { Thermometer, Droplets, Eye, RefreshCw, Wifi } from 'lucide-react'
import axios from 'axios'

// ── Range Slider ──────────────────────────────────
function SensorSlider({ label, value, min, max, step, unit, color, dangerHigh, dangerLow, onChange, icon: Icon }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const isWarning = (dangerHigh && value > dangerHigh) || (dangerLow && value < dangerLow)

  return (
    <div className="card" style={{ padding: '18px 20px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={16} color={isWarning ? '#fbbf24' : color} />
          <span style={{ fontSize: '0.8rem', color: '#5d7fa3', fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span
            className="font-mono"
            style={{
              fontSize: '1.4rem',
              color: isWarning ? '#fbbf24' : color,
              fontWeight: 500,
              transition: 'color 0.3s',
            }}
          >{value}</span>
          <span style={{ fontSize: '0.72rem', color: '#5d7fa3' }}>{unit}</span>
        </div>
      </div>

      {/* Custom range slider */}
      <div style={{ position: 'relative', marginBottom: 6 }}>
        <div className="progress-track" style={{ marginBottom: 0, height: 6 }}>
          <div
            className="progress-fill"
            style={{
              width: `${pct}%`,
              background: isWarning
                ? 'linear-gradient(90deg, #fbbf24, #f87171)'
                : `linear-gradient(90deg, ${color}80, ${color})`,
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#2d4a68', fontFamily: 'monospace' }}>
        <span>{min}{unit}</span>
        {isWarning && <span style={{ color: '#fbbf24' }}>⚠ Abnormal</span>}
        <span>{max}{unit}</span>
      </div>

      {/* Fine-tune input */}
      <div style={{ marginTop: 10 }}>
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || min)}
          className="field-input"
          style={{ fontSize: '0.8rem' }}
        />
      </div>
    </div>
  )
}

export default function SensorPanel({ sensors, setSensors, loading }) {
  const [loadingScenario, setLoadingScenario] = useState(null)

  async function fetchSimulated(scenario) {
    setLoadingScenario(scenario)
    try {
      const res = await axios.get(`/sensor/simulate?scenario=${scenario}`)
      const d = res.data.data
      setSensors({
        temperature: d.temperature,
        moisture: d.moisture,
        color_status: d.color_status,
      })
    } catch (e) {
      console.error('Sensor fetch failed', e)
    } finally {
      setLoadingScenario(null)
    }
  }

  const colorMap = {
    green:  { bg: 'rgba(52,211,153,0.08)', color: '#34d399', label: 'No Infection Detected', dot: '#34d399', border: 'rgba(52,211,153,0.25)' },
    yellow: { bg: 'rgba(251,191,36,0.08)',  color: '#fbbf24', label: 'Early Warning Signal',  dot: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
    red:    { bg: 'rgba(248,113,113,0.1)',  color: '#f87171', label: 'Infection Alert!',       dot: '#f87171', border: 'rgba(248,113,113,0.35)' },
  }
  const cc = colorMap[sensors.color_status] || colorMap.green

  const scenarios = [
    { id: 'normal',   label: 'Normal',   color: '#34d399' },
    { id: 'warning',  label: 'Warning',  color: '#fbbf24' },
    { id: 'critical', label: 'Critical', color: '#f87171' },
    { id: 'random',   label: 'Random',   color: '#38bdf8' },
  ]

  return (
    <div>
      {/* Temp slider */}
      <SensorSlider
        label="Temperature"
        icon={Thermometer}
        value={sensors.temperature}
        min={34} max={42} step={0.1} unit="°C"
        color="#f87132"
        dangerHigh={38.5}
        onChange={(v) => setSensors(s => ({ ...s, temperature: v }))}
      />

      {/* Moisture slider */}
      <SensorSlider
        label="Moisture"
        icon={Droplets}
        value={sensors.moisture}
        min={0} max={100} step={1} unit="%"
        color="#38bdf8"
        dangerLow={20}
        onChange={(v) => setSensors(s => ({ ...s, moisture: v }))}
      />

      {/* Color sensor */}
      <div
        className="card"
        style={{
          padding: '18px 20px',
          marginBottom: 16,
          background: cc.bg,
          border: `1px solid ${cc.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Eye size={16} color={cc.color} />
            <span style={{ fontSize: '0.8rem', color: '#5d7fa3', fontWeight: 500 }}>Color Sensor</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="dot-pulse"
              style={{
                width: 10, height: 10, borderRadius: '50%',
                background: cc.dot,
                boxShadow: `0 0 8px ${cc.dot}`,
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '0.78rem', color: cc.color, fontWeight: 600 }}>{cc.label}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['green', 'yellow', 'red'].map(c => (
            <button
              key={c}
              onClick={() => setSensors(s => ({ ...s, color_status: c }))}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 10,
                border: `1px solid ${sensors.color_status === c ? colorMap[c].color : 'rgba(255,255,255,0.08)'}`,
                background: sensors.color_status === c ? colorMap[c].bg : 'transparent',
                color: sensors.color_status === c ? colorMap[c].color : '#5d7fa3',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: sensors.color_status === c ? 600 : 400,
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Simulate scenarios */}
      <div style={{ marginBottom: 8, fontSize: '0.68rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Simulate Scenario
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {scenarios.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => fetchSimulated(id)}
            disabled={!!loadingScenario || loading}
            style={{
              padding: '9px 8px',
              borderRadius: 10,
              border: `1px solid ${color}25`,
              background: `${color}08`,
              color: loadingScenario === id ? color : '#5d7fa3',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'all 0.2s',
              fontWeight: 500,
            }}
          >
            {loadingScenario === id
              ? <><RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</>
              : <><Wifi size={11} style={{ color }} /> {label}</>
            }
          </button>
        ))}
      </div>
    </div>
  )
}
