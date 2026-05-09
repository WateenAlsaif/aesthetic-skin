import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'

// Demo credentials — replace with real auth later
const USERS = [
  { name: 'Dr. Sarah Al-Rashid', username: 'doctor1', password: 'aesthetic2026' },
  { name: 'Nurse Fatima',        username: 'nurse1',   password: 'aesthetic2026' },
  { name: 'Admin',               username: 'admin',    password: 'admin123' },
]

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const nav = useNavigate()

  function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password)
      if (user) {
        localStorage.setItem('as_user', JSON.stringify(user))
        nav('/dashboard')
      } else {
        setError('Incorrect username or password.')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f2ff 0%, #f0f7ff 50%, #e3f0fc 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px 16px',
    }}>
      {/* Background decoration */}
      <div style={{ position:'fixed',top:'-10%',right:'-10%',width:400,height:400,background:'radial-gradient(circle,rgba(44,123,229,.1) 0%,transparent 70%)',pointerEvents:'none' }} />
      <div style={{ position:'fixed',bottom:'-5%',left:'-5%',width:300,height:300,background:'radial-gradient(circle,rgba(14,165,233,.08) 0%,transparent 70%)',pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:420 }}>

        {/* Logo */}
        <div className="fade-up" style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{
            width:64, height:64,
            background:'linear-gradient(135deg,#2c7be5,#0ea5e9)',
            borderRadius:18,
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 14px',
            boxShadow:'0 8px 24px rgba(44,123,229,.35)',
          }}>
            <Activity size={30} color="white" strokeWidth={2.5} />
          </div>
          <div className="font-display" style={{ fontSize:'1.7rem', fontWeight:800, color:'#0f2744', letterSpacing:'-0.02em' }}>
            Aesthetic <span style={{ color:'#2c7be5' }}>Skin</span>
          </div>
          <div style={{ fontSize:'.72rem', color:'#93b8d4', letterSpacing:'.12em', textTransform:'uppercase', marginTop:4 }}>
            AI Smart Bandage · ITEX'26
          </div>
        </div>

        {/* Card */}
        <div className="card fade-up s1" style={{ padding:'32px 28px' }}>
          <div style={{ marginBottom:24 }}>
            <h2 className="font-display" style={{ fontSize:'1.25rem', fontWeight:700, color:'#0f2744', marginBottom:4 }}>Sign In</h2>
            <p style={{ fontSize:'.82rem', color:'#4a7095' }}>Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Username */}
            <div>
              <label style={{ fontSize:'.78rem', fontWeight:600, color:'#0f2744', display:'block', marginBottom:6 }}>Username</label>
              <div style={{ position:'relative' }}>
                <User size={16} color="#93b8d4" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }} />
                <input
                  className="inp"
                  style={{ paddingLeft:38 }}
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize:'.78rem', fontWeight:600, color:'#0f2744', display:'block', marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} color="#93b8d4" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }} />
                <input
                  className="inp"
                  style={{ paddingLeft:38, paddingRight:42 }}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#93b8d4',display:'flex',alignItems:'center' }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 13px',background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,color:'#dc2626',fontSize:'.8rem' }}>
                <AlertCircle size={14}/> {error}
              </div>
            )}

            {/* Submit */}
            <button className="btn" type="submit" disabled={loading} style={{ padding:'13px', fontSize:'.92rem', marginTop:4 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop:20, padding:'12px 14px', background:'#f0f7ff', borderRadius:10, border:'1px solid #d1e5f5' }}>
            <div style={{ fontSize:'.7rem', color:'#4a7095', marginBottom:6, fontWeight:600 }}>Demo credentials:</div>
            <div className="font-mono" style={{ fontSize:'.7rem', color:'#2c7be5' }}>
              username: <strong>doctor1</strong><br/>
              password: <strong>aesthetic2026</strong>
            </div>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:20, fontSize:'.72rem', color:'#93b8d4' }}>
          © 2026 Aesthetic Skin · Qassim University
        </div>
      </div>
    </div>
  )
}
