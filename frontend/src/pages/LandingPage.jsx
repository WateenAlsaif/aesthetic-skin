import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Activity, Cpu, Eye, Shield, Zap, ArrowRight,
  Thermometer, Droplets, AlertTriangle, CheckCircle,
  ChevronRight, Star, BarChart3
} from 'lucide-react'

// ── Animated counter ─────────────────────────────
function AnimatedNumber({ target, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const step = () => {
          const progress = Math.min((Date.now() - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setVal(Math.round(target * ease))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ── Feature Card ─────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color, delay }) {
  return (
    <div
      className="card animate-fade-up"
      style={{
        padding: '28px 24px',
        animationDelay: `${delay}s`,
        opacity: 0,
        animationFillMode: 'forwards',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: 120, height: 120,
        background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
        borderRadius: '0 18px 0 0',
      }} />
      <div style={{
        width: 48, height: 48,
        borderRadius: 14,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div className="font-display" style={{ fontSize: '1.05rem', color: '#e8f0fe', fontWeight: 700, marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#5d7fa3', lineHeight: 1.65 }}>
        {desc}
      </div>
    </div>
  )
}

// ── Stat Card ────────────────────────────────────
function StatCard({ number, suffix, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="font-display" style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 800,
        color: color,
        lineHeight: 1,
        marginBottom: 6,
      }}>
        <AnimatedNumber target={number} suffix={suffix} />
      </div>
      <div style={{ fontSize: '0.78rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </div>
    </div>
  )
}

// ── Step Card ────────────────────────────────────
function StepCard({ num, icon: Icon, title, desc, color }) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <div style={{
        width: 48, height: 48,
        borderRadius: 14,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.65rem',
          color: color,
          fontFamily: 'JetBrains Mono, monospace',
          marginBottom: 4,
          letterSpacing: '0.1em',
        }}>STEP {num.toString().padStart(2, '0')}</div>
        <div className="font-display" style={{ fontSize: '0.95rem', color: '#e8f0fe', fontWeight: 700, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5d7fa3', lineHeight: 1.6 }}>
          {desc}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* ── HERO ──────────────────────────────────── */}
      <section className="hero-bg" style={{ padding: '100px 24px 80px', position: 'relative', overflow: 'hidden' }}>

        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(248,113,50,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '5%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>

          {/* Badge */}
          <div
            className="animate-fade-up"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px',
              background: 'rgba(248,113,50,0.1)',
              border: '1px solid rgba(248,113,50,0.3)',
              borderRadius: 999,
              fontSize: '0.72rem',
              color: '#f87132',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 28,
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            <Star size={11} fill="#f87132" />
            ITEX 2026 · Qassim University Innovation
          </div>

          {/* Hero heading */}
          <h1
            className="font-display animate-fade-up stagger-1"
            style={{
              fontSize: 'clamp(2.6rem, 7vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: 24,
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            <span style={{ color: '#e8f0fe' }}>AI-Powered</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #f87132 0%, #fbbf24 50%, #f87132 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200%',
            }}>Smart Regenerative</span>
            <br />
            <span style={{ color: '#e8f0fe' }}>Bandage</span>
          </h1>

          <p
            className="animate-fade-up stagger-2"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: '#5d7fa3',
              lineHeight: 1.75,
              maxWidth: 680,
              margin: '0 auto 40px',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            The world's first integrated system combining AI monitoring, bioactive regeneration,
            real-time infection detection, and personalized drug delivery — in one dissolving smart bandage.
          </p>

          {/* CTA buttons */}
          <div
            className="animate-fade-up stagger-3"
            style={{
              display: 'flex', gap: 12, justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: 0, animationFillMode: 'forwards',
            }}
          >
            <button
              className="btn-primary"
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 32px',
                fontSize: '0.95rem',
                boxShadow: '0 8px 32px rgba(248,113,50,0.4)',
              }}
            >
              <Cpu size={18} /> Start AI Diagnosis
              <ArrowRight size={16} />
            </button>
            <a
              href="#how-it-works"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 28px',
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.25)',
                borderRadius: 12,
                color: '#38bdf8',
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              How It Works <ChevronRight size={16} />
            </a>
          </div>

          {/* Tagline pills */}
          <div
            className="animate-fade-up stagger-4"
            style={{
              display: 'flex', gap: 10, justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: 48,
              opacity: 0, animationFillMode: 'forwards',
            }}
          >
            {[
              { icon: CheckCircle, label: 'Non-invasive & Painless', color: '#34d399' },
              { icon: Activity, label: 'Real-time Monitoring', color: '#38bdf8' },
              { icon: Shield, label: 'Infection Detection', color: '#a78bfa' },
              { icon: Zap, label: '30–50% Faster Healing', color: '#fbbf24' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px',
                background: `${color}0f`,
                border: `1px solid ${color}25`,
                borderRadius: 999,
                fontSize: '0.75rem',
                color,
                fontWeight: 500,
              }}>
                <Icon size={13} /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────── */}
      <div style={{
        background: 'rgba(10,22,40,0.8)',
        borderTop: '1px solid rgba(56,189,248,0.08)',
        borderBottom: '1px solid rgba(56,189,248,0.08)',
        padding: '48px 24px',
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 40,
        }}>
          <StatCard number={11} suffix="M+" label="Burn injuries yearly" color="#f87132" />
          <StatCard number={50} suffix="%" label="Faster healing rate" color="#38bdf8" />
          <StatCard number={10000} suffix="+" label="Potential $ saved/patient" color="#a78bfa" />
          <StatCard number={3} suffix="" label="Burn classes detected" color="#34d399" />
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            fontSize: '0.7rem',
            color: '#38bdf8',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 12,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            — Core Capabilities —
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            color: '#e8f0fe',
            letterSpacing: '-0.02em',
          }}>
            Four Technologies. One Bandage.
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}>
          <FeatureCard
            icon={Cpu}
            title="AI Wound Analysis"
            desc="YOLOv8 computer vision classifies burn severity across 3 degrees in real-time with clinical-grade confidence scoring."
            color="#f87132"
            delay={0}
          />
          <FeatureCard
            icon={Activity}
            title="Bioactive Regeneration"
            desc="Controlled release of antibiotics, growth factors, and Vitamin E & C through biodegradable hydrogel for accelerated healing."
            color="#38bdf8"
            delay={0.05}
          />
          <FeatureCard
            icon={Eye}
            title="Infection Detection"
            desc="Color-changing sensor turns red when infection indicators are detected. Early warning before symptoms appear."
            color="#a78bfa"
            delay={0.1}
          />
          <FeatureCard
            icon={BarChart3}
            title="Sensor Data Fusion"
            desc="Temperature, moisture, and color sensors combine with AI image analysis for a complete hybrid decision model."
            color="#fbbf24"
            delay={0.15}
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section id="how-it-works" style={{
        padding: '80px 24px',
        background: 'rgba(10,22,40,0.5)',
        borderTop: '1px solid rgba(56,189,248,0.07)',
        borderBottom: '1px solid rgba(56,189,248,0.07)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              fontSize: '0.7rem',
              color: '#38bdf8',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 12,
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              — The Process —
            </div>
            <h2 className="font-display" style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 800,
              color: '#e8f0fe',
              letterSpacing: '-0.02em',
            }}>
              How Aesthetic Skin Works
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 40,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <StepCard
                num={1} icon={Activity} color="#f87132"
                title="Apply the Smart Bandage"
                desc="The biodegradable hydrogel bandage adapts to the wound surface, creating an optimal moist healing environment."
              />
              <StepCard
                num={2} icon={Zap} color="#38bdf8"
                title="Real-time Bioactive Release"
                desc="Nanoparticles embedded in the bandage deliver antibiotics and growth factors at clinically controlled rates."
              />
              <StepCard
                num={3} icon={Cpu} color="#a78bfa"
                title="AI Analysis & Prediction"
                desc="Upload a wound photo — our YOLOv8 model detects burn severity and generates personalized recovery predictions."
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <StepCard
                num={4} icon={Eye} color="#fbbf24"
                title="Infection Sensor Monitoring"
                desc="Integrated color-changing sensor detects infection indicators automatically, changing from green to red as a visual alert."
              />
              <StepCard
                num={5} icon={Thermometer} color="#34d399"
                title="Sensor Fusion Analysis"
                desc="Temperature and moisture sensors stream data to the AI decision engine for infection risk scoring and healing status."
              />
              <StepCard
                num={6} icon={Shield} color="#f87171"
                title="Clinical Recommendations"
                desc="The system generates evidence-based treatment recommendations, estimated healing timelines, and alert levels for clinicians."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SENSOR PREVIEW ────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontSize: '0.7rem',
            color: '#38bdf8',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 12,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            — Sensor Technology —
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)',
            fontWeight: 800,
            color: '#e8f0fe',
            letterSpacing: '-0.02em',
          }}>
            Three Sensors. Complete Picture.
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {[
            {
              icon: Thermometer, label: 'Temperature Sensor',
              value: '36.8°C', sub: 'Normal range: 36–37°C',
              color: '#f87132', barW: 42,
              desc: 'Monitors wound temperature. Elevation above 38.5°C triggers infection alert.',
            },
            {
              icon: Droplets, label: 'Moisture Sensor',
              value: '58%', sub: 'Optimal range: 40–75%',
              color: '#38bdf8', barW: 58,
              desc: 'Tracks wound moisture to ensure optimal healing environment. Too dry or too wet triggers alerts.',
            },
            {
              icon: Eye, label: 'Color Sensor',
              value: 'Green', sub: 'No infection detected',
              color: '#34d399', barW: 100,
              desc: 'Photonic sensor detects infection-induced color changes in bandage indicator. Turns yellow then red.',
            },
          ].map(({ icon: Icon, label, value, sub, color, barW, desc }) => (
            <div key={label} className="card" style={{ padding: '24px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={19} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#5d7fa3', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
                  <div className="font-mono" style={{ fontSize: '1.3rem', color, fontWeight: 500 }}>{value}</div>
                </div>
              </div>
              <div className="progress-track" style={{ marginBottom: 8 }}>
                <div className="progress-fill" style={{
                  width: `${barW}%`,
                  background: `linear-gradient(90deg, ${color}80, ${color})`,
                }} />
              </div>
              <div style={{ fontSize: '0.68rem', color: '#5d7fa3', marginBottom: 10 }}>{sub}</div>
              <div style={{ fontSize: '0.78rem', color: '#3a5470', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, rgba(248,113,50,0.08) 0%, rgba(56,189,248,0.06) 50%, rgba(167,139,250,0.05) 100%)',
        borderTop: '1px solid rgba(248,113,50,0.15)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{
            fontSize: '0.7rem',
            color: '#f87132',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 16,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            Ready to diagnose?
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: '#e8f0fe',
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            Start Your First<br />AI Wound Analysis
          </h2>
          <p style={{ color: '#5d7fa3', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 36 }}>
            Upload a burn wound image, configure sensor readings,
            and receive a complete AI-powered clinical assessment in seconds.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 40px',
              fontSize: '1rem',
              borderRadius: 14,
              boxShadow: '0 8px 40px rgba(248,113,50,0.45)',
            }}
          >
            <Cpu size={20} /> Open AI Dashboard
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer style={{
        padding: '32px 24px',
        background: 'rgba(5,11,22,0.9)',
        borderTop: '1px solid rgba(56,189,248,0.08)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ fontSize: '0.75rem', color: '#2d4a68' }}>
            © 2026 Aesthetic Skin · Qassim University · ITEX'26
          </div>
          <div style={{ fontSize: '0.72rem', color: '#2d4a68', fontFamily: 'JetBrains Mono, monospace' }}>
            HEAL SMARTER · RECOVER FASTER · LIVE BETTER
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Team', 'Contact: laian123890@gmail.com'].map(item => (
              <span key={item} style={{ fontSize: '0.72rem', color: '#2d4a68' }}>{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
