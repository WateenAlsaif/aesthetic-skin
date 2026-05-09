import { useState, useRef } from 'react'
import axios from 'axios'
import {
  Cpu, Loader2, Zap, FlaskConical, Activity, Thermometer, Droplets,
  Eye, ShieldAlert, Clock, ChevronRight, CheckCircle, AlertTriangle,
  XCircle, BarChart3, TrendingUp, ImagePlus, X, Info, Wifi, RefreshCw, Upload
} from 'lucide-react'

const API = 'https://aesthetic-skin-api.onrender.com'
const DEFAULT = { temperature: 36.8, moisture: 55.0, color_status: 'green' }

const AL = {
  CRITICAL:{ color:'#dc2626',bg:'rgba(239,68,68,.08)',  border:'rgba(239,68,68,.3)',  icon:XCircle,       cls:'gr' },
  HIGH:    { color:'#ef4444',bg:'rgba(239,68,68,.07)',  border:'rgba(239,68,68,.25)', icon:AlertTriangle, cls:'gr' },
  MEDIUM:  { color:'#b45309',bg:'rgba(245,158,11,.07)', border:'rgba(245,158,11,.28)',icon:AlertTriangle, cls:'ga' },
  LOW:     { color:'#059669',bg:'rgba(16,185,129,.07)', border:'rgba(16,185,129,.25)',icon:CheckCircle,   cls:'' },
}
const BC = { Mild:'#10b981', Moderate:'#f59e0b', Severe:'#ef4444' }
const RC = { LOW:'#10b981', MEDIUM:'#f59e0b', HIGH:'#ef4444' }

function ImgUploader({ onSelect, image, preview }) {
  const [drag, setDrag] = useState(false)
  const ref = useRef(null)
  function handle(file) { if (file?.type.startsWith('image/')) onSelect(file) }
  const fmt = b => !b?'':b<1024*1024?`${(b/1024).toFixed(0)}KB`:`${(b/(1024*1024)).toFixed(1)}MB`
  return (
    <div>
      <div className={`drop-zone ${drag?'drag-over':''}`}
        style={{ padding:preview?'10px':'32px 16px', minHeight:160, display:'flex', alignItems:'center', justifyContent:'center' }}
        onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handle(e.dataTransfer.files[0])}}
        onClick={()=>!preview&&ref.current?.click()}
      >
        {preview ? (
          <div style={{width:'100%',position:'relative'}}>
            <img src={preview} alt="wound" style={{width:'100%',maxHeight:200,objectFit:'cover',borderRadius:10,display:'block'}}/>
            <div style={{position:'absolute',top:7,right:7,display:'flex',gap:5}}>
              <button onClick={e=>{e.stopPropagation();ref.current?.click()}} style={{background:'rgba(255,255,255,.9)',border:'1px solid rgba(44,123,229,.3)',borderRadius:7,padding:'4px 8px',cursor:'pointer',color:'#2c7be5',display:'flex',alignItems:'center',gap:3,fontSize:'.67rem',fontWeight:500,fontFamily:'DM Sans,sans-serif'}}>
                <RefreshCw size={10}/> Change
              </button>
              <button onClick={e=>{e.stopPropagation();onSelect(null)}} style={{background:'rgba(255,255,255,.9)',border:'1px solid rgba(239,68,68,.3)',borderRadius:7,padding:'4px 7px',cursor:'pointer',color:'#dc2626',display:'flex',alignItems:'center',fontFamily:'DM Sans,sans-serif'}}>
                <X size={11}/>
              </button>
            </div>
            <div style={{marginTop:7,padding:'6px 10px',background:'rgba(44,123,229,.06)',border:'1px solid rgba(44,123,229,.12)',borderRadius:8,display:'flex',justifyContent:'space-between'}}>
              <span className="font-mono" style={{fontSize:'.65rem',color:'#4a7095',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'70%'}}>{image?.name}</span>
              <span className="font-mono" style={{fontSize:'.63rem',color:'#2c7be5',flexShrink:0}}>{fmt(image?.size)}</span>
            </div>
          </div>
        ) : (
          <div style={{textAlign:'center'}}>
            <div style={{width:52,height:52,background:'rgba(44,123,229,.1)',borderRadius:14,margin:'0 auto 14px',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(44,123,229,.2)'}}>
              <ImagePlus size={23} color="#2c7be5"/>
            </div>
            <div style={{fontSize:'.88rem',color:'#0f2744',fontWeight:500,marginBottom:5}}>Drop burn image here</div>
            <div style={{fontSize:'.74rem',color:'#4a7095',marginBottom:14}}>or click · JPG, PNG, WEBP</div>
            <button onClick={e=>{e.stopPropagation();ref.current?.click()}} className="btn-out" style={{display:'inline-flex',alignItems:'center',gap:5,padding:'7px 18px',fontSize:'.78rem'}}>
              <Upload size={12}/> Browse
            </button>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handle(e.target.files[0])}/>
    </div>
  )
}

function SensorPanel({ sensors, setSensors, loading }) {
  const [sim, setSim] = useState(null)
  async function simulate(s) {
    setSim(s)
    try { const r=await axios.get(`${API}/sensor/simulate?scenario=${s}`); const d=r.data.data; setSensors({temperature:d.temperature,moisture:d.moisture,color_status:d.color_status}) }
    catch(e){console.error(e)} finally{setSim(null)}
  }
  const cmap = {
    green:  {bg:'rgba(16,185,129,.08)',color:'#059669',label:'No Infection',   border:'rgba(16,185,129,.22)'},
    yellow: {bg:'rgba(245,158,11,.08)',color:'#b45309',label:'Early Warning',  border:'rgba(245,158,11,.25)'},
    red:    {bg:'rgba(239,68,68,.08)', color:'#dc2626',label:'Infection Alert!',border:'rgba(239,68,68,.25)'},
  }
  const cc = cmap[sensors.color_status]||cmap.green

  function Slid({icon:Icon,label,value,min,max,step,unit,color,warn,onChange}) {
    const pct=Math.min(100,((value-min)/(max-min))*100); const bad=warn(value)
    return (
      <div className="card" style={{padding:'15px 16px',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:9}}>
          <div style={{display:'flex',alignItems:'center',gap:7}}><Icon size={14} color={bad?'#f59e0b':color}/><span style={{fontSize:'.76rem',color:'#4a7095',fontWeight:500}}>{label}</span></div>
          <div style={{display:'flex',alignItems:'baseline',gap:2}}>
            <span className="font-mono" style={{fontSize:'1.3rem',color:bad?'#f59e0b':color,fontWeight:500}}>{value}</span>
            <span style={{fontSize:'.68rem',color:'#93b8d4'}}>{unit}</span>
          </div>
        </div>
        <div style={{position:'relative',marginBottom:5}}>
          <div className="track" style={{height:7}}><div className="fill" style={{width:`${pct}%`,background:bad?'linear-gradient(90deg,#f59e0b,#ef4444)':`linear-gradient(90deg,${color}70,${color})`}}/></div>
          <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(parseFloat(e.target.value))} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0,cursor:'pointer'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:'.6rem',color:'#93b8d4',fontFamily:'monospace',marginBottom:8}}>
          <span>{min}{unit}</span>{bad&&<span style={{color:'#f59e0b'}}>⚠ Abnormal</span>}<span>{max}{unit}</span>
        </div>
        <input type="number" min={min} max={max} step={step} value={value} style={{width:'100%',padding:'8px 10px',background:'#f0f7ff',border:'1px solid rgba(44,123,229,.2)',borderRadius:10,color:'#0f2744',fontFamily:'JetBrains Mono,monospace',fontSize:'.8rem',outline:'none'}} onChange={e=>onChange(parseFloat(e.target.value)||min)}/>
      </div>
    )
  }

  return (
    <div>
      <Slid icon={Thermometer} label="Temperature" value={sensors.temperature} min={34} max={42} step={0.1} unit="°C" color="#f59e0b" warn={v=>v>38.5} onChange={v=>setSensors(s=>({...s,temperature:v}))}/>
      <Slid icon={Droplets} label="Moisture" value={sensors.moisture} min={0} max={100} step={1} unit="%" color="#2c7be5" warn={v=>v<20} onChange={v=>setSensors(s=>({...s,moisture:v}))}/>
      <div className="card" style={{padding:'15px 16px',marginBottom:12,background:cc.bg,border:`1px solid ${cc.border}`}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:11}}>
          <div style={{display:'flex',alignItems:'center',gap:7}}><Eye size={14} color={cc.color}/><span style={{fontSize:'.76rem',color:'#4a7095',fontWeight:500}}>Color Sensor</span></div>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <span className="dot" style={{width:8,height:8,borderRadius:'50%',background:cc.color,boxShadow:`0 0 6px ${cc.color}`,display:'inline-block'}}/>
            <span style={{fontSize:'.74rem',color:cc.color,fontWeight:600}}>{cc.label}</span>
          </div>
        </div>
        <div style={{display:'flex',gap:7}}>
          {['green','yellow','red'].map(c=>(
            <button key={c} onClick={()=>setSensors(s=>({...s,color_status:c}))} style={{flex:1,padding:'7px 0',borderRadius:9,border:`1px solid ${sensors.color_status===c?cmap[c].color:'rgba(44,123,229,.15)'}`,background:sensors.color_status===c?cmap[c].bg:'transparent',color:sensors.color_status===c?cmap[c].color:'#4a7095',cursor:'pointer',fontSize:'.71rem',fontWeight:sensors.color_status===c?700:400,textTransform:'capitalize',transition:'all .2s',fontFamily:'DM Sans,sans-serif'}}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{fontSize:'.63rem',color:'#93b8d4',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:6}}>Simulate Scenario</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
        {[['normal','#10b981'],['warning','#f59e0b'],['critical','#ef4444'],['random','#2c7be5']].map(([s,c])=>(
          <button key={s} onClick={()=>simulate(s)} disabled={!!sim||loading} style={{padding:'8px',borderRadius:9,border:`1px solid ${c}22`,background:`${c}08`,color:sim===s?c:'#4a7095',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5,fontSize:'.71rem',fontWeight:500,transition:'all .2s',fontFamily:'DM Sans,sans-serif'}}>
            {sim===s?<><RefreshCw size={10} className="sp"/>Loading...</>:<><Wifi size={10} style={{color:c}}/>{s}</>}
          </button>
        ))}
      </div>
    </div>
  )
}

function Results({ result }) {
  if (!result) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:300,gap:12,padding:'28px 16px',textAlign:'center'}}>
      <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(44,123,229,.07)',border:'1px solid rgba(44,123,229,.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Activity size={26} color="#93b8d4"/>
      </div>
      <div style={{color:'#4a7095',fontSize:'.83rem',lineHeight:1.7}}>
        Upload a wound image and click<br/><strong style={{color:'#0f2744'}}>Run AI Analysis</strong>
      </div>
    </div>
  )
  const al=AL[result.alert_level]||AL.LOW; const AIcon=al.icon
  const bc=BC[result.burn_severity]||'#0f2744'; const rc=RC[result.infection_risk]||'#0f2744'
  const conf=Math.round((result.image_confidence||0)*100)
  const cmap2={green:'#10b981',yellow:'#f59e0b',red:'#ef4444'}

  return (
    <div className="fi" style={{display:'flex',flexDirection:'column',gap:12}}>
      <div className={al.cls} style={{padding:'14px 17px',background:al.bg,border:`1px solid ${al.border}`,borderRadius:14,display:'flex',alignItems:'center',gap:12}}>
        <AIcon size={21} color={al.color}/>
        <div>
          <div style={{fontSize:'.62rem',color:al.color,textTransform:'uppercase',letterSpacing:'.12em',fontWeight:700,marginBottom:2}}>Alert — {result.alert_level}</div>
          <div style={{fontSize:'.84rem',color:'#0f2744',lineHeight:1.4}}>{result.alert_message}</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9}}>
        {[{icon:ShieldAlert,label:'Burn Severity',val:result.burn_severity,sub:result.burn_description,color:bc},{icon:AlertTriangle,label:'Infection Risk',val:result.infection_risk,sub:'Sensor score',color:rc},{icon:Cpu,label:'AI Confidence',val:`${conf}%`,sub:'Image model',color:'#2c7be5'}].map(({icon:Icon,label,val,sub,color})=>(
          <div key={label} style={{background:'white',border:'1px solid rgba(44,123,229,.12)',borderRadius:14,padding:'14px 12px',boxShadow:'0 2px 8px rgba(44,123,229,.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:6}}><Icon size={11} color={color}/><span style={{fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.07em'}}>{label}</span></div>
            <div className="font-mono" style={{fontSize:'1.25rem',fontWeight:500,color,lineHeight:1}}>{val}</div>
            {sub&&<div style={{fontSize:'.62rem',color:'#93b8d4',marginTop:4,lineHeight:1.4}}>{sub}</div>}
          </div>
        ))}
      </div>

      <div className="card" style={{padding:'13px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
          <div style={{display:'flex',alignItems:'center',gap:5}}><BarChart3 size={12} color="#2c7be5"/><span style={{fontSize:'.68rem',color:'#4a7095'}}>Detection confidence</span></div>
          <span className="font-mono" style={{fontSize:'.75rem',color:'#2c7be5'}}>{conf}%</span>
        </div>
        <div className="track"><div className="fill" style={{width:`${conf}%`,background:conf>=70?'linear-gradient(90deg,#10b981,#2c7be5)':conf>=40?'linear-gradient(90deg,#f59e0b,#f87132)':'linear-gradient(90deg,#ef4444,#f87132)'}}/></div>
        {conf<50&&<div style={{fontSize:'.65rem',color:'#f59e0b',marginTop:5}}>⚠ Low confidence — upload a clearer image</div>}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
        <div className="card" style={{padding:'13px 14px',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:'rgba(44,123,229,.1)',display:'flex',alignItems:'center',justifyContent:'center'}}><Activity size={14} color="#2c7be5"/></div>
          <div><div style={{fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>Healing Status</div><div style={{fontWeight:600,color:'#0f2744',fontSize:'.84rem'}}>{result.healing_status}</div></div>
        </div>
        <div className="card" style={{padding:'13px 14px',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:'rgba(124,58,237,.1)',display:'flex',alignItems:'center',justifyContent:'center'}}><Clock size={14} color="#7c3aed"/></div>
          <div><div style={{fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>Est. Healing</div><div style={{fontWeight:600,color:'#0f2744',fontSize:'.78rem'}}>{result.estimated_healing_time}</div></div>
        </div>
      </div>

      {result.temperature!==undefined&&(
        <div className="card" style={{padding:'14px 16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:10}}><TrendingUp size={12} color="#4a7095"/><span style={{fontSize:'.65rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.08em'}}>Sensor Readings</span></div>
          {[{icon:Thermometer,label:'Temperature',val:`${result.temperature}°C`,color:result.temperature>38.5?'#ef4444':result.temperature>37.5?'#f59e0b':'#10b981'},{icon:Droplets,label:'Moisture',val:`${result.moisture}%`,color:result.moisture<20?'#ef4444':result.moisture>80?'#f59e0b':'#2c7be5'},{icon:Eye,label:'Color Sensor',val:(result.color_status||'green').toUpperCase(),color:cmap2[result.color_status]||'#10b981'}].map(({icon:Icon,label,val,color})=>(
            <div key={label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 12px',background:'#f0f7ff',border:'1px solid rgba(44,123,229,.1)',borderRadius:10,marginBottom:7}}>
              <div style={{display:'flex',alignItems:'center',gap:7}}><Icon size={13} color={color}/><span style={{fontSize:'.76rem',color:'#4a7095'}}>{label}</span></div>
              <span className="font-mono" style={{fontSize:'.88rem',color,fontWeight:500}}>{val}</span>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{padding:'16px 18px'}}>
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:12}}><ShieldAlert size={14} color="#f59e0b"/><span style={{fontSize:'.73rem',color:'#0f2744',fontWeight:600,textTransform:'uppercase',letterSpacing:'.07em'}}>Clinical Recommendations</span></div>
        {(result.recommendations||[]).map((r,i)=>(
          <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9,padding:'8px 0',borderBottom:i<result.recommendations.length-1?'1px solid rgba(44,123,229,.07)':'none'}}>
            <ChevronRight size={12} color="#2c7be5" style={{marginTop:3,flexShrink:0}}/>
            <span style={{fontSize:'.79rem',color:'#4a7095',lineHeight:1.6}}>{r}</span>
          </div>
        ))}
      </div>

      <div style={{fontSize:'.6rem',color:'#93b8d4',textAlign:'center',fontFamily:'JetBrains Mono,monospace'}}>
        {result.analysis_model||'YOLOv8+RF'} · Detections: {result.total_detections}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [sensors, setSensors] = useState(DEFAULT)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [mode, setMode]       = useState('full')
  const [time, setTime]       = useState(null)

  function handleImg(file) {
    if (!file) { setImage(null); setPreview(null); return }
    setImage(file); setPreview(URL.createObjectURL(file))
    setResult(null); setError(null)
  }

  async function run() {
    if (!image) { setError('Upload a burn image first.'); return }
    setError(null); setLoading(true); setResult(null)
    const t0 = Date.now()
    try {
      const fd = new FormData(); fd.append('file', image)
      let res
      if (mode==='full') { fd.append('temperature',sensors.temperature); fd.append('moisture',sensors.moisture); fd.append('color_status',sensors.color_status); res=await axios.post(`${API}/predict/full`,fd) }
      else { res=await axios.post(`${API}/predict/image`,fd) }
      setResult(res.data.data); setTime(((Date.now()-t0)/1000).toFixed(2))
    } catch(e) {
      setError(e.response?.data?.detail||e.message||'Analysis failed')
    } finally { setLoading(false) }
  }

  const tc=sensors.temperature>38.5?'#ef4444':sensors.temperature>37.5?'#f59e0b':'#10b981'
  const mc=sensors.moisture<20?'#ef4444':sensors.moisture>80?'#f59e0b':'#2c7be5'
  const dc={green:'#10b981',yellow:'#f59e0b',red:'#ef4444'}[sensors.color_status]||'#10b981'

  return (
    <div style={{maxWidth:1280,margin:'0 auto',padding:'18px 14px'}}>
      <div style={{textAlign:'center',marginBottom:16}}>
        <h1 className="font-display" style={{fontSize:'clamp(1.35rem,4vw,2rem)',color:'#0f2744',fontWeight:800,letterSpacing:'-0.02em',marginBottom:4}}>
          Real AI Analysis <span style={{color:'#2c7be5'}}>Dashboard</span>
        </h1>
        <p style={{color:'#4a7095',fontSize:'.8rem'}}>Upload a burn wound image · Configure sensors · Get live AI clinical assessment</p>
      </div>

      {/* Live sensor strip */}
      <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',padding:'10px 14px',background:'white',borderRadius:11,border:'1px solid rgba(44,123,229,.12)',marginBottom:14,boxShadow:'0 2px 8px rgba(44,123,229,.06)'}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}><span className="dot" style={{width:6,height:6,borderRadius:'50%',background:'#10b981',display:'inline-block'}}/><span style={{fontSize:'.68rem',color:'#4a7095',fontWeight:500}}>Live Sensors</span></div>
        <div style={{display:'flex',gap:16,marginLeft:'auto',flexWrap:'wrap'}}>
          <span className="font-mono" style={{fontSize:'.75rem',color:tc}}>🌡 {sensors.temperature}°C</span>
          <span className="font-mono" style={{fontSize:'.75rem',color:mc}}>💧 {sensors.moisture}%</span>
          <span className="font-mono" style={{fontSize:'.75rem',color:dc}}>● {sensors.color_status.toUpperCase()}</span>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
        <div style={{background:'white',border:'1px solid rgba(44,123,229,.15)',borderRadius:11,padding:3,display:'flex',gap:3,boxShadow:'0 2px 8px rgba(44,123,229,.06)'}}>
          {[{id:'full',label:'Hybrid AI (Image + Sensors)',icon:Zap},{id:'image',label:'Image Only',icon:FlaskConical}].map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>setMode(id)} style={{padding:'7px 13px',borderRadius:9,border:'none',background:mode===id?'rgba(44,123,229,.12)':'transparent',color:mode===id?'#1d4ed8':'#4a7095',fontSize:'.74rem',cursor:'pointer',fontWeight:mode===id?600:400,display:'flex',alignItems:'center',gap:5,transition:'all .2s',whiteSpace:'nowrap',fontFamily:'DM Sans,sans-serif'}}>
              <Icon size={13}/>{label}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:mode==='full'?'repeat(auto-fit,minmax(270px,1fr))':'repeat(auto-fit,minmax(270px,1fr))',gap:14,alignItems:'start'}}>

        {/* Upload */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}><div style={{width:5,height:5,borderRadius:'50%',background:'#2c7be5'}}/><span style={{fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.12em'}}>Wound Image</span></div>
          <div className="card" style={{padding:12,marginBottom:10}}><ImgUploader onSelect={handleImg} image={image} preview={preview}/></div>
          {mode==='image'&&<div style={{marginBottom:9,padding:'9px 12px',borderRadius:10,background:'rgba(44,123,229,.06)',border:'1px solid rgba(44,123,229,.15)',display:'flex',gap:7,alignItems:'flex-start'}}><Info size={12} color="#2c7be5" style={{marginTop:1,flexShrink:0}}/><span style={{fontSize:'.7rem',color:'#4a7095',lineHeight:1.5}}>Image-only mode — switch to Hybrid AI for full sensor analysis.</span></div>}
          <button className="btn" onClick={run} disabled={loading||!image} style={{width:'100%',padding:'12px',fontSize:'.88rem',borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {loading?<><Loader2 size={15} className="sp"/>Analyzing...</>:<><Cpu size={15}/>Run AI Analysis</>}
          </button>
          {time&&!loading&&<div style={{marginTop:6,textAlign:'center',fontSize:'.65rem',color:'#10b981',fontFamily:'JetBrains Mono,monospace'}}>✓ Completed in {time}s</div>}
          {error&&<div style={{marginTop:8,padding:'9px 12px',borderRadius:10,background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.2)',color:'#dc2626',fontSize:'.76rem',lineHeight:1.5}}>{error.includes('best.pt')?'⚠ AI model not found. Place best.pt in backend/model/ and restart.':error}</div>}
          <div style={{marginTop:12,padding:'11px 14px',borderRadius:12,background:'rgba(44,123,229,.05)',border:'1px dashed rgba(44,123,229,.25)'}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}><Cpu size={13} color="#2c7be5"/><span style={{fontSize:'.7rem',color:'#2c7be5',fontWeight:600}}>AI Model Space</span></div>
            <div style={{fontSize:'.68rem',color:'#4a7095',lineHeight:1.55}}>Place your trained model at:<br/><code style={{fontFamily:'JetBrains Mono,monospace',color:'#2c7be5',fontSize:'.67rem'}}>backend/model/best.pt</code><br/><span style={{color:'#93b8d4'}}>Restart backend — frontend auto-updates.</span></div>
          </div>
        </div>

        {/* Sensors */}
        {mode==='full'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}><div style={{width:5,height:5,borderRadius:'50%',background:'#f59e0b'}}/><span style={{fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.12em'}}>Sensor Readings</span></div>
            <SensorPanel sensors={sensors} setSensors={setSensors} loading={loading}/>
          </div>
        )}

        {/* Results */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}><div style={{width:5,height:5,borderRadius:'50%',background:'#7c3aed'}}/><span style={{fontSize:'.6rem',color:'#4a7095',textTransform:'uppercase',letterSpacing:'.12em'}}>AI Decision Output</span>{result&&<span className="badge b-blue" style={{marginLeft:'auto'}}>Live</span>}</div>
          <div className="card" style={{padding:'16px 14px'}}><Results result={result}/></div>
        </div>
      </div>

      <div style={{marginTop:20,padding:'11px 16px',borderRadius:11,background:'white',border:'1px solid rgba(44,123,229,.1)',display:'flex',gap:18,justifyContent:'center',flexWrap:'wrap',boxShadow:'0 2px 8px rgba(44,123,229,.05)'}}>
        {[['Model','YOLOv8n'],['Classes','Mild / Moderate / Severe'],['Sensors','Temp · Moisture · Color'],['Team',"Qassim · ITEX'26"]].map(([l,v])=>(
          <div key={l} style={{textAlign:'center'}}><div style={{fontSize:'.57rem',color:'#93b8d4',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:2}}>{l}</div><div className="font-mono" style={{fontSize:'.7rem',color:'#4a7095'}}>{v}</div></div>
        ))}
      </div>
    </div>
  )
}
