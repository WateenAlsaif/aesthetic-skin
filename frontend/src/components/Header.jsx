import { Activity, Menu, X, LogOut, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const loc = useLocation()
  const nav = useNavigate()

  useEffect(() => { try { setUser(JSON.parse(localStorage.getItem('as_user'))) } catch {} }, [loc])
  useEffect(() => setOpen(false), [loc])
  function logout() { localStorage.removeItem('as_user'); nav('/login') }
  const act = p => loc.pathname === p

  return (
    <header style={{ background:'rgba(255,255,255,.95)',borderBottom:'1px solid rgba(44,123,229,.12)',backdropFilter:'blur(16px)',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 16px rgba(44,123,229,.08)' }}>
      <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 16px',height:58,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <Link to="/" style={{ textDecoration:'none',display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:36,height:36,background:'linear-gradient(135deg,#2c7be5,#0ea5e9)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(44,123,229,.4)',flexShrink:0 }}>
            <Activity size={18} color="white" strokeWidth={2.5}/>
          </div>
          <div>
            <div className="font-display" style={{ fontSize:'1.08rem',color:'#0f2744',letterSpacing:'-0.01em',lineHeight:1.1,fontWeight:700 }}>Aesthetic <span style={{ color:'#2c7be5' }}>Skin</span></div>
            <div style={{ fontSize:'.57rem',color:'#93b8d4',letterSpacing:'.1em',textTransform:'uppercase' }}>AI Smart Bandage</div>
          </div>
        </Link>

        <nav className="hm" style={{ display:'flex',alignItems:'center',gap:4 }}>
          {[{l:'Home',p:'/'},{l:'Analysis',p:'/analysis'},{l:'AI Dashboard',p:'/dashboard'}].map(({l,p})=>(
            <Link key={p} to={p} style={{ padding:'6px 14px',borderRadius:8,fontSize:'.8rem',fontWeight:500,textDecoration:'none',color:act(p)?'#2c7be5':'#4a7095',background:act(p)?'rgba(44,123,229,.1)':'transparent',transition:'all .2s' }}>{l}</Link>
          ))}
        </nav>

        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          {user ? (
            <>
              <div className="hm" style={{ display:'flex',alignItems:'center',gap:8 }}>
                <div style={{ width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#2c7be5,#0ea5e9)',display:'flex',alignItems:'center',justifyContent:'center' }}><User size={14} color="white"/></div>
                <div>
                  <div style={{ fontSize:'.72rem',color:'#0f2744',fontWeight:600,lineHeight:1.2 }}>{user.name}</div>
                  <div style={{ fontSize:'.6rem',color:'#93b8d4' }}>Age {user.age} · {user.gender}</div>
                </div>
              </div>
              <button onClick={logout} style={{ background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,padding:'6px 10px',cursor:'pointer',color:'#dc2626',display:'flex',alignItems:'center',gap:4,fontSize:'.72rem',fontWeight:500,fontFamily:'DM Sans,sans-serif' }}>
                <LogOut size={12}/><span className="hm">Sign Out</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn" style={{ padding:'7px 18px',fontSize:'.78rem',textDecoration:'none',display:'flex',alignItems:'center' }}>Sign In</Link>
          )}
          <button onClick={()=>setOpen(!open)} className="sm" style={{ background:'rgba(44,123,229,.08)',border:'1px solid rgba(44,123,229,.2)',borderRadius:8,padding:'6px',cursor:'pointer',color:'#2c7be5',alignItems:'center',justifyContent:'center' }}>
            {open?<X size={18}/>:<Menu size={18}/>}
          </button>
        </div>
      </div>
      {open && (
        <div style={{ background:'white',borderTop:'1px solid rgba(44,123,229,.1)',padding:'12px 16px',display:'flex',flexDirection:'column',gap:4 }}>
          {[{l:'🏠 Home',p:'/'},{l:'📊 Analysis',p:'/analysis'},{l:'🤖 AI Dashboard',p:'/dashboard'}].map(({l,p})=>(
            <Link key={p} to={p} style={{ padding:'10px 14px',borderRadius:10,fontSize:'.87rem',fontWeight:500,textDecoration:'none',color:act(p)?'#2c7be5':'#4a7095',background:act(p)?'rgba(44,123,229,.08)':'transparent' }}>{l}</Link>
          ))}
          {user && <button onClick={logout} style={{ marginTop:4,padding:'10px 14px',borderRadius:10,fontSize:'.87rem',fontWeight:500,background:'rgba(239,68,68,.06)',border:'none',color:'#dc2626',cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:7,fontFamily:'DM Sans,sans-serif' }}><LogOut size={14}/>Sign Out</button>}
        </div>
      )}
    </header>
  )
}
