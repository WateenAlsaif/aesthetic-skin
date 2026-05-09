import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { Activity, Cpu, Shield, Zap, ArrowRight, CheckCircle, Eye, BarChart3, ChevronRight, Star, Thermometer, Droplets } from 'lucide-react'

function Counter({ to, suffix='', dur=2000 }) {
  const [v, setV] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const t0 = Date.now()
        const tick = () => {
          const p = Math.min((Date.now()-t0)/dur, 1)
          setV(Math.round(to*(1-Math.pow(1-p,3))))
          if (p<1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, {threshold:.5})
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to, dur])
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>
}

function FeatureCard({ icon:Icon, title, desc, color, delay }) {
  return (
    <div className="card fade-up" style={{ padding:'24px 20px',animationDelay:`${delay}s`,opacity:0,animationFillMode:'forwards',position:'relative',overflow:'hidden' }}>
      <div style={{ position:'absolute',top:0,right:0,width:90,height:90,background:`radial-gradient(circle,${color}18 0%,transparent 70%)`,borderRadius:'0 16px 0 0' }} />
      <div style={{ width:44,height:44,borderRadius:12,background:`${color}14`,border:`1px solid ${color}28`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14 }}>
        <Icon size={21} color={color}/>
      </div>
      <div className="font-display" style={{ fontSize:'1rem',color:'#0f2744',fontWeight:700,marginBottom:7 }}>{title}</div>
      <div style={{ fontSize:'.81rem',color:'#4a7095',lineHeight:1.7 }}>{desc}</div>
    </div>
  )
}

export default function LandingPage() {
  const nav = useNavigate()
  return (
    <div className="grid-bg">
      {/* ── HERO ──────────────────────────── */}
      <section style={{ padding:'clamp(56px,10vw,100px) 20px 72px',position:'relative',overflow:'hidden',textAlign:'center' }}>
        <div style={{ position:'absolute',top:'5%',right:'5%',width:360,height:360,background:'radial-gradient(circle,rgba(44,123,229,.1) 0%,transparent 70%)',pointerEvents:'none' }}/>
        <div style={{ position:'absolute',bottom:'5%',left:'5%',width:280,height:280,background:'radial-gradient(circle,rgba(14,165,233,.08) 0%,transparent 70%)',pointerEvents:'none' }}/>

        <div style={{ maxWidth:820,margin:'0 auto',position:'relative' }}>
          <div className="fade-up" style={{ display:'inline-flex',alignItems:'center',gap:7,padding:'5px 16px',background:'rgba(44,123,229,.1)',border:'1px solid rgba(44,123,229,.25)',borderRadius:999,fontSize:'.7rem',color:'#2c7be5',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:24,opacity:0,animationFillMode:'forwards' }}>
            <Star size={10} fill="#2c7be5"/> ITEX 2026 · Qassim University
          </div>

          <h1 className="font-display fade-up s1" style={{ fontSize:'clamp(2.2rem,7vw,4.4rem)',fontWeight:800,lineHeight:1.05,letterSpacing:'-0.03em',marginBottom:20,opacity:0,animationFillMode:'forwards' }}>
            <span style={{ color:'#0f2744' }}>AI-Powered</span><br/>
            <span style={{ color:'#2c7be5' }}>Smart Regenerative</span><br/>
            <span style={{ color:'#0f2744' }}>Bandage</span>
          </h1>

          <p className="fade-up s2" style={{ fontSize:'clamp(.9rem,2.5vw,1.1rem)',color:'#4a7095',lineHeight:1.8,maxWidth:600,margin:'0 auto 36px',opacity:0,animationFillMode:'forwards' }}>
            The first integrated system combining AI wound monitoring, bioactive regeneration, real-time infection detection, and drug delivery — in one dissolving smart bandage.
          </p>

          <div className="fade-up s3" style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',opacity:0,animationFillMode:'forwards' }}>
            <button className="btn" onClick={()=>nav('/dashboard')} style={{ display:'flex',alignItems:'center',gap:10,padding:'13px 30px',fontSize:'.93rem',boxShadow:'0 8px 28px rgba(44,123,229,.4)' }}>
              <Cpu size={17}/> Start AI Diagnosis <ArrowRight size={15}/>
            </button>
            <a href="#how" className="btn-outline" style={{ display:'flex',alignItems:'center',gap:7,padding:'13px 24px',fontSize:'.88rem',textDecoration:'none' }}>
              How It Works <ChevronRight size={14}/>
            </a>
          </div>

          {/* Pills */}
          <div className="fade-up s4" style={{ display:'flex',gap:9,justifyContent:'center',flexWrap:'wrap',marginTop:40,opacity:0,animationFillMode:'forwards' }}>
            {[
              {icon:CheckCircle,label:'Non-invasive & Painless',color:'#10b981'},
              {icon:Activity,   label:'Real-time Monitoring',   color:'#2c7be5'},
              {icon:Shield,     label:'Infection Detection',    color:'#7c3aed'},
              {icon:Zap,        label:'30–50% Faster Healing',  color:'#f59e0b'},
            ].map(({icon:Icon,label,color})=>(
              <div key={label} style={{ display:'flex',alignItems:'center',gap:5,padding:'6px 13px',background:`${color}0e`,border:`1px solid ${color}22`,borderRadius:999,fontSize:'.72rem',color,fontWeight:500 }}>
                <Icon size={12}/>{label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────── */}
      <div style={{ background:'white',borderTop:'1px solid rgba(44,123,229,.1)',borderBottom:'1px solid rgba(44,123,229,.1)',padding:'48px 20px',boxShadow:'0 2px 20px rgba(44,123,229,.05)' }}>
        <div style={{ maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:32,textAlign:'center' }}>
          {[{n:11,s:'M+',l:'Burn injuries yearly',c:'#f59e0b'},{n:50,s:'%',l:'Faster healing rate',c:'#2c7be5'},{n:10000,s:'+',l:'$ saved per patient',c:'#7c3aed'},{n:3,s:'',l:'Burn classes detected',c:'#10b981'}].map(({n,s,l,c})=>(
            <div key={l}>
              <div className="font-display" style={{ fontSize:'clamp(1.8rem,5vw,2.8rem)',fontWeight:800,color:c,lineHeight:1,marginBottom:6 }}><Counter to={n} suffix={s}/></div>
              <div style={{ fontSize:'.7rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.1em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────── */}
      <section style={{ padding:'72px 20px',maxWidth:1100,margin:'0 auto' }}>
        <div style={{ textAlign:'center',marginBottom:48 }}>
          <div className="section-label">— Core Capabilities —</div>
          <h2 className="font-display" style={{ fontSize:'clamp(1.6rem,4vw,2.3rem)',fontWeight:800,color:'#0f2744',letterSpacing:'-0.02em' }}>Four Technologies. One Bandage.</h2>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:16 }}>
          <FeatureCard icon={Cpu}       title="AI Wound Analysis"     desc="YOLOv8 classifies burn severity across 3 degrees in real-time with clinical-grade confidence." color="#2c7be5" delay={0}/>
          <FeatureCard icon={Activity}  title="Bioactive Regeneration" desc="Controlled release of antibiotics and growth factors through biodegradable hydrogel." color="#0ea5e9" delay={.05}/>
          <FeatureCard icon={Eye}       title="Infection Detection"    desc="Color-changing sensor turns red when infection is detected — early warning before symptoms." color="#7c3aed" delay={.1}/>
          <FeatureCard icon={BarChart3} title="Sensor Fusion"          desc="Temperature + moisture + color sensors combine with AI image analysis for full assessment." color="#10b981" delay={.15}/>
        </div>
      </section>

      {/* ── SENSOR PREVIEW ─────────────────── */}
      <section style={{ padding:'0 20px 72px',maxWidth:1100,margin:'0 auto' }}>
        <div style={{ textAlign:'center',marginBottom:36 }}>
          <div className="section-label">— Smart Sensors —</div>
          <h2 className="font-display" style={{ fontSize:'clamp(1.5rem,3.5vw,2.1rem)',fontWeight:800,color:'#0f2744',letterSpacing:'-0.02em' }}>Three Sensors. Complete Picture.</h2>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14 }}>
          {[
            {icon:Thermometer,label:'Temperature',value:'36.8°C',sub:'Normal: 36–37°C',color:'#f59e0b',pct:42,desc:'Monitors wound temp. Above 38.5°C triggers infection alert.'},
            {icon:Droplets,   label:'Moisture',   value:'58%',   sub:'Optimal: 40–75%', color:'#2c7be5',pct:58,desc:'Tracks moisture for optimal healing environment.'},
            {icon:Eye,        label:'Color Sensor',value:'Green', sub:'No infection',  color:'#10b981',pct:100,desc:'Detects infection-induced color changes. Green→Yellow→Red.'},
          ].map(({icon:Icon,label,value,sub,color,pct,desc})=>(
            <div key={label} className="card" style={{ padding:'20px 18px' }}>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
                <div style={{ width:38,height:38,borderRadius:10,background:`${color}14`,border:`1px solid ${color}28`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <Icon size={18} color={color}/>
                </div>
                <div>
                  <div style={{ fontSize:'.67rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.07em' }}>{label}</div>
                  <div className="font-mono" style={{ fontSize:'1.2rem',color,fontWeight:500 }}>{value}</div>
                </div>
              </div>
              <div className="track" style={{ marginBottom:7 }}>
                <div className="fill" style={{ width:`${pct}%`,background:`linear-gradient(90deg,${color}80,${color})` }}/>
              </div>
              <div style={{ fontSize:'.66rem',color:'#93b8d4',marginBottom:8 }}>{sub}</div>
              <div style={{ fontSize:'.76rem',color:'#4a7095',lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────── */}
      <section id="how" style={{ padding:'72px 20px',background:'white',borderTop:'1px solid rgba(44,123,229,.1)',borderBottom:'1px solid rgba(44,123,229,.1)' }}>
        <div style={{ maxWidth:1000,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:48 }}>
            <div className="section-label">— The Process —</div>
            <h2 className="font-display" style={{ fontSize:'clamp(1.5rem,4vw,2.3rem)',fontWeight:800,color:'#0f2744',letterSpacing:'-0.02em' }}>How Aesthetic Skin Works</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:36 }}>
            {[
              {n:1,icon:Activity,color:'#f59e0b',title:'Apply Smart Bandage',desc:'The hydrogel bandage adapts to the wound, creating an optimal moist healing environment.'},
              {n:2,icon:Zap,color:'#2c7be5',title:'Bioactive Release',desc:'Nanoparticles deliver antibiotics and growth factors at precisely controlled rates.'},
              {n:3,icon:Cpu,color:'#7c3aed',title:'AI Image Analysis',desc:'Upload a wound photo — YOLOv8 instantly detects burn severity and generates predictions.'},
              {n:4,icon:Eye,color:'#10b981',title:'Infection Sensor',desc:'Color sensor auto-detects infection indicators. Turns green→yellow→red.'},
              {n:5,icon:Thermometer,color:'#0ea5e9',title:'Sensor Fusion',desc:'Temperature and moisture data combine with AI for complete clinical picture.'},
              {n:6,icon:Shield,color:'#ef4444',title:'Clinical Report',desc:'Evidence-based treatment plan, healing timeline, and alert level generated automatically.'},
            ].map(({n,icon:Icon,color,title,desc})=>(
              <div key={n} style={{ display:'flex',gap:14,alignItems:'flex-start' }}>
                <div style={{ width:42,height:42,borderRadius:12,background:`${color}12`,border:`1px solid ${color}25`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <Icon size={18} color={color}/>
                </div>
                <div>
                  <div style={{ fontSize:'.62rem',color,fontFamily:'JetBrains Mono,monospace',marginBottom:3,letterSpacing:'.1em' }}>STEP {String(n).padStart(2,'0')}</div>
                  <div className="font-display" style={{ fontSize:'.93rem',color:'#0f2744',fontWeight:700,marginBottom:4 }}>{title}</div>
                  <div style={{ fontSize:'.78rem',color:'#4a7095',lineHeight:1.65 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────── */}
      <section style={{ padding:'72px 20px',textAlign:'center',background:'linear-gradient(135deg,#e8f2ff 0%,#f0f7ff 50%,#e3f0fc 100%)' }}>
        <div style={{ maxWidth:560,margin:'0 auto' }}>
          <div className="section-label" style={{ justifyContent:'center',display:'flex' }}>Ready to diagnose?</div>
          <h2 className="font-display" style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)',fontWeight:800,color:'#0f2744',letterSpacing:'-0.02em',marginBottom:14,marginTop:8 }}>Start Your First AI<br/>Wound Analysis</h2>
          <p style={{ color:'#4a7095',fontSize:'.87rem',lineHeight:1.75,marginBottom:32 }}>Upload a burn image, configure sensors, and receive a complete AI clinical assessment in seconds.</p>
          <button className="btn" onClick={()=>nav('/dashboard')} style={{ display:'inline-flex',alignItems:'center',gap:10,padding:'14px 36px',fontSize:'.97rem',boxShadow:'0 8px 32px rgba(44,123,229,.4)' }}>
            <Cpu size={19}/> Open AI Dashboard <ArrowRight size={16}/>
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────── */}
      <footer style={{ padding:'24px 20px',background:'white',borderTop:'1px solid rgba(44,123,229,.1)' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12 }}>
          <div style={{ fontSize:'.7rem',color:'#93b8d4' }}>© 2026 Aesthetic Skin · Qassim University · ITEX'26</div>
          <div style={{ fontSize:'.68rem',color:'#93b8d4',fontFamily:'JetBrains Mono,monospace' }}>HEAL SMARTER · RECOVER FASTER · LIVE BETTER</div>
          <div style={{ fontSize:'.7rem',color:'#93b8d4' }}>laian123890@gmail.com</div>
        </div>
      </footer>
    </div>
  )
}
