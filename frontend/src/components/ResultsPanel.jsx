/**
 * ResultsPanel.jsx
 * ──────────────────────────────────────────────────────────
 * Renders the AI output from /predict/image or /predict/full.
 * Works with both modes:
 *   • image-only → yolo_result shape  (burn_class, burn_label, confidence, all_probs)
 *   • hybrid     → hybrid_result shape (burn_severity, alert_level, recommendations …)
 *
 * No route or API changes required — reads what the backend returns.
 */

import { Activity, AlertTriangle, CheckCircle, Zap, ThermometerSun, Droplets } from 'lucide-react'

// ── Colour palette ──────────────────────────────────────────
const SEVERITY_COLORS = {
  Mild:     { primary: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)' },
  Moderate: { primary: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.25)'  },
  Severe:   { primary: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
  default:  { primary: '#38bdf8', bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.2)'   },
}

const ALERT_COLORS = {
  LOW:      '#34d399',
  MEDIUM:   '#fbbf24',
  HIGH:     '#fb923c',
  CRITICAL: '#f87171',
}

const RISK_COLORS = {
  LOW:    '#34d399',
  MEDIUM: '#fbbf24',
  HIGH:   '#f87171',
}

// ── Confidence / probability bar ────────────────────────────
function ProbBar({ label, value, isTop, color }) {
  const pct = Math.round((value ?? 0) * 100)
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: '0.72rem', color: isTop ? '#e8f0fe' : '#5d7fa3', fontWeight: isTop ? 600 : 400 }}>
          {label}
        </span>
        <span style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: isTop ? color : '#5d7fa3' }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 3,
          background: isTop ? color : 'rgba(255,255,255,0.1)',
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

// ── Section label ────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.6rem', color: '#2d4a68',
      textTransform: 'uppercase', letterSpacing: '0.12em',
      marginBottom: 8, marginTop: 16,
    }}>
      {children}
    </div>
  )
}

// ── Divider ──────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '14px 0' }} />
}

// ── Empty state ──────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(56,189,248,0.06)',
        border: '1px solid rgba(56,189,248,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <Activity size={22} color="#2d4a68" />
      </div>
      <p style={{ color: '#2d4a68', fontSize: '0.8rem', lineHeight: 1.6 }}>
        Upload a wound image and<br />click <strong style={{ color: '#38bdf8' }}>Run AI Analysis</strong>
      </p>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────
export default function ResultsPanel({ result }) {
  if (!result) return <EmptyState />

  // ── Normalise field names ─────────────────────────────────
  // /predict/image returns: burn_label, confidence, all_probs, description
  // /predict/full  returns: burn_severity, image_confidence, alert_level, …
  const burnLabel   = result.burn_severity  ?? result.burn_label ?? '—'
  const confidence  = result.image_confidence ?? result.confidence ?? 0
  const description = result.burn_description ?? result.description ?? ''
  const allProbs    = result.all_probs ?? null           // classification probs
  const alertLevel  = result.alert_level ?? null         // hybrid only
  const alertMsg    = result.alert_message ?? null
  const infectionRisk   = result.infection_risk ?? null
  const healingStatus   = result.healing_status ?? null
  const recommendations = result.recommendations ?? null
  const healingTime     = result.estimated_healing_time ?? null
  const temperature     = result.temperature ?? null
  const moisture        = result.moisture ?? null
  const colorStatus     = result.color_status ?? null
  const modelType       = result.model_type ?? null

  const palette = SEVERITY_COLORS[burnLabel] ?? SEVERITY_COLORS.default
  const alertColor = alertLevel ? ALERT_COLORS[alertLevel] ?? '#38bdf8' : null

  return (
    <div>

      {/* ── Primary severity badge ── */}
      <div style={{
        padding: '16px 18px',
        borderRadius: 14,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        marginBottom: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
              Burn Classification
            </div>
            <div className="font-display" style={{ fontSize: '1.5rem', color: palette.primary, fontWeight: 800, lineHeight: 1.1 }}>
              {burnLabel}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', color: '#5d7fa3', marginBottom: 4 }}>Confidence</div>
            <div className="font-mono" style={{ fontSize: '1.6rem', color: palette.primary, fontWeight: 700 }}>
              {(confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Confidence bar */}
        <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
          <div style={{
            height: '100%',
            width: `${Math.round(confidence * 100)}%`,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${palette.primary}99, ${palette.primary})`,
            transition: 'width 0.7s ease',
          }} />
        </div>

        {description && (
          <p style={{ marginTop: 10, fontSize: '0.74rem', color: '#5d7fa3', lineHeight: 1.6 }}>
            {description}
          </p>
        )}
      </div>

      {/* ── All-class probability bars (classification model) ── */}
      {allProbs && Object.keys(allProbs).length > 0 && (
        <>
          <SectionLabel>Class Probabilities</SectionLabel>
          {Object.entries(allProbs).map(([label, prob]) => (
            <ProbBar
              key={label}
              label={label}
              value={prob}
              isTop={label === burnLabel}
              color={palette.primary}
            />
          ))}
        </>
      )}

      {/* ── Alert level (hybrid mode) ── */}
      {alertLevel && (
        <>
          <Divider />
          <div style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: `${alertColor}10`,
            border: `1px solid ${alertColor}30`,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            {alertLevel === 'CRITICAL' || alertLevel === 'HIGH'
              ? <AlertTriangle size={15} color={alertColor} style={{ flexShrink: 0, marginTop: 1 }} />
              : <CheckCircle   size={15} color={alertColor} style={{ flexShrink: 0, marginTop: 1 }} />
            }
            <div>
              <div className="font-mono" style={{ fontSize: '0.72rem', color: alertColor, fontWeight: 700, marginBottom: 2 }}>
                {alertLevel} ALERT
              </div>
              {alertMsg && (
                <div style={{ fontSize: '0.72rem', color: '#5d7fa3', lineHeight: 1.5 }}>
                  {alertMsg}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Sensor readings (hybrid mode) ── */}
      {temperature !== null && (
        <>
          <SectionLabel>Sensor Readings</SectionLabel>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              {
                icon: ThermometerSun,
                label: 'Temperature',
                value: `${temperature}°C`,
                color: temperature > 38.5 ? '#f87171' : temperature > 37.5 ? '#fbbf24' : '#34d399',
              },
              {
                icon: Droplets,
                label: 'Moisture',
                value: `${moisture}%`,
                color: moisture < 20 ? '#f87171' : moisture > 80 ? '#fbbf24' : '#38bdf8',
              },
              {
                icon: Zap,
                label: 'Color',
                value: (colorStatus ?? '').toUpperCase(),
                color: { green: '#34d399', yellow: '#fbbf24', red: '#f87171' }[colorStatus] ?? '#38bdf8',
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{
                flex: '1 1 80px',
                padding: '10px 12px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
              }}>
                <Icon size={14} color={color} style={{ marginBottom: 4 }} />
                <div className="font-mono" style={{ fontSize: '0.85rem', color, fontWeight: 700 }}>{value}</div>
                <div style={{ fontSize: '0.6rem', color: '#2d4a68', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Infection risk + healing (hybrid mode) ── */}
      {infectionRisk && (
        <>
          <SectionLabel>Clinical Indicators</SectionLabel>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{
              flex: 1, padding: '10px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.6rem', color: '#2d4a68', marginBottom: 4 }}>Infection Risk</div>
              <div className="font-mono" style={{ fontSize: '0.85rem', color: RISK_COLORS[infectionRisk] ?? '#38bdf8', fontWeight: 700 }}>
                {infectionRisk}
              </div>
            </div>
            {healingStatus && (
              <div style={{
                flex: 1, padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.6rem', color: '#2d4a68', marginBottom: 4 }}>Healing Status</div>
                <div className="font-mono" style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
                  {healingStatus}
                </div>
              </div>
            )}
          </div>
          {healingTime && (
            <div style={{ marginTop: 8, fontSize: '0.72rem', color: '#5d7fa3', textAlign: 'center' }}>
              Estimated healing: <span style={{ color: '#e8f0fe' }}>{healingTime}</span>
            </div>
          )}
        </>
      )}

      {/* ── Recommendations (hybrid mode) ── */}
      {recommendations && recommendations.length > 0 && (
        <>
          <Divider />
          <SectionLabel>Clinical Recommendations</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recommendations.map((rec, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '7px 10px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
                  marginTop: 6,
                  background: alertColor ?? palette.primary,
                }} />
                <span style={{ fontSize: '0.74rem', color: '#5d7fa3', lineHeight: 1.55 }}>{rec}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Model type badge ── */}
      {modelType && (
        <div style={{ marginTop: 14, textAlign: 'right' }}>
          <span style={{
            fontSize: '0.6rem',
            color: '#2d4a68',
            fontFamily: 'JetBrains Mono, monospace',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
            padding: '2px 7px',
            borderRadius: 4,
          }}>
            model: {modelType}
          </span>
        </div>
      )}
    </div>
  )
}
