import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Thermometer, Droplets, Eye, ShieldAlert,
  ChevronRight, AlertTriangle, Cpu, ArrowLeft, User, Clock
} from 'lucide-react'

// Burn wound clinical image — stored locally in /public
const BURN_IMAGE = '/wound-demo.png'

// Static clinical analysis data
const ANALYSIS = {
  patient: null, // loaded from localStorage
  burn_type: 'Second Degree Burn',
  burn_class: 'Moderate — Partial Thickness',
  surface_area: '12 cm²',
  depth: '1.8 mm',
  discharge: 'Serous / Early Purulent',
  temperature: 38.4,
  moisture: 38,
  color_status: 'yellow',
  inflammation: 74,
  tissue_damage: 52,
  healing_rate: 31,
  oxygen_level: 44,
  infection_risk: 'MEDIUM',
  healing_status: 'Early Stage',
  estimated_healing: '14–21 days',
  alert_level: 'MEDIUM',
  alert_message: 'Close monitoring required — early infection signs detected',
  decisions: [
    {
      title: 'Antibiotic Treatment',
      detail: 'Mupirocin 2% ointment — applied topically every 12h via smart bandage',
      color: '#ef4444',
      icon: ShieldAlert,
    },
    {
      title: 'Growth Factors Activated',
      detail: 'PDGF released at 0.3μg/hr — accelerates tissue regeneration',
      color: '#10b981',
      icon: Activity,
    },
    {
      title: 'Moisture Control',
      detail: 'Hydrogel layer maintaining optimal wound moisture environment',
      color: '#2c7be5',
      icon: Droplets,
    },
    {
      title: 'Warning: Monitor Closely',
      detail: 'Temperature elevation detected — increase sensor check frequency',
      color: '#f59e0b',
      icon: AlertTriangle,
    },
  ],
  recommendations: [
    'Change dressing every 24–48 hours',
    'Apply topical antiseptic before redressing',
    'Monitor wound temperature every 6 hours',
    'Keep wound moist and covered at all times',
    'Follow up with burn specialist in 3 days',
  ],
}

function ProgressBar({ label, pct, color }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { setTimeout(() => setWidth(pct), 300) }, [pct])
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6 }}>
        <span style={{ fontSize:'.82rem',color:'#0f2744',fontWeight:500 }}>{label}</span>
        <span className="font-mono" style={{ fontSize:'.8rem',color,fontWeight:600 }}>{pct}%</span>
      </div>
      <div className="track">
        <div className="fill" style={{ width:`${width}%`,background:`linear-gradient(90deg,${color}70,${color})` }}/>
      </div>
    </div>
  )
}

function SensorChip({ icon:Icon, label, value, unit, color }) {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'#f0f7ff',border:'1px solid rgba(44,123,229,.12)',borderRadius:10,marginBottom:8 }}>
      <div style={{ display:'flex',alignItems:'center',gap:8 }}>
        <Icon size={15} color={color}/>
        <span style={{ fontSize:'.78rem',color:'#4a7095' }}>{label}</span>
      </div>
      <span className="font-mono" style={{ fontSize:'.9rem',color,fontWeight:600 }}>{value}{unit}</span>
    </div>
  )
}

export default function StaticAnalysis() {
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem('as_user'))) } catch {}
  }, [])

  const colorMap = { green:'#10b981', yellow:'#f59e0b', red:'#ef4444' }
  const dotColor = colorMap[ANALYSIS.color_status]

  return (
    <div style={{ maxWidth:1200,margin:'0 auto',padding:'20px 16px' }}>

      {/* Top bar */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10 }}>
        <button onClick={()=>nav('/')} className="btn-out" style={{ display:'flex',alignItems:'center',gap:7,padding:'8px 16px',fontSize:'.8rem' }}>
          <ArrowLeft size={14}/> Home
        </button>
        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          <span className="badge b-amber">⚠ MEDIUM ALERT</span>
          <span className="badge b-blue">AI Analysis</span>
          <button onClick={()=>nav('/dashboard')} className="btn" style={{ padding:'8px 16px',fontSize:'.78rem',display:'flex',alignItems:'center',gap:6 }}>
            <Cpu size={13}/> Try Real AI
          </button>
        </div>
      </div>

      {/* Patient card */}
      {user && (
        <div className="card" style={{ padding:'14px 18px',marginBottom:16,background:'linear-gradient(135deg,#e8f2ff,#f0f7ff)',border:'1px solid rgba(44,123,229,.2)' }}>
          <div style={{ display:'flex',alignItems:'center',gap:12,flexWrap:'wrap' }}>
            <div style={{ width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,#2c7be5,#0ea5e9)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <User size={19} color="white"/>
            </div>
            <div>
              <div style={{ fontWeight:700,color:'#0f2744',fontSize:'1rem' }}>{user.name}</div>
              <div style={{ fontSize:'.74rem',color:'#4a7095' }}>
                Age {user.age} · {user.gender}
              </div>
            </div>
            <div style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:6,fontSize:'.72rem',color:'#4a7095' }}>
              <Clock size={12}/>
              {new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16,alignItems:'start' }}>

        {/* LEFT — Image + sensors */}
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>

          {/* Wound image */}
          <div className="card" style={{ overflow:'hidden' }}>
            <div style={{ background:'linear-gradient(135deg,#0f2744,#1a3a5a)',padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
              <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                <span className="dot" style={{ width:8,height:8,borderRadius:'50%',background:'#10b981',display:'inline-block' }}/>
                <span style={{ fontSize:'.75rem',color:'#e2f0ff',fontWeight:600,letterSpacing:'.05em' }}>AI SCANNING</span>
              </div>
              <span style={{ fontSize:'.68rem',color:'#4a7095',fontFamily:'JetBrains Mono,monospace' }}>ACTIVE</span>
            </div>
            <div style={{ position:'relative',background:'#0a1628',minHeight:220 }}>
              <img
                src={BURN_IMAGE}
                alt="Second degree burn wound - clinical analysis"
                onLoad={()=>setImgLoaded(true)}
                style={{ width:'100%',maxHeight:280,objectFit:'cover',display:'block',opacity:imgLoaded?1:0,transition:'opacity .4s' }}
              />
              {!imgLoaded && (
                <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <div style={{ width:32,height:32,border:'3px solid rgba(44,123,229,.3)',borderTop:'3px solid #2c7be5',borderRadius:'50%' }} className="sp"/>
                </div>
              )}
              {imgLoaded && (
                <div style={{ position:'absolute',bottom:10,left:10,right:10,background:'rgba(15,39,68,.75)',backdropFilter:'blur(8px)',borderRadius:10,padding:'8px 12px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <span style={{ fontSize:'.7rem',color:'#b8d8f8',fontFamily:'JetBrains Mono,monospace' }}>2nd Degree Burn — Left Forearm</span>
                  <span className="badge b-amber">Moderate</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick vitals */}
          <div className="card" style={{ padding:'16px 18px' }}>
            <div className="slabel">Wound Measurements</div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14 }}>
              {[
                {label:'Depth',    value:ANALYSIS.depth,        unit:'',     color:'#ef4444'},
                {label:'Surface',  value:ANALYSIS.surface_area, unit:'',     color:'#f59e0b'},
                {label:'Discharge',value:'Serous',               unit:'',     color:'#2c7be5'},
              ].map(({label,value,color})=>(
                <div key={label} style={{ textAlign:'center',background:'#f0f7ff',borderRadius:12,padding:'12px 8px',border:'1px solid rgba(44,123,229,.1)' }}>
                  <div style={{ fontSize:'.62rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:5 }}>{label}</div>
                  <div className="font-mono" style={{ fontSize:'.9rem',color,fontWeight:600 }}>{value}</div>
                </div>
              ))}
            </div>
            <div className="slabel">Sensor Readings</div>
            <SensorChip icon={Thermometer} label="Temperature" value={ANALYSIS.temperature} unit="°C" color="#f59e0b"/>
            <SensorChip icon={Droplets}    label="Moisture"    value={ANALYSIS.moisture}    unit="%" color="#2c7be5"/>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:`${dotColor}0f`,border:`1px solid ${dotColor}25`,borderRadius:10 }}>
              <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                <Eye size={15} color={dotColor}/>
                <span style={{ fontSize:'.78rem',color:'#4a7095' }}>Color Sensor</span>
              </div>
              <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                <span className="dot" style={{ width:8,height:8,borderRadius:'50%',background:dotColor,boxShadow:`0 0 6px ${dotColor}`,display:'inline-block' }}/>
                <span className="font-mono" style={{ fontSize:'.82rem',color:dotColor,fontWeight:600 }}>YELLOW — Early Warning</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER — Assessment bars */}
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>

          {/* Alert banner */}
          <div className="ga" style={{ padding:'14px 18px',background:'rgba(245,158,11,.07)',border:'1px solid rgba(245,158,11,.3)',borderRadius:14,display:'flex',alignItems:'center',gap:12 }}>
            <AlertTriangle size={22} color="#f59e0b"/>
            <div>
              <div style={{ fontSize:'.63rem',color:'#b45309',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:700,marginBottom:2 }}>Alert Level — MEDIUM</div>
              <div style={{ fontSize:'.85rem',color:'#0f2744' }}>{ANALYSIS.alert_message}</div>
            </div>
          </div>

          {/* AI Assessment bars */}
          <div className="card" style={{ padding:'18px 20px' }}>
            <div className="slabel">AI Wound Assessment</div>
            <ProgressBar label="Inflammation Level"        pct={ANALYSIS.inflammation}   color="#ef4444"/>
            <ProgressBar label="Tissue Damage (Necrosis)" pct={ANALYSIS.tissue_damage}  color="#f59e0b"/>
            <ProgressBar label="Healing Rate"              pct={ANALYSIS.healing_rate}   color="#10b981"/>
            <ProgressBar label="Oxygen Around Wound"       pct={ANALYSIS.oxygen_level}   color="#2c7be5"/>
          </div>

          {/* Key metrics */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            {[
              {label:'Burn Type',       value:'2nd Degree',         color:'#f59e0b'},
              {label:'Infection Risk',  value:ANALYSIS.infection_risk, color:'#f59e0b'},
              {label:'Healing Status',  value:ANALYSIS.healing_status, color:'#2c7be5'},
              {label:'Est. Recovery',   value:ANALYSIS.estimated_healing, color:'#10b981'},
            ].map(({label,value,color})=>(
              <div key={label} style={{ background:'white',border:'1px solid rgba(44,123,229,.12)',borderRadius:14,padding:'14px 16px',boxShadow:'0 2px 8px rgba(44,123,229,.06)' }}>
                <div style={{ fontSize:'.62rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6 }}>{label}</div>
                <div className="font-mono" style={{ fontSize:'1rem',color,fontWeight:600,lineHeight:1.2 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — AI Decisions + Recommendations */}
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>

          {/* AI Decisions */}
          <div className="card" style={{ padding:'18px 20px' }}>
            <div className="slabel">AI Decision</div>
            {ANALYSIS.decisions.map(({title,detail,color,icon:Icon},i)=>(
              <div key={i} style={{ display:'flex',gap:12,alignItems:'flex-start',padding:'12px 0',borderBottom:i<ANALYSIS.decisions.length-1?'1px solid rgba(44,123,229,.08)':'none' }}>
                <div style={{ width:36,height:36,borderRadius:10,background:`${color}12`,border:`1px solid ${color}25`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <Icon size={16} color={color}/>
                </div>
                <div>
                  <div style={{ fontSize:'.82rem',fontWeight:700,color:'#0f2744',marginBottom:3 }}>{title}</div>
                  <div style={{ fontSize:'.75rem',color:'#4a7095',lineHeight:1.55 }}>{detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="card" style={{ padding:'18px 20px' }}>
            <div className="slabel">Clinical Recommendations</div>
            {ANALYSIS.recommendations.map((r,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:9,padding:'8px 0',borderBottom:i<ANALYSIS.recommendations.length-1?'1px solid rgba(44,123,229,.07)':'none' }}>
                <ChevronRight size={13} color="#2c7be5" style={{ marginTop:3,flexShrink:0 }}/>
                <span style={{ fontSize:'.8rem',color:'#4a7095',lineHeight:1.6 }}>{r}</span>
              </div>
            ))}
          </div>

          {/* Try real AI CTA */}
          <div style={{ padding:'16px 18px',background:'linear-gradient(135deg,#e8f2ff,#f0f7ff)',border:'1px solid rgba(44,123,229,.2)',borderRadius:14,textAlign:'center' }}>
            <div style={{ fontSize:'.75rem',color:'#4a7095',marginBottom:8,lineHeight:1.5 }}>
              This is a <strong style={{ color:'#0f2744' }}>demo analysis</strong>.<br/>
              Upload your own wound image for real AI prediction.
            </div>
            <button className="btn" onClick={()=>nav('/dashboard')} style={{ display:'inline-flex',alignItems:'center',gap:7,padding:'10px 22px',fontSize:'.82rem' }}>
              <Cpu size={14}/> Try Real AI Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
