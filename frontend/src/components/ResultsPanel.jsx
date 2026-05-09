import {
  ShieldAlert, Activity, Clock, CheckCircle, AlertTriangle,
  XCircle, ChevronRight, Cpu, Thermometer, Droplets, Eye,
  BarChart3, TrendingUp
} from 'lucide-react'

const ALERT_CONFIG = {
  CRITICAL: { color: '#f87132', bg: 'rgba(248,113,50,0.1)',  border: 'rgba(248,113,50,0.4)', icon: XCircle,       cls: 'glow-orange' },
  HIGH:     { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.35)', icon: AlertTriangle, cls: 'glow-red' },
  MEDIUM:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)', icon: AlertTriangle, cls: '' },
  LOW:      { color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.3)', icon: CheckCircle,   cls: '' },
}

const BURN_COLORS = {
  Mild:     '#34d399',
  Moderate: '#fbbf24',
  Severe:   '#f87171',
}

const RISK_COLORS = {
  LOW:    '#34d399',
  MEDIUM: '#fbbf24',
  HIGH:   '#f87171',
}

function MetricCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="card" style={{ padding: '16px 18px', flex: 1, minWidth: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {Icon && <Icon size={13} color={color || '#5d7fa3'} />}
        <span style={{ fontSize: '0.65rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 500, color: color || '#e8f0fe', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.68rem', color: '#2d4a68', marginTop: 5, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  )
}

function SensorReadout({ icon: Icon, label, value, unit, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: '0.75rem', color: '#5d7fa3' }}>{label}</span>
      </div>
      <span className="font-mono" style={{ fontSize: '0.9rem', color, fontWeight: 500 }}>
        {value}{unit}
      </span>
    </div>
  )
}

export default function ResultsPanel({ result }) {
  if (!result) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 360, gap: 14,
        padding: '40px 24px',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(56,189,248,0.06)',
          border: '1px solid rgba(56,189,248,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <Activity size={30} color="#2d4a68" />
          <div style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            border: '1px dashed rgba(56,189,248,0.15)',
          }} />
        </div>
        <div style={{ color: '#2d4a68', fontSize: '0.88rem', textAlign: 'center', lineHeight: 1.6 }}>
          Upload a wound image and click<br />
          <strong style={{ color: '#5d7fa3' }}>Run AI Analysis</strong> to see the full clinical report
        </div>
        {/* Preview skeleton */}
        <div style={{ width: '100%', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[80, 60, 70, 50].map((w, i) => (
            <div key={i} style={{
              height: 8, borderRadius: 4,
              background: 'rgba(255,255,255,0.04)',
              width: `${w}%`,
            }} />
          ))}
        </div>
      </div>
    )
  }

  const alert = ALERT_CONFIG[result.alert_level] || ALERT_CONFIG.LOW
  const AlertIcon = alert.icon
  const burnColor = BURN_COLORS[result.burn_severity] || '#e8f0fe'
  const riskColor = RISK_COLORS[result.infection_risk] || '#e8f0fe'
  const confPct = Math.round((result.image_confidence || 0) * 100)

  // Color sensor mapping
  const colorStatus = result.color_status || 'green'
  const colorMap = { green: '#34d399', yellow: '#fbbf24', red: '#f87171' }
  const colorSensorColor = colorMap[colorStatus] || '#34d399'

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Alert Banner ─────────────────────── */}
      <div
        className={alert.cls}
        style={{
          background: alert.bg,
          border: `1px solid ${alert.border}`,
          borderRadius: 14,
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}
      >
        <AlertIcon size={24} color={alert.color} strokeWidth={2} />
        <div>
          <div style={{
            fontSize: '0.65rem', color: alert.color,
            textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 3
          }}>
            Alert Level — {result.alert_level}
          </div>
          <div style={{ fontSize: '0.88rem', color: '#e8f0fe', lineHeight: 1.4 }}>
            {result.alert_message}
          </div>
        </div>
      </div>

      {/* ── Key Metrics Row ───────────────────── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <MetricCard
          label="Burn Severity"
          value={result.burn_severity}
          sub={result.burn_description}
          color={burnColor}
          icon={ShieldAlert}
        />
        <MetricCard
          label="Infection Risk"
          value={result.infection_risk}
          sub={`Sensor analysis`}
          color={riskColor}
          icon={AlertTriangle}
        />
        <MetricCard
          label="AI Confidence"
          value={`${confPct}%`}
          sub="Image model score"
          color="#38bdf8"
          icon={Cpu}
        />
      </div>

      {/* ── Confidence Bar ────────────────────── */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={13} color="#38bdf8" />
            <span style={{ fontSize: '0.7rem', color: '#5d7fa3' }}>Image Detection Confidence</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{confPct}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${confPct}%`,
              background: confPct >= 70
                ? 'linear-gradient(90deg, #38bdf8, #34d399)'
                : confPct >= 40
                  ? 'linear-gradient(90deg, #fbbf24, #f87132)'
                  : 'linear-gradient(90deg, #f87171, #f87132)',
            }}
          />
        </div>
        {confPct < 50 && (
          <div style={{ fontSize: '0.68rem', color: '#fbbf24', marginTop: 6 }}>
            ⚠ Low confidence — consider uploading a clearer image
          </div>
        )}
      </div>

      {/* ── Healing Timeline ──────────────────── */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div className="card" style={{ flex: 1, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={16} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Healing Status</div>
            <div style={{ fontWeight: 600, color: '#e8f0fe', fontSize: '0.88rem' }}>{result.healing_status}</div>
          </div>
        </div>
        <div className="card" style={{ flex: 1, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={16} color="#a78bfa" />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Est. Healing Time</div>
            <div style={{ fontWeight: 600, color: '#e8f0fe', fontSize: '0.82rem' }}>{result.estimated_healing_time}</div>
          </div>
        </div>
      </div>

      {/* ── Sensor Readouts ───────────────────── */}
      {(result.temperature !== undefined || result.moisture !== undefined) && (
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <TrendingUp size={13} color="#5d7fa3" />
            <span style={{ fontSize: '0.68rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Sensor Readings Used
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.temperature !== undefined && (
              <SensorReadout icon={Thermometer} label="Temperature" value={result.temperature} unit="°C"
                color={result.temperature > 38.5 ? '#f87171' : result.temperature > 37.5 ? '#fbbf24' : '#34d399'} />
            )}
            {result.moisture !== undefined && (
              <SensorReadout icon={Droplets} label="Moisture" value={result.moisture} unit="%"
                color={result.moisture < 20 ? '#f87171' : result.moisture > 80 ? '#fbbf24' : '#38bdf8'} />
            )}
            {result.color_status && (
              <SensorReadout icon={Eye} label="Color Sensor" value={result.color_status.toUpperCase()} unit=""
                color={colorSensorColor} />
            )}
          </div>
        </div>
      )}

      {/* ── Clinical Recommendations ──────────── */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ShieldAlert size={15} color="#f87132" />
          <span style={{ fontSize: '0.75rem', color: '#e8f0fe', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Clinical Recommendations
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {(result.recommendations || []).map((rec, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '9px 0',
              borderBottom: i < result.recommendations.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <ChevronRight size={13} color="#f87132" style={{ marginTop: 3, flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: '#b0c4de', lineHeight: 1.55 }}>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────── */}
      <div style={{
        fontSize: '0.62rem',
        color: '#2d4a68',
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        paddingTop: 4,
      }}>
        Model: {result.analysis_model || 'YOLOv8+RF'} · Detections: {result.total_detections} · Aesthetic Skin AI v1.0
      </div>
    </div>
  )
}
