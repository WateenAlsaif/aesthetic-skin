import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Thermometer, Droplets, Eye, ShieldAlert,
  ChevronRight, AlertTriangle, Cpu, ArrowLeft, Clock,
  Wifi, Zap, TrendingUp, BarChart3, CheckCircle, XCircle
} from 'lucide-react'

// ── LOCAL WOUND IMAGE (stored in /public) ────────────────
const WOUND_IMAGE = '/wound-demo.png'

// ── SIMULATED SENSOR VALUES ──────────────────────────────
// Future ESP32 integration point — replace these with live stream
const SENSORS = {
  temperature: 38.4,
  moisture: 41,
  color_status: 'red',   // green | yellow | red
  heart_rate: 94,        // BPM
  last_updated: 'Just now',
}

// ── SIMULATED AI ANALYSIS ────────────────────────────────
// Future YOLO model integration point — replace with real inference
const AI_RESULT = {
  burn_severity:    'Moderate',
  burn_class:       '2nd Degree — Partial Thickness',
  surface_area:     '14 cm²',
  depth:            '1.6 mm',
  infection_risk:   'HIGH',
  healing_progress: 32,
  inflammation:     81,
  tissue_damage:    58,
  oxygen_level:     39,
  alert_level:      'HIGH',
  alert_message:    'Urgent evaluation needed — infection markers elevated',
  estimated_healing:'14–21 days',
  healing_status:   'At Risk — Slowing',
  confidence:       87,
}

// ── AI DECISIONS ─────────────────────────────────────────
const DECISIONS = [
  { icon: ShieldAlert, color: '#dc2626', title: 'High-Dose Antibiotic Required', detail: 'Meropenem 15mg/24h — Transdermal delivery via Smart Bandage layer' },
  { icon: Activity,    color: '#10b981', title: 'Growth Factors Activated',       detail: 'PDGF released at 0.5μg/hr — accelerating tissue regeneration' },
  { icon: Droplets,    color: '#2c7be5', title: 'Moisture Regulation Active',     detail: 'Hydrogel layer maintaining wound moisture — currently below optimal' },
  { icon: AlertTriangle, color:'#f59e0b',title: 'Surgical Consultation Advised',  detail: 'Infection level critical — contact burn specialist within 4 hours' },
]

// ── RECOMMENDATIONS ──────────────────────────────────────
const RECS = [
  'Immediate dressing change and wound irrigation required',
  'Administer systemic antibiotics — culture wound for pathogen ID',
  'Increase sensor monitoring frequency to every 2 hours',
  'Maintain wound moisture — apply hydrogel dressing layer',
  'Document wound progression with photos every 6 hours',
  'Follow up with burn specialist — urgent outpatient evaluation',
]

// ── ANIMATED NUMBER ──────────────────────────────────────
function AnimNum({ target, suffix = '', decimals = 0, color }) {
  const [v, setV] = useState(0)
  const done = useRef(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const t0 = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - t0) / 1200, 1)
          const val = target * (1 - Math.pow(1 - p, 3))
          setV(decimals ? val.toFixed(decimals) : Math.round(val))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref} style={{ color }}>{v}{suffix}</span>
}

// ── ANIMATED PROGRESS BAR ────────────────────────────────
function Bar({ label, pct, color, animated = true }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 400); return () => clearTimeout(t) }, [pct])
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: '.82rem', color: '#0f2744', fontWeight: 500 }}>{label}</span>
        <span className="font-mono" style={{ fontSize: '.8rem', color, fontWeight: 700 }}>
          {animated ? <AnimNum target={pct} suffix="%" color={color} /> : `${pct}%`}
        </span>
      </div>
      <div className="track" style={{ height: 10, borderRadius: 8 }}>
        <div style={{ height: '100%', borderRadius: 8, width: `${w}%`, background: `linear-gradient(90deg,${color}70,${color})`, transition: 'width 1s cubic-bezier(.34,1.56,.64,1)', boxShadow: `0 0 8px ${color}50` }} />
      </div>
    </div>
  )
}

// ── STATUS DOT ───────────────────────────────────────────
function Dot({ color, pulse = true }) {
  return (
    <span className={pulse ? 'dot' : ''} style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, display: 'inline-block', flexShrink: 0 }} />
  )
}

// ── SENSOR CARD ──────────────────────────────────────────
function SensorCard({ icon: Icon, label, value, unit, color, sub, glow }) {
  return (
    <div className={glow ? (color === '#dc2626' ? 'gr' : 'ga') : ''} style={{ background: 'white', border: `1px solid ${color}30`, borderRadius: 14, padding: '16px 18px', boxShadow: `0 2px 10px ${color}15` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}14`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={15} color={color} />
          </div>
          <span style={{ fontSize: '.72rem', color: '#4a7095', textTransform: 'uppercase', letterSpacing: '.07em' }}>{label}</span>
        </div>
        <Dot color={color} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span className="font-mono" style={{ fontSize: '1.7rem', fontWeight: 600, color, lineHeight: 1 }}>
          <AnimNum target={typeof value === 'number' ? value : 0} suffix="" decimals={value % 1 !== 0 ? 1 : 0} color={color} />
        </span>
        <span style={{ fontSize: '.75rem', color: '#4a7095' }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: '.68rem', color: '#4a7095', marginTop: 5 }}>{sub}</div>}
    </div>
  )
}

// ── MAIN PAGE ────────────────────────────────────────────
export default function StaticAnalysis() {
  const nav = useNavigate()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [tick, setTick] = useState(0)

  // Simulate live sensor ticking
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000)
    return () => clearInterval(id)
  }, [])

  const tempColor  = SENSORS.temperature > 38 ? '#dc2626' : '#f59e0b'
  const moistColor = SENSORS.moisture < 45 ? '#f59e0b' : '#2c7be5'
  const colorDot   = { green: '#10b981', yellow: '#f59e0b', red: '#dc2626' }[SENSORS.color_status]

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 16px' }}>

      {/* ── TOP BAR ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <button onClick={() => nav('/')} className="btn-out" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', fontSize: '.8rem' }}>
          <ArrowLeft size={14} /> Home
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 999 }}>
            <Dot color="#10b981" />
            <span style={{ fontSize: '.7rem', color: '#059669', fontWeight: 600, fontFamily: 'JetBrains Mono,monospace' }}>BANDAGE ACTIVE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 999 }}>
            <AlertTriangle size={12} color="#dc2626" />
            <span style={{ fontSize: '.7rem', color: '#dc2626', fontWeight: 600 }}>HIGH ALERT</span>
          </div>
          <button onClick={() => nav('/dashboard')} className="btn" style={{ padding: '8px 16px', fontSize: '.78rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cpu size={13} /> Try Real AI
          </button>
        </div>
      </div>

      {/* ── PAGE TITLE ──────────────────────── */}
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.3rem,3.5vw,1.9rem)', fontWeight: 800, color: '#0f2744', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Smart Bandage <span style={{ color: '#2c7be5' }}>Live Analysis</span>
        </h1>
        <p style={{ fontSize: '.78rem', color: '#4a7095' }}>
          Demo mode — simulating real-time sensor stream + AI inference &nbsp;·&nbsp;
          <span style={{ color: '#2c7be5', fontFamily: 'JetBrains Mono,monospace', fontSize: '.7rem' }}>
            Updated {tick * 3}s ago
          </span>
        </p>
      </div>

      {/* ── SENSOR STRIP ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 16 }}>
        <SensorCard icon={Thermometer} label="Temperature"    value={SENSORS.temperature} unit="°C"  color={tempColor}  sub="Wound hyperthermia" glow />
        <SensorCard icon={Droplets}    label="Moisture"       value={SENSORS.moisture}    unit="%"   color={moistColor} sub="Below optimal range" glow={SENSORS.moisture < 45} />
        <SensorCard icon={Eye}         label="Infection Sensor" value={0}                 unit=""    color={colorDot}   sub="Sensor: RED — Alert" glow />
        <SensorCard icon={Activity}    label="Heart Rate"     value={SENSORS.heart_rate}  unit=" BPM" color="#7c3aed"   sub="Mild tachycardia" glow={false} />
      </div>

      {/* ── MAIN GRID ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 16, alignItems: 'start' }}>

        {/* LEFT — Image + quick vitals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Wound image */}
          <div style={{ background: 'white', border: '1px solid rgba(44,123,229,.15)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(44,123,229,.08)' }}>
            {/* Header bar */}
            <div style={{ background: 'linear-gradient(135deg,#0f2744,#1a3a5a)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Dot color="#10b981" />
                <span style={{ fontSize: '.72rem', color: '#e2f0ff', fontWeight: 600, letterSpacing: '.08em', fontFamily: 'JetBrains Mono,monospace' }}>AI SCANNING</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wifi size={12} color="#38bdf8" />
                <span style={{ fontSize: '.65rem', color: '#4a7095', fontFamily: 'JetBrains Mono,monospace' }}>ACTIVE</span>
              </div>
            </div>

            {/* Image area */}
            <div style={{ position: 'relative', background: '#f8faff', minHeight: 220 }}>
              <img
                src={WOUND_IMAGE}
                alt="Burn wound — clinical analysis demo"
                onLoad={() => setImgLoaded(true)}
                onError={e => { e.target.style.display = 'none' }}
                style={{ width: '100%', maxHeight: 260, objectFit: 'cover', display: 'block', opacity: imgLoaded ? 1 : 0, transition: 'opacity .5s' }}
              />
              {!imgLoaded && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f7ff' }}>
                  <div style={{ width: 32, height: 32, border: '3px solid rgba(44,123,229,.2)', borderTop: '3px solid #2c7be5', borderRadius: '50%' }} className="sp" />
                </div>
              )}
              {imgLoaded && (
                <>
                  {/* Scan line animation */}
                  <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(44,123,229,.6),transparent)', animation: 'scanLine 2.5s ease-in-out infinite', top: 0 }} />
                  {/* Bottom label */}
                  <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, background: 'rgba(15,39,68,.8)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '.68rem', color: '#b8d8f8', fontFamily: 'JetBrains Mono,monospace' }}>Wound — Left Forearm</span>
                    <span className="badge b-amber">2nd Degree</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick vitals */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <div className="slabel" style={{ marginBottom: 12 }}>Wound Measurements</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Surface Area', value: AI_RESULT.surface_area, color: '#f59e0b' },
                { label: 'Depth',        value: AI_RESULT.depth,        color: '#dc2626' },
                { label: 'Burn Class',   value: 'Moderate',             color: '#f59e0b' },
                { label: 'Est. Recovery',value: AI_RESULT.estimated_healing, color: '#10b981' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: '#f0f7ff', borderRadius: 12, padding: '12px', border: '1px solid rgba(44,123,229,.1)', textAlign: 'center' }}>
                  <div style={{ fontSize: '.6rem', color: '#4a7095', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>{label}</div>
                  <div className="font-mono" style={{ fontSize: '.88rem', color, fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Infection color sensor */}
          <div className="gr" style={{ padding: '14px 18px', background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Eye size={16} color="#dc2626" />
                <span style={{ fontSize: '.78rem', color: '#4a7095', fontWeight: 500 }}>Infection Color Sensor</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Dot color="#dc2626" />
                <span style={{ fontSize: '.78rem', color: '#dc2626', fontWeight: 700 }}>RED — INFECTION DETECTED</span>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: '.72rem', color: '#b91c1c', lineHeight: 1.5 }}>
              Bandage color indicator has changed from yellow to red. Bacterial infection markers detected in wound exudate.
            </div>
          </div>
        </div>

        {/* CENTER — Assessment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Alert banner */}
          <div className="gr" style={{ padding: '16px 18px', background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <XCircle size={24} color="#dc2626" />
            <div>
              <div style={{ fontSize: '.63rem', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 700, marginBottom: 3 }}>Alert Level — HIGH</div>
              <div style={{ fontSize: '.86rem', color: '#0f2744' }}>{AI_RESULT.alert_message}</div>
            </div>
          </div>

          {/* AI Assessment bars */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
              <BarChart3 size={14} color="#2c7be5" />
              <div className="slabel" style={{ marginBottom: 0 }}>AI Wound Assessment</div>
            </div>
            <Bar label="Inflammation Level"        pct={AI_RESULT.inflammation}     color="#dc2626" />
            <Bar label="Tissue Damage (Necrosis)"  pct={AI_RESULT.tissue_damage}    color="#f59e0b" />
            <Bar label="Healing Progress"           pct={AI_RESULT.healing_progress} color="#10b981" />
            <Bar label="Wound Oxygenation"          pct={AI_RESULT.oxygen_level}     color="#2c7be5" />
            <Bar label="AI Detection Confidence"    pct={AI_RESULT.confidence}       color="#7c3aed" />
          </div>

          {/* Key metrics grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Burn Severity',   value: AI_RESULT.burn_severity,    color: '#f59e0b', icon: ShieldAlert },
              { label: 'Infection Risk',  value: AI_RESULT.infection_risk,   color: '#dc2626', icon: AlertTriangle },
              { label: 'Healing Status',  value: AI_RESULT.healing_status,   color: '#f59e0b', icon: TrendingUp },
              { label: 'AI Confidence',   value: `${AI_RESULT.confidence}%`, color: '#2c7be5', icon: Cpu },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} style={{ background: 'white', border: `1px solid ${color}20`, borderRadius: 14, padding: '14px', boxShadow: `0 2px 8px ${color}10` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                  <Icon size={11} color={color} />
                  <span style={{ fontSize: '.6rem', color: '#4a7095', textTransform: 'uppercase', letterSpacing: '.07em' }}>{label}</span>
                </div>
                <div className="font-mono" style={{ fontSize: '1rem', color, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Healing timeline */}
          <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(124,58,237,.1)', border: '1px solid rgba(124,58,237,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={19} color="#7c3aed" />
            </div>
            <div>
              <div style={{ fontSize: '.62rem', color: '#4a7095', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3 }}>Estimated Healing Time</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', color: '#7c3aed', fontWeight: 700 }}>{AI_RESULT.estimated_healing}</div>
              <div style={{ fontSize: '.68rem', color: '#4a7095', marginTop: 2 }}>With current infection — recovery may be extended</div>
            </div>
          </div>
        </div>

        {/* RIGHT — Decisions + Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* AI Decisions */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <Zap size={14} color="#2c7be5" />
              <div className="slabel" style={{ marginBottom: 0 }}>AI Decision</div>
            </div>
            {DECISIONS.map(({ icon: Icon, color, title, detail }, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < DECISIONS.length - 1 ? '1px solid rgba(44,123,229,.07)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: '.82rem', fontWeight: 700, color: '#0f2744', marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: '.74rem', color: '#4a7095', lineHeight: 1.55 }}>{detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <ShieldAlert size={14} color="#f59e0b" />
              <div className="slabel" style={{ marginBottom: 0 }}>Clinical Recommendations</div>
            </div>
            {RECS.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '8px 0', borderBottom: i < RECS.length - 1 ? '1px solid rgba(44,123,229,.07)' : 'none' }}>
                <ChevronRight size={13} color="#2c7be5" style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: '.8rem', color: '#4a7095', lineHeight: 1.6 }}>{r}</span>
              </div>
            ))}
          </div>

          {/* Architecture note */}
          <div style={{ padding: '14px 16px', background: 'rgba(44,123,229,.04)', border: '1px dashed rgba(44,123,229,.22)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <CheckCircle size={13} color="#10b981" />
              <span style={{ fontSize: '.72rem', color: '#10b981', fontWeight: 700 }}>FUTURE-READY ARCHITECTURE</span>
            </div>
            <div style={{ fontSize: '.7rem', color: '#4a7095', lineHeight: 1.65 }}>
              This demo simulates the complete workflow.<br />
              The system is designed to upgrade seamlessly by:<br />
              · Replacing <code style={{ fontFamily: 'JetBrains Mono,monospace', color: '#2c7be5', fontSize: '.67rem' }}>best.pt</code> with retrained model<br />
              · Connecting ESP32 sensors via WiFi<br />
              · Enabling live data streaming
            </div>
            <button onClick={() => nav('/dashboard')} className="btn" style={{ width: '100%', padding: '10px', fontSize: '.8rem', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              <Cpu size={13} /> Try Real AI Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM INFO BAR ─────────────────── */}
      <div style={{ marginTop: 20, padding: '12px 18px', borderRadius: 12, background: 'white', border: '1px solid rgba(44,123,229,.1)', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', boxShadow: '0 2px 8px rgba(44,123,229,.05)' }}>
        {[
          ['Status',    'Demo Simulation'],
          ['AI Model',  'YOLOv8 (pending)'],
          ['Sensors',   'ESP32 (future)'],
          ['Update Rate','3s interval'],
          ['Team',      "Qassim · ITEX'26"],
        ].map(([l, v]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.57rem', color: '#93b8d4', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>{l}</div>
            <div className="font-mono" style={{ fontSize: '.7rem', color: '#4a7095' }}>{v}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(0);    opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(260px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
