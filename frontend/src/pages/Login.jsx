import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Eye, EyeOff, Lock, User, AlertCircle, UserPlus, LogIn, ChevronDown } from 'lucide-react'

const KEY = 'as_patients'
const getP = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const saveP = p => localStorage.setItem(KEY, JSON.stringify(p))

export default function Login() {
  const [tab, setTab]   = useState('login')
  const [form, setForm] = useState({ name:'', age:'', gender:'', username:'', password:'' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function login(e) {
    e.preventDefault(); setError(''); setLoading(true)
    setTimeout(() => {
      const all = getP()
      const user = all.find(u => u.username === form.username && u.password === form.password)
      if (user) { localStorage.setItem('as_user', JSON.stringify(user)); nav('/analysis') }
      else setError('Incorrect username or password.')
      setLoading(false)
    }, 700)
  }

  function signup(e) {
    e.preventDefault(); setError('')
    if (!form.name || !form.age || !form.gender || !form.username || !form.password) { setError('Please fill all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (getP().find(u => u.username === form.username)) { setError('Username already taken.'); return }
    setLoading(true)
    setTimeout(() => {
      const newUser = { name: form.name, age: form.age, gender: form.gender, username: form.username, password: form.password }
      saveP([...getP(), newUser])
      localStorage.setItem('as_user', JSON.stringify(newUser))
      nav('/analysis')
      setLoading(false)
    }, 700)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#e8f2ff 0%,#f0f7ff 50%,#e3f0fc 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px 16px' }}>
      <div style={{ position:'fixed',top:'-10%',right:'-10%',width:400,height:400,background:'radial-gradient(circle,rgba(44,123,229,.1),transparent 70%)',pointerEvents:'none' }}/>
      <div style={{ position:'fixed',bottom:'-5%',left:'-5%',width:300,height:300,background:'radial-gradient(circle,rgba(14,165,233,.08),transparent 70%)',pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div className="fu" style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:60,height:60,background:'linear-gradient(135deg,#2c7be5,#0ea5e9)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',boxShadow:'0 8px 24px rgba(44,123,229,.35)' }}>
            <Activity size={28} color="white" strokeWidth={2.5}/>
          </div>
          <div className="font-display" style={{ fontSize:'1.6rem',fontWeight:800,color:'#0f2744',letterSpacing:'-0.02em' }}>
            Aesthetic <span style={{ color:'#2c7be5' }}>Skin</span>
          </div>
          <div style={{ fontSize:'.7rem',color:'#93b8d4',letterSpacing:'.12em',textTransform:'uppercase',marginTop:3 }}>AI Smart Bandage · ITEX'26</div>
        </div>

        <div className="card fu s1" style={{ padding:'28px 24px' }}>
          {/* Tabs */}
          <div style={{ display:'flex',background:'#f0f7ff',borderRadius:11,padding:3,gap:3,marginBottom:24 }}>
            {[{id:'login',label:'Sign In',icon:LogIn},{id:'signup',label:'Sign Up',icon:UserPlus}].map(({id,label,icon:Icon})=>(
              <button key={id} onClick={()=>{setTab(id);setError('');setForm({name:'',age:'',gender:'',username:'',password:''})}} style={{ flex:1,padding:'9px',borderRadius:9,border:'none',background:tab===id?'white':'transparent',color:tab===id?'#2c7be5':'#4a7095',fontWeight:tab===id?600:400,cursor:'pointer',fontSize:'.82rem',display:'flex',alignItems:'center',justifyContent:'center',gap:6,boxShadow:tab===id?'0 2px 8px rgba(44,123,229,.12)':'none',transition:'all .2s',fontFamily:'DM Sans,sans-serif' }}>
                <Icon size={14}/>{label}
              </button>
            ))}
          </div>

          {/* LOGIN */}
          {tab==='login' && (
            <form onSubmit={login} style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:'.76rem',fontWeight:600,color:'#0f2744',display:'block',marginBottom:5 }}>Username</label>
                <div style={{ position:'relative' }}>
                  <User size={15} color="#93b8d4" style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)' }}/>
                  <input className="inp" style={{ paddingLeft:36 }} type="text" placeholder="your username" value={form.username} onChange={set('username')} required/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:'.76rem',fontWeight:600,color:'#0f2744',display:'block',marginBottom:5 }}>Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} color="#93b8d4" style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)' }}/>
                  <input className="inp" style={{ paddingLeft:36,paddingRight:40 }} type={showPw?'text':'password'} placeholder="••••••••" value={form.password} onChange={set('password')} required/>
                  <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute',right:11,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#93b8d4',display:'flex',alignItems:'center' }}>
                    {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
              </div>
              {error&&<div style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 12px',background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,color:'#dc2626',fontSize:'.78rem' }}><AlertCircle size={13}/>{error}</div>}
              <button className="btn" type="submit" disabled={loading} style={{ padding:'12px',fontSize:'.9rem',marginTop:4 }}>
                {loading?'Signing in…':'Sign In'}
              </button>
              <p style={{ textAlign:'center',fontSize:'.76rem',color:'#4a7095',marginTop:2 }}>
                Don't have an account?{' '}
                <button type="button" onClick={()=>setTab('signup')} style={{ background:'none',border:'none',color:'#2c7be5',fontWeight:600,cursor:'pointer',fontSize:'.76rem',fontFamily:'DM Sans,sans-serif' }}>Sign Up</button>
              </p>
            </form>
          )}

          {/* SIGNUP */}
          {tab==='signup' && (
            <form onSubmit={signup} style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:'.76rem',fontWeight:600,color:'#0f2744',display:'block',marginBottom:5 }}>Full Name</label>
                <div style={{ position:'relative' }}>
                  <User size={15} color="#93b8d4" style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)' }}/>
                  <input className="inp" style={{ paddingLeft:36 }} type="text" placeholder="Your full name" value={form.name} onChange={set('name')} required/>
                </div>
              </div>

              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                <div>
                  <label style={{ fontSize:'.76rem',fontWeight:600,color:'#0f2744',display:'block',marginBottom:5 }}>Age</label>
                  <input className="inp" type="number" min="1" max="120" placeholder="25" value={form.age} onChange={set('age')} required/>
                </div>
                <div>
                  <label style={{ fontSize:'.76rem',fontWeight:600,color:'#0f2744',display:'block',marginBottom:5 }}>Gender</label>
                  <div style={{ position:'relative' }}>
                    <select className="sel" value={form.gender} onChange={set('gender')} required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <ChevronDown size={14} color="#93b8d4" style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none' }}/>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize:'.76rem',fontWeight:600,color:'#0f2744',display:'block',marginBottom:5 }}>Username</label>
                <div style={{ position:'relative' }}>
                  <User size={15} color="#93b8d4" style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)' }}/>
                  <input className="inp" style={{ paddingLeft:36 }} type="text" placeholder="choose a username" value={form.username} onChange={set('username')} required/>
                </div>
              </div>

              <div>
                <label style={{ fontSize:'.76rem',fontWeight:600,color:'#0f2744',display:'block',marginBottom:5 }}>Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} color="#93b8d4" style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)' }}/>
                  <input className="inp" style={{ paddingLeft:36,paddingRight:40 }} type={showPw?'text':'password'} placeholder="min 6 characters" value={form.password} onChange={set('password')} required/>
                  <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute',right:11,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#93b8d4',display:'flex',alignItems:'center' }}>
                    {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
              </div>

              {error&&<div style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 12px',background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,color:'#dc2626',fontSize:'.78rem' }}><AlertCircle size={13}/>{error}</div>}
              <button className="btn" type="submit" disabled={loading} style={{ padding:'12px',fontSize:'.9rem',marginTop:4 }}>
                {loading?'Creating account…':'Create Account'}
              </button>
              <p style={{ textAlign:'center',fontSize:'.76rem',color:'#4a7095',marginTop:2 }}>
                Already have an account?{' '}
                <button type="button" onClick={()=>setTab('login')} style={{ background:'none',border:'none',color:'#2c7be5',fontWeight:600,cursor:'pointer',fontSize:'.76rem',fontFamily:'DM Sans,sans-serif' }}>Sign In</button>
              </p>
            </form>
          )}
        </div>

        <div style={{ textAlign:'center',marginTop:18,fontSize:'.7rem',color:'#93b8d4' }}>© 2026 Aesthetic Skin · Qassim University</div>
      </div>
    </div>
  )
}
