import { Activity, Wifi, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'

export default function Header() {
  const [apiStatus, setApiStatus] = useState('checking')
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  useEffect(() => {
    axios.get('/health')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'))
  }, [])

  return (
    <header style={{
      background: 'rgba(5, 11, 22, 0.92)',
      borderBottom: '1px solid rgba(56,189,248,0.12)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            background: 'linear-gradient(135deg, #f87132, #fbbf24)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(248,113,50,0.5)',
            flexShrink: 0,
          }}>
            <Activity size={19} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display" style={{
              fontSize: '1.15rem',
              color: '#e8f0fe',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              fontWeight: 700,
            }}>
              Aesthetic <span style={{ color: '#38bdf8' }}>Skin</span>
            </div>
            <div style={{ fontSize: '0.6rem', color: '#2d4a68', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 1 }}>
              AI Smart Bandage · ITEX'26
            </div>
          </div>
        </Link>

        {/* Center nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'Home', path: '/' },
            { label: 'Dashboard', path: '/dashboard' },
          ].map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: location.pathname === path ? '#38bdf8' : '#5d7fa3',
                background: location.pathname === path ? 'rgba(56,189,248,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: API status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.72rem',
            color: apiStatus === 'online' ? '#34d399' : apiStatus === 'offline' ? '#f87171' : '#5d7fa3',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            <span
              className={apiStatus === 'online' ? 'dot-pulse' : ''}
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: apiStatus === 'online' ? '#34d399' : apiStatus === 'offline' ? '#f87171' : '#5d7fa3',
                display: 'inline-block',
              }}
            />
            <Wifi size={13} />
            AI {apiStatus}
          </div>

          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 16px',
              background: 'linear-gradient(135deg, #f87132, #fbbf24)',
              borderRadius: 8,
              color: 'white',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(248,113,50,0.35)',
              transition: 'opacity 0.2s',
            }}
          >
            Start Diagnosis <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </header>
  )
}
