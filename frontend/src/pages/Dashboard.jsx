import { useState } from 'react'
import axios from 'axios'
import {
  Cpu, Loader2, Zap, FlaskConical, Activity, Thermometer, Droplets,
  Eye, ShieldAlert, Clock, ChevronRight, CheckCircle, AlertTriangle,
  XCircle, BarChart3, TrendingUp, Upload, RefreshCw, User, Calendar,
  ImagePlus, X, Info, Wifi
} from 'lucide-react'

const API = 'https://aesthetic-skin-api.onrender.com'

/* ─── FAKE PATIENT DATA ────────────────────────────── */
const FAKE_PATIENT = {
  name: 'Ahmad Al-Mansouri',
  age: 34,
  id: 'PT-2026-0042',
  date: 'May 9, 2026',
  ward: 'Burn Unit — Room 3B',
}

const FAKE_RESULT = {
  burn_severity: 'Moderate',
  burn_class: 1,
  image_confidence: 0.82,
  burn_description: '2nd degree — partial thickness burn with blistering',
  infection_risk: 'MEDIUM',
  healing_status: 'Progressing',
  alert_level: 'MEDIUM',
  alert_message: '🟡 MEDIUM — Close monitoring required',
  recommendations: [
    'Dressing change every 24–48 hours',
    'Apply topical antiseptic to wound surface',
    'Monitor temperature and moisture daily',
    'Outpatient follow-up in 3 days',
    'Ensure adequate hydration and nutrition',
  ],
  estimated_healing_time: '10–21 days',
  temperature: 37.8,
  moisture: 42,
  color_status: 'yellow',
  analysis_model: 'DEMO — YOLOv8 (awaiting model)',
  total_detections: 0,
}

/* ─── ALERT CONFIG ────────────────────────────────── */
const AL = {
  CRITICAL:{ color:'#dc2626',bg:'rgba(239,68,68,.08)',  border:'rgba(239,68,68,.3)',  icon:XCircle,       cls:'glow-red' },
  HIGH:    { color:'#ef4444',bg:'rgba(239,68,68,.07)',  border:'rgba(239,68,68,.25)', icon:AlertTriangle, cls:'glow-red' },
  MEDIUM:  { color:'#b45309',bg:'rgba(245,158,11,.07)', border:'rgba(245,158,11,.28)',icon:AlertTriangle, cls:'glow-amb' },
  LOW:     { color:'#059669',bg:'rgba(16,185,129,.07)', border:'rgba(16,185,129,.25)',icon:CheckCircle,   cls:'' },
}
const BURN_C = { Mild:'#10b981', Moderate:'#f59e0b', Severe:'#ef4444' }
const RISK_C = { LOW:'#10b981', MEDIUM:'#f59e0b', HIGH:'#ef4444' }

/* ─── SUBCOMPONENTS ───────────────────────────────── */
function MetricCard({ icon:Icon, label, value, sub, color }) {
  return (
    <div className="vital">
      <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:9 }}>
        <Icon size={12} color={color}/>
        <span style={{ fontSize:'.62rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.07em' }}>{label}</span>
      </div>
      <div className="font-mono" style={{ fontSize:'1.5rem',fontWeight:500,color,lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:'.64rem',color:'#93b8d4',marginTop:5,lineHeight:1.4 }}>{sub}</div>}
    </div>
  )
}

function ProgressRow({ label, pct, color }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
        <span style={{ fontSize:'.78rem',color:'#0f2744',fontWeight:500 }}>{label}</span>
        <span className="font-mono" style={{ fontSize:'.75rem',color }}>{pct}%</span>
      </div>
      <div className="track">
        <div className="fill" style={{ width:`${pct}%`,background:`linear-gradient(90deg,${color}80,${color})` }}/>
      </div>
    </div>
  )
}

function SensorRow({ icon:Icon, label, value, unit, color }) {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 12px',background:'#f0f7ff',border:'1px solid rgba(44,123,229,.1)',borderRadius:10,marginBottom:7 }}>
      <div style={{ display:'flex',alignItems:'center',gap:7 }}>
        <Icon size={14} color={color}/>
        <span style={{ fontSize:'.76rem',color:'#4a7095' }}>{label}</span>
      </div>
      <span className="font-mono" style={{ fontSize:'.88rem',color,fontWeight:500 }}>{value}{unit}</span>
    </div>
  )
}

/* ─── IMAGE UPLOADER ──────────────────────────────── */
function ImgUploader({ onSelect, image, preview }) {
  const [drag, setDrag] = useState(false)
  const ref = { current: null }
  const inputRef = { current: null }

  function handle(file) { if (file?.type.startsWith('image/')) onSelect(file) }

  return (
    <div>
      <div
        className={`drop-zone ${drag?'drag-over':''}`}
        style={{ padding: preview?'10px':'32px 16px', minHeight:160, display:'flex', alignItems:'center', justifyContent:'center' }}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handle(e.dataTransfer.files[0])}}
        onClick={()=>!preview&&inputRef.current?.click()}
      >
        {preview ? (
          <div style={{ width:'100%',position:'relative' }}>
            <img src={preview} alt="wound" style={{ width:'100%',maxHeight:200,objectFit:'cover',borderRadius:10,display:'block' }}/>
            <div style={{ position:'absolute',top:7,right:7,display:'flex',gap:5 }}>
              <button onClick={e=>{e.stopPropagation();inputRef.current?.click()}} style={{ background:'rgba(255,255,255,.9)',border:'1px solid rgba(44,123,229,.3)',borderRadius:7,padding:'4px 8px',cursor:'pointer',color:'#2c7be5',display:'flex',alignItems:'center',gap:3,fontSize:'.67rem',fontWeight:500 }}>
                <RefreshCw size={10}/> Change
              </button>
              <button onClick={e=>{e.stopPropagation();onSelect(null)}} style={{ background:'rgba(255,255,255,.9)',border:'1px solid rgba(239,68,68,.3)',borderRadius:7,padding:'4px 7px',cursor:'pointer',color:'#dc2626',display:'flex',alignItems:'center' }}>
                <X size={11}/>
              </button>
            </div>
            <div style={{ marginTop:7,padding:'6px 10px',background:'rgba(44,123,229,.06)',border:'1px solid rgba(44,123,229,.12)',borderRadius:8,display:'flex',justifyContent:'space-between' }}>
              <span className="font-mono" style={{ fontSize:'.65rem',color:'#4a7095',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'70%' }}>{image?.name}</span>
              <span className="font-mono" style={{ fontSize:'.63rem',color:'#2c7be5',flexShrink:0 }}>
                {image?.size ? (image.size<1024*1024 ? `${(image.size/1024).toFixed(0)}KB` : `${(image.size/(1024*1024)).toFixed(1)}MB`) : ''}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign:'center' }}>
            <div style={{ width:52,height:52,background:'rgba(44,123,229,.1)',borderRadius:14,margin:'0 auto 14px',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(44,123,229,.2)' }}>
              <ImagePlus size={23} color="#2c7be5"/>
            </div>
            <div style={{ fontSize:'.88rem',color:'#0f2744',fontWeight:500,marginBottom:5 }}>Drop wound image here</div>
            <div style={{ fontSize:'.74rem',color:'#4a7095',marginBottom:14 }}>or click · JPG, PNG, WEBP</div>
            <button onClick={e=>{e.stopPropagation();inputRef.current?.click()}} className="btn-outline" style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'7px 18px',fontSize:'.78rem' }}>
              <Upload size={12}/> Browse
            </button>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>handle(e.target.files[0])}/>
    </div>
  )
}

/* ─── SENSOR PANEL ────────────────────────────────── */
function SensorPanel({ sensors, setSensors, loading }) {
  const [sim, setSim] = useState(null)

  async function simulate(s) {
    setSim(s)
    try {
      const r = await axios.get(`${API}/sensor/simulate?scenario=${s}`)
      const d = r.data.data
      setSensors({ temperature:d.temperature, moisture:d.moisture, color_status:d.color_status })
    } catch(e){console.error(e)} finally{setSim(null)}
  }

  const cmap = {
    green:  {bg:'rgba(16,185,129,.08)', color:'#059669', label:'No Infection',    border:'rgba(16,185,129,.22)'},
    yellow: {bg:'rgba(245,158,11,.08)', color:'#b45309', label:'Early Warning',   border:'rgba(245,158,11,.25)'},
    red:    {bg:'rgba(239,68,68,.08)',  color:'#dc2626', label:'Infection Alert!', border:'rgba(239,68,68,.25)'},
  }
  const cc = cmap[sensors.color_status]||cmap.green

  function Slid({icon:Icon, label, value, min, max, step, unit, color, warn, onChange}) {
    const pct = Math.min(100,((value-min)/(max-min))*100)
    const bad = warn(value)
    return (
      <div className="card" style={{ padding:'15px 16px',marginBottom:10 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:9 }}>
          <div style={{ display:'flex',alignItems:'center',gap:7 }}>
            <Icon size={14} color={bad?'#f59e0b':color}/>
            <span style={{ fontSize:'.76rem',color:'#4a7095',fontWeight:500 }}>{label}</span>
          </div>
          <div style={{ display:'flex',alignItems:'baseline',gap:2 }}>
            <span className="font-mono" style={{ fontSize:'1.3rem',color:bad?'#f59e0b':color,fontWeight:500 }}>{value}</span>
            <span style={{ fontSize:'.68rem',color:'#93b8d4' }}>{unit}</span>
          </div>
        </div>
        <div style={{ position:'relative',marginBottom:5 }}>
          <div className="track" style={{ height:7 }}>
            <div className="fill" style={{ width:`${pct}%`,background:bad?'linear-gradient(90deg,#f59e0b,#ef4444)':`linear-gradient(90deg,${color}70,${color})` }}/>
          </div>
          <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(parseFloat(e.target.value))} style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:0,cursor:'pointer' }}/>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:'.6rem',color:'#93b8d4',fontFamily:'monospace',marginBottom:8 }}>
          <span>{min}{unit}</span>{bad&&<span style={{color:'#f59e0b'}}>⚠ Abnormal</span>}<span>{max}{unit}</span>
        </div>
        <input type="number" min={min} max={max} step={step} value={value} className="inp inp-mono" style={{ fontSize:'.8rem',padding:'8px 10px' }} onChange={e=>onChange(parseFloat(e.target.value)||min)}/>
      </div>
    )
  }

  return (
    <div>
      <Slid icon={Thermometer} label="Temperature" value={sensors.temperature} min={34} max={42} step={0.1} unit="°C" color="#f59e0b" warn={v=>v>38.5} onChange={v=>setSensors(s=>({...s,temperature:v}))}/>
      <Slid icon={Droplets} label="Moisture" value={sensors.moisture} min={0} max={100} step={1} unit="%" color="#2c7be5" warn={v=>v<20} onChange={v=>setSensors(s=>({...s,moisture:v}))}/>
      <div className="card" style={{ padding:'15px 16px',marginBottom:12,background:cc.bg,border:`1px solid ${cc.border}` }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:11 }}>
          <div style={{ display:'flex',alignItems:'center',gap:7 }}><Eye size={14} color={cc.color}/><span style={{ fontSize:'.76rem',color:'#4a7095',fontWeight:500 }}>Color Sensor</span></div>
          <div style={{ display:'flex',alignItems:'center',gap:7 }}>
            <span className="dot-on" style={{ width:8,height:8,borderRadius:'50%',background:cc.color,boxShadow:`0 0 6px ${cc.color}`,display:'inline-block' }}/>
            <span style={{ fontSize:'.74rem',color:cc.color,fontWeight:600 }}>{cc.label}</span>
          </div>
        </div>
        <div style={{ display:'flex',gap:7 }}>
          {['green','yellow','red'].map(c=>(
            <button key={c} onClick={()=>setSensors(s=>({...s,color_status:c}))} style={{ flex:1,padding:'7px 0',borderRadius:9,border:`1px solid ${sensors.color_status===c?cmap[c].color:'rgba(44,123,229,.15)'}`,background:sensors.color_status===c?cmap[c].bg:'transparent',color:sensors.color_status===c?cmap[c].color:'#4a7095',cursor:'pointer',fontSize:'.71rem',fontWeight:sensors.color_status===c?700:400,textTransform:'capitalize',transition:'all .2s' }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ fontSize:'.63rem',color:'#93b8d4',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:6 }}>Simulate Scenario</div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:7 }}>
        {[['normal','#10b981'],['warning','#f59e0b'],['critical','#ef4444'],['random','#2c7be5']].map(([s,c])=>(
          <button key={s} onClick={()=>simulate(s)} disabled={!!sim||loading} style={{ padding:'8px',borderRadius:9,border:`1px solid ${c}22`,background:`${c}08`,color:sim===s?c:'#4a7095',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5,fontSize:'.71rem',fontWeight:500,transition:'all .2s' }}>
            {sim===s?<><RefreshCw size={10} className="spin"/>Loading...</>:<><Wifi size={10} style={{color:c}}/>{s}</>}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── RESULTS ─────────────────────────────────────── */
function Results({ result, isDemo }) {
  if (!result) return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:300,gap:12,padding:'28px 16px',textAlign:'center' }}>
      <div style={{ width:64,height:64,borderRadius:'50%',background:'rgba(44,123,229,.07)',border:'1px solid rgba(44,123,229,.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <Activity size={26} color="#93b8d4"/>
      </div>
      <div style={{ color:'#4a7095',fontSize:'.83rem',lineHeight:1.7 }}>
        Upload a wound image and click<br/><strong style={{ color:'#0f2744' }}>Run AI Analysis</strong>
      </div>
    </div>
  )

  const al = AL[result.alert_level]||AL.LOW
  const AIcon = al.icon
  const bc = BURN_C[result.burn_severity]||'#0f2744'
  const rc = RISK_C[result.infection_risk]||'#0f2744'
  const conf = Math.round((result.image_confidence||0)*100)
  const cmap2 = {green:'#10b981',yellow:'#f59e0b',red:'#ef4444'}

  return (
    <div className="fade-in" style={{ display:'flex',flexDirection:'column',gap:12 }}>
      {isDemo && (
        <div style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 13px',background:'rgba(44,123,229,.07)',border:'1px solid rgba(44,123,229,.2)',borderRadius:10 }}>
          <Info size={13} color="#2c7be5"/>
          <span style={{ fontSize:'.72rem',color:'#2c7be5',lineHeight:1.4 }}>Demo mode — showing sample data. Upload an image and connect the AI model for real results.</span>
        </div>
      )}

      {/* Alert */}
      <div className={al.cls} style={{ padding:'14px 17px',display:'flex',alignItems:'center',gap:12 }} style2={{ ...al }}>
        <div style={{ padding:'14px 17px',display:'flex',alignItems:'center',gap:12,background:al.bg,border:`1px solid ${al.border}`,borderRadius:14 }}>
          <AIcon size={21} color={al.color}/>
          <div>
            <div style={{ fontSize:'.62rem',color:al.color,textTransform:'uppercase',letterSpacing:'.12em',fontWeight:700,marginBottom:2 }}>Alert — {result.alert_level}</div>
            <div style={{ fontSize:'.84rem',color:'#0f2744',lineHeight:1.4 }}>{result.alert_message}</div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9 }}>
        <MetricCard icon={ShieldAlert} label="Burn Severity" value={result.burn_severity} sub={result.burn_description} color={bc}/>
        <MetricCard icon={AlertTriangle} label="Infection Risk" value={result.infection_risk} sub="Sensor score" color={rc}/>
        <MetricCard icon={Cpu} label="AI Confidence" value={`${conf}%`} sub="Image model" color="#2c7be5"/>
      </div>

      {/* AI analysis bars (like reference site) */}
      <div className="card" style={{ padding:'16px 18px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:14 }}>
          <BarChart3 size={14} color="#2c7be5"/>
          <span style={{ fontSize:'.75rem',color:'#0f2744',fontWeight:600 }}>AI Wound Assessment</span>
        </div>
        <ProgressRow label="Inflammation Level" pct={result.infection_risk==='HIGH'?87:result.infection_risk==='MEDIUM'?52:18} color="#ef4444"/>
        <ProgressRow label="Tissue Damage (Severity)" pct={result.burn_severity==='Severe'?80:result.burn_severity==='Moderate'?50:22} color="#f59e0b"/>
        <ProgressRow label="Healing Rate" pct={conf} color="#10b981"/>
        <ProgressRow label="Detection Confidence" pct={conf} color="#2c7be5"/>
      </div>

      {/* Healing */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:9 }}>
        <div className="vital" style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:32,height:32,borderRadius:9,background:'rgba(44,123,229,.1)',display:'flex',alignItems:'center',justifyContent:'center' }}><Activity size={14} color="#2c7be5"/></div>
          <div><div style={{ fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2 }}>Healing Status</div><div style={{ fontWeight:600,color:'#0f2744',fontSize:'.84rem' }}>{result.healing_status}</div></div>
        </div>
        <div className="vital" style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:32,height:32,borderRadius:9,background:'rgba(124,58,237,.1)',display:'flex',alignItems:'center',justifyContent:'center' }}><Clock size={14} color="#7c3aed"/></div>
          <div><div style={{ fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2 }}>Est. Healing</div><div style={{ fontWeight:600,color:'#0f2744',fontSize:'.78rem' }}>{result.estimated_healing_time}</div></div>
        </div>
      </div>

      {/* Sensors */}
      {result.temperature !== undefined && (
        <div className="card" style={{ padding:'14px 16px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:5,marginBottom:10 }}>
            <TrendingUp size={12} color="#4a7095"/>
            <span style={{ fontSize:'.65rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.08em' }}>Sensor Readings</span>
          </div>
          <SensorRow icon={Thermometer} label="Temperature" value={result.temperature} unit="°C" color={result.temperature>38.5?'#ef4444':result.temperature>37.5?'#f59e0b':'#10b981'}/>
          <SensorRow icon={Droplets} label="Moisture" value={result.moisture} unit="%" color={result.moisture<20?'#ef4444':result.moisture>80?'#f59e0b':'#2c7be5'}/>
          <SensorRow icon={Eye} label="Color Sensor" value={(result.color_status||'green').toUpperCase()} unit="" color={cmap2[result.color_status]||'#10b981'}/>
        </div>
      )}

      {/* Recommendations */}
      <div className="card" style={{ padding:'16px 18px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:12 }}>
          <ShieldAlert size={14} color="#f59e0b"/>
          <span style={{ fontSize:'.73rem',color:'#0f2744',fontWeight:600,textTransform:'uppercase',letterSpacing:'.07em' }}>Clinical Recommendations</span>
        </div>
        {(result.recommendations||[]).map((r,i)=>(
          <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:9,padding:'8px 0',borderBottom:i<result.recommendations.length-1?'1px solid rgba(44,123,229,.07)':'none' }}>
            <ChevronRight size={12} color="#2c7be5" style={{ marginTop:3,flexShrink:0 }}/>
            <span style={{ fontSize:'.79rem',color:'#4a7095',lineHeight:1.6 }}>{r}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize:'.6rem',color:'#93b8d4',textAlign:'center',fontFamily:'JetBrains Mono,monospace' }}>
        {result.analysis_model} · Detections: {result.total_detections}
      </div>
    </div>
  )
}

/* ─── MAIN DASHBOARD ──────────────────────────────── */
export default function Dashboard() {
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [sensors, setSensors] = useState({ temperature:37.8, moisture:42, color_status:'yellow' })
  const [result, setResult]   = useState(FAKE_RESULT)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [mode, setMode]       = useState('full')
  const [time, setTime]       = useState(null)
  const [isDemo, setIsDemo]   = useState(true)

  function handleImg(file) {
    if (!file) { setImage(null); setPreview(null); return }
    setImage(file); setPreview(URL.createObjectURL(file))
    setResult(null); setError(null); setIsDemo(false)
  }

  async function run() {
    if (!image) { setError('Upload a burn image first.'); return }
    setError(null); setLoading(true); setResult(null); setIsDemo(false)
    const t0 = Date.now()
    try {
      const fd = new FormData()
      fd.append('file', image)
      let res
      if (mode==='full') {
        fd.append('temperature', sensors.temperature)
        fd.append('moisture', sensors.moisture)
        fd.append('color_status', sensors.color_status)
        res = await axios.post(`${API}/predict/full`, fd)
      } else {
        res = await axios.post(`${API}/predict/image`, fd)
      }
      setResult(res.data.data)
      setTime(((Date.now()-t0)/1000).toFixed(2))
    } catch(e) {
      const msg = e.response?.data?.detail||e.message||'Analysis failed'
      if (msg.includes('best.pt')||msg.includes('model not found')) {
        // Fall back to fake result with image confidence 0
        setResult({ ...FAKE_RESULT, image_confidence:0, analysis_model:'No model loaded — place best.pt in backend/model/', total_detections:0 })
        setIsDemo(true)
      } else {
        setError(msg)
      }
    } finally { setLoading(false) }
  }

  const tc = sensors.temperature>38.5?'#ef4444':sensors.temperature>37.5?'#f59e0b':'#10b981'
  const mc = sensors.moisture<20?'#ef4444':sensors.moisture>80?'#f59e0b':'#2c7be5'
  const dc = {green:'#10b981',yellow:'#f59e0b',red:'#ef4444'}[sensors.color_status]||'#10b981'

  return (
    <div style={{ maxWidth:1280,margin:'0 auto',padding:'18px 14px' }}>

      {/* Title */}
      <div style={{ textAlign:'center',marginBottom:16 }}>
        <h1 className="font-display" style={{ fontSize:'clamp(1.35rem,4vw,2rem)',color:'#0f2744',fontWeight:800,letterSpacing:'-0.02em',marginBottom:4 }}>
          AI Wound Analysis <span style={{ color:'#2c7be5' }}>Dashboard</span>
        </h1>
        <p style={{ color:'#4a7095',fontSize:'.8rem' }}>Upload image · Configure sensors · Get AI clinical assessment</p>
      </div>

      {/* Patient card */}
      <div className="card" style={{ padding:'14px 16px',marginBottom:14,background:'linear-gradient(135deg,#e8f2ff,#f0f7ff)',border:'1px solid rgba(44,123,229,.18)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:12,flexWrap:'wrap' }}>
          <div style={{ width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#2c7be5,#0ea5e9)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <User size={18} color="white"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700,color:'#0f2744',fontSize:'.95rem' }}>{FAKE_PATIENT.name}</div>
            <div style={{ fontSize:'.72rem',color:'#4a7095' }}>Age {FAKE_PATIENT.age} · ID: {FAKE_PATIENT.id} · {FAKE_PATIENT.ward}</div>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:5,fontSize:'.7rem',color:'#4a7095' }}>
            <Calendar size={12}/>{FAKE_PATIENT.date}
          </div>
          <span className="badge badge-blue">Active Case</span>
        </div>
      </div>

      {/* Live sensor strip */}
      <div style={{ display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',padding:'10px 14px',background:'white',borderRadius:11,border:'1px solid rgba(44,123,229,.12)',marginBottom:14,boxShadow:'0 2px 8px rgba(44,123,229,.06)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:6 }}>
          <span className="dot-on" style={{ width:6,height:6,borderRadius:'50%',background:'#10b981',display:'inline-block' }}/>
          <span style={{ fontSize:'.68rem',color:'#4a7095',fontWeight:500 }}>Live Sensors</span>
        </div>
        <div style={{ display:'flex',gap:16,marginLeft:'auto',flexWrap:'wrap' }}>
          <span className="font-mono" style={{ fontSize:'.75rem',color:tc }}>🌡 {sensors.temperature}°C</span>
          <span className="font-mono" style={{ fontSize:'.75rem',color:mc }}>💧 {sensors.moisture}%</span>
          <span className="font-mono" style={{ fontSize:'.75rem',color:dc }}>● {sensors.color_status.toUpperCase()}</span>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display:'flex',justifyContent:'center',marginBottom:16 }}>
        <div style={{ background:'white',border:'1px solid rgba(44,123,229,.15)',borderRadius:11,padding:3,display:'flex',gap:3,boxShadow:'0 2px 8px rgba(44,123,229,.06)' }}>
          {[{id:'full',label:'Hybrid AI (Image + Sensors)',icon:Zap},{id:'image',label:'Image Only',icon:FlaskConical}].map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>setMode(id)} style={{ padding:'7px 13px',borderRadius:9,border:'none',background:mode===id?'rgba(44,123,229,.12)':'transparent',color:mode===id?'#1d4ed8':'#4a7095',fontSize:'.74rem',cursor:'pointer',fontWeight:mode===id?600:400,display:'flex',alignItems:'center',gap:5,transition:'all .2s',whiteSpace:'nowrap' }}>
              <Icon size={13}/>{label}
            </button>
          ))}
        </div>
      </div>

      {/* Main grid — stacks on mobile */}
      <div style={{ display:'grid', gridTemplateColumns:mode==='full'?'repeat(auto-fit,minmax(270px,1fr))':'repeat(auto-fit,minmax(270px,1fr))', gap:14, alignItems:'start' }}>

        {/* Upload col */}
        <div>
          <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:7 }}>
            <div style={{ width:5,height:5,borderRadius:'50%',background:'#2c7be5' }}/>
            <span style={{ fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.12em' }}>Wound Image</span>
          </div>
          <div className="card" style={{ padding:12,marginBottom:10 }}>
            <ImgUploader onSelect={handleImg} image={image} preview={preview}/>
          </div>
          {mode==='image' && (
            <div style={{ marginBottom:9,padding:'9px 12px',borderRadius:10,background:'rgba(44,123,229,.06)',border:'1px solid rgba(44,123,229,.15)',display:'flex',gap:7,alignItems:'flex-start' }}>
              <Info size={12} color="#2c7be5" style={{ marginTop:1,flexShrink:0 }}/>
              <span style={{ fontSize:'.7rem',color:'#4a7095',lineHeight:1.5 }}>Image-only — no sensor data used.</span>
            </div>
          )}
          <button className="btn" onClick={run} disabled={loading||!image} style={{ width:'100%',padding:'12px',fontSize:'.88rem',borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
            {loading?<><Loader2 size={15} className="spin"/>Analyzing...</>:<><Cpu size={15}/>Run AI Analysis</>}
          </button>
          {time&&!loading&&<div style={{ marginTop:6,textAlign:'center',fontSize:'.65rem',color:'#10b981',fontFamily:'JetBrains Mono,monospace' }}>✓ Completed in {time}s</div>}
          {error&&<div style={{ marginTop:8,padding:'9px 12px',borderRadius:10,background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.2)',color:'#dc2626',fontSize:'.76rem',lineHeight:1.5 }}>{error}</div>}

          {/* Model space notice */}
          <div style={{ marginTop:12,padding:'11px 14px',borderRadius:12,background:'rgba(44,123,229,.05)',border:'1px dashed rgba(44,123,229,.25)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:5 }}>
              <Cpu size={13} color="#2c7be5"/>
              <span style={{ fontSize:'.7rem',color:'#2c7be5',fontWeight:600 }}>AI Model Space</span>
            </div>
            <div style={{ fontSize:'.68rem',color:'#4a7095',lineHeight:1.55 }}>
              Place your trained model at:<br/>
              <code style={{ fontFamily:'JetBrains Mono,monospace',color:'#2c7be5',fontSize:'.67rem' }}>backend/model/best.pt</code><br/>
              <span style={{ color:'#93b8d4' }}>Restart backend — frontend auto-updates.</span>
            </div>
          </div>
        </div>

        {/* Sensor col */}
        {mode==='full' && (
          <div>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:7 }}>
              <div style={{ width:5,height:5,borderRadius:'50%',background:'#f59e0b' }}/>
              <span style={{ fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.12em' }}>Sensor Readings</span>
            </div>
            <SensorPanel sensors={sensors} setSensors={setSensors} loading={loading}/>
          </div>
        )}

        {/* Results col */}
        <div>
          <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:7 }}>
            <div style={{ width:5,height:5,borderRadius:'50%',background:'#7c3aed' }}/>
            <span style={{ fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.12em' }}>AI Decision Output</span>
            {isDemo&&result&&<span className="badge badge-amber" style={{ marginLeft:'auto' }}>Demo</span>}
            {!isDemo&&result&&<span className="badge badge-blue" style={{ marginLeft:'auto' }}>Live</span>}
          </div>
          <div className="card" style={{ padding:'16px 14px' }}>
            <Results result={result} isDemo={isDemo}/>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div style={{ marginTop:20,padding:'11px 16px',borderRadius:11,background:'white',border:'1px solid rgba(44,123,229,.1)',display:'flex',gap:18,justifyContent:'center',flexWrap:'wrap',boxShadow:'0 2px 8px rgba(44,123,229,.05)' }}>
        {[['Model','YOLOv8n (pending)'],['Classes','Mild / Moderate / Severe'],['Sensors','Temp · Moisture · Color'],['Team',"Qassim · ITEX'26"]].map(([l,v])=>(
          <div key={l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:'.57rem',color:'#93b8d4',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:2 }}>{l}</div>
            <div className="font-mono" style={{ fontSize:'.7rem',color:'#4a7095' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
