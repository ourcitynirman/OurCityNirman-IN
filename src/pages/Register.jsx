import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── UPDATE THIS URL after each new deployment ───────────────
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyJq6i5Gyo5DTWc_4XNObUwqT8Cogu6D1iU4XaO6OwNRdhXmr66U0MUIPKfKVk3Or2e/exec'

const USER_TYPES = [
  { v: 'Homeowner',  e: '🏠' },
  { v: 'Vendor',     e: '🏪' },
  { v: 'Contractor', e: '👷' },
  { v: 'Architect',  e: '📐' },
  { v: 'Other',      e: '✏️' },
]
const SIZES   = ['₹1L–5L','₹5L–10L','₹10L–20L','₹20L–35L','₹35L–50L','₹50L–75L','₹75L+']
const SOURCES = ['WhatsApp / Social Media','Friend / Family','Google Search','YouTube','Newspaper','Local Event','Other']

// ─────────────────────────────────────────────────────────────
//  CSS
// ─────────────────────────────────────────────────────────────
const ANIM_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Sora:wght@700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box}
body{background:#070d18;margin:0;font-family:'DM Sans',system-ui,sans-serif}

@keyframes toastIn     {from{opacity:0;transform:translateX(50px) scale(.9)}to{opacity:1;transform:none}}
@keyframes fadeUp      {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes slideDown   {from{opacity:0;max-height:0}to{opacity:1;max-height:600px}}
@keyframes spin        {to{transform:rotate(360deg)}}
@keyframes cityRise    {0%{transform:scaleY(0);opacity:0}60%{transform:scaleY(1.05)}100%{transform:scaleY(1);opacity:1}}
@keyframes windowBlink {0%,100%{opacity:.12}50%{opacity:.9}}
@keyframes craneSwing  {0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes cloudDrift  {from{transform:translateX(0)}to{transform:translateX(60px)}}
@keyframes burst       {0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)}}
@keyframes progressGlow{0%,100%{box-shadow:0 0 8px rgba(249,115,22,.4)}50%{box-shadow:0 0 28px rgba(249,115,22,1),0 0 56px rgba(249,115,22,.5)}}
@keyframes groundPulse {0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.4)}50%{box-shadow:0 0 0 14px rgba(249,115,22,0)}}
@keyframes hologram    {0%,100%{opacity:.5}50%{opacity:1}}
@keyframes scanDown    {0%{top:0;opacity:.9}100%{top:100%;opacity:0}}
@keyframes pulseDot    {0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.5}}
@keyframes successPop  {0%{transform:scale(0) rotate(-180deg);opacity:0}60%{transform:scale(1.2) rotate(10deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
@keyframes checkDraw   {from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
@keyframes ripple      {0%{transform:scale(0);opacity:.6}100%{transform:scale(4);opacity:0}}
@keyframes floatUp     {0%{transform:translateY(0);opacity:1}100%{transform:translateY(-60px);opacity:0}}
@keyframes shimmer     {0%{background-position:-200% 0}100%{background-position:200% 0}}

.toast-in    {animation:toastIn .45s cubic-bezier(.34,1.56,.64,1) both}
.fade-up     {animation:fadeUp .6s ease both}
.slide-down  {animation:slideDown .4s ease both;overflow:hidden}
.spin-anim   {animation:spin 1s linear infinite}
.crane-swing {animation:craneSwing 2.5s ease-in-out infinite}
.hologram    {animation:hologram 3s ease-in-out infinite}
.pulse-dot   {animation:pulseDot 1.5s ease-in-out infinite}
.success-pop {animation:successPop .6s cubic-bezier(.34,1.56,.64,1) both}
.check-draw  {stroke-dasharray:100;animation:checkDraw .6s ease .4s both}
.city-rise   {animation:cityRise .7s ease both;transform-origin:bottom}
.window-blink{animation:windowBlink var(--dur,2s) ease-in-out var(--del,0ms) infinite}
.shimmer-btn {background:linear-gradient(90deg,#ea580c 0%,#f97316 25%,#fb923c 50%,#f97316 75%,#ea580c 100%);background-size:200% 100%;animation:shimmer 2s linear infinite}

.progress-bar{background:linear-gradient(90deg,#ea580c,#f97316,#fb923c,#fbbf24);animation:progressGlow 1s ease-in-out infinite}
.ground-line {background:linear-gradient(90deg,transparent,rgba(249,115,22,.5),rgba(249,115,22,.9),rgba(249,115,22,.5),transparent);animation:groundPulse 2s ease-in-out infinite}
.scan-line   {position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(249,115,22,.7),transparent);animation:scanDown 2s ease-in-out infinite}

input::placeholder,textarea::placeholder{color:rgba(148,163,184,.3)}
input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px #0c1624 inset!important;-webkit-text-fill-color:white!important}
textarea{resize:vertical;min-height:80px}
select option{background:#0c1624;color:#cbd5e1}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:rgba(255,255,255,.03)}
::-webkit-scrollbar-thumb{background:rgba(249,115,22,.35);border-radius:4px}
`

// ─────────────────────────────────────────────────────────────
//  Toast Hook
// ─────────────────────────────────────────────────────────────
function useToast() {
  const [list, setList] = useState([])
  const push = (type, title, sub) => {
    const id = Date.now()
    setList(t => [...t.slice(-2), { id, type, title, sub }])
    setTimeout(() => setList(t => t.filter(x => x.id !== id)), 4500)
  }
  return { list, ok: (t,s)=>push('ok',t,s), err: (t,s)=>push('err',t,s), pin: (t,s)=>push('pin',t,s) }
}

function Toasts({ list }) {
  const meta  = { ok:'#22c55e', err:'#ef4444', pin:'#f97316' }
  const icons = { ok:'✅', err:'⚠️', pin:'📍' }
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 w-[300px] pointer-events-none">
      {list.map(t => (
        <div key={t.id} className="toast-in relative overflow-hidden rounded-2xl pointer-events-auto"
          style={{background:'rgba(8,15,30,0.97)',border:'1px solid rgba(255,255,255,.1)',boxShadow:'0 20px 60px rgba(0,0,0,.6)'}}>
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{background:meta[t.type]}}/>
          <div className="flex gap-3 items-start p-3.5">
            <span className="text-xl shrink-0">{icons[t.type]}</span>
            <div>
              <p className="text-white font-semibold text-[13px] m-0 leading-snug">{t.title}</p>
              {t.sub && <p className="text-slate-400 text-[11px] mt-0.5 m-0 leading-relaxed">{t.sub}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  Form Components
// ─────────────────────────────────────────────────────────────
function FInput({ label, name, value, onChange, type='text', status, error, maxLength, autoComplete, inputMode, disabled }) {
  const [focused, setFocused] = useState(false)
  const active = focused || (value && value.length > 0)
  const borderColor = error ? '#ef4444' : status==='ok' ? '#22c55e' : status==='bad' ? '#ef4444' : focused ? '#f97316' : 'rgba(255,255,255,.07)'
  const shadow = focused ? `0 0 0 3px ${error||status==='bad'?'rgba(239,68,68,.12)':status==='ok'?'rgba(34,197,94,.12)':'rgba(249,115,22,.12)'}` : 'none'
  return (
    <div className="relative">
      <div className="relative">
        <input type={type} name={name} value={value} onChange={onChange} disabled={disabled}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          maxLength={maxLength} autoComplete={autoComplete} inputMode={inputMode}
          style={{width:'100%',padding:'22px 16px 8px',borderRadius:12,background:focused?'rgba(249,115,22,.04)':'rgba(255,255,255,.03)',
            border:`1.5px solid ${borderColor}`,color:'white',fontSize:14,outline:'none',transition:'all .2s',fontFamily:'inherit',boxShadow:shadow,
            opacity:disabled?.6:1,cursor:disabled?'not-allowed':'text'}}/>
        <label style={{position:'absolute',left:16,pointerEvents:'none',transition:'all .2s',fontWeight:500,fontFamily:'inherit',
          top:active?8:'50%',transform:active?'none':'translateY(-50%)',fontSize:active?10:14,letterSpacing:active?'.1em':0,
          textTransform:active?'uppercase':'none',
          color:error?'#f87171':status==='ok'?'#4ade80':focused?'#f97316':'rgba(148,163,184,.55)'}}>
          {label}
        </label>
        {(status==='ok'||status==='bad') && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{background:status==='ok'?'#22c55e':'#ef4444'}}/>
        )}
      </div>
      {error && <p className="text-[#f87171] text-[11px] mt-1 ml-0.5 m-0">⚠ {error}</p>}
    </div>
  )
}

function FTextarea({ label, name, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)
  const active = focused || (value && value.length > 0)
  return (
    <div className="relative">
      <textarea name={name} value={value} onChange={onChange}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        placeholder={active?placeholder:''}
        style={{width:'100%',padding:'22px 16px 10px',borderRadius:12,background:focused?'rgba(249,115,22,.04)':'rgba(255,255,255,.03)',
          border:`1.5px solid ${focused?'#f97316':'rgba(255,255,255,.07)'}`,color:'white',fontSize:14,outline:'none',
          transition:'all .2s',fontFamily:'inherit',minHeight:90,boxShadow:focused?'0 0 0 3px rgba(249,115,22,.1)':'none'}}/>
      <label style={{position:'absolute',left:16,pointerEvents:'none',transition:'all .2s',fontWeight:500,fontFamily:'inherit',
        top:active?8:16,fontSize:active?10:14,letterSpacing:active?'.1em':0,textTransform:active?'uppercase':'none',
        color:focused?'#f97316':'rgba(148,163,184,.55)'}}>
        {label}
      </label>
    </div>
  )
}

function FSelect({ label, name, value, onChange, options }) {
  const [focused, setFocused] = useState(false)
  const active = focused || (value && value.length > 0)
  return (
    <div className="relative">
      <select name={name} value={value} onChange={onChange}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{width:'100%',padding:'22px 36px 8px 16px',borderRadius:12,background:focused?'rgba(249,115,22,.04)':'rgba(255,255,255,.03)',
          border:`1.5px solid ${focused?'#f97316':'rgba(255,255,255,.07)'}`,color:value?'white':'rgba(148,163,184,.4)',
          fontSize:14,outline:'none',appearance:'none',cursor:'pointer',transition:'all .2s',fontFamily:'inherit',
          boxShadow:focused?'0 0 0 3px rgba(249,115,22,.1)':'none'}}>
        <option value="">—</option>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
      <label style={{position:'absolute',left:16,pointerEvents:'none',transition:'all .2s',fontWeight:500,fontFamily:'inherit',
        top:active?8:'50%',transform:active?'none':'translateY(-50%)',fontSize:active?10:14,letterSpacing:active?'.1em':0,
        textTransform:active?'uppercase':'none',color:focused?'#f97316':'rgba(148,163,184,.55)'}}>
        {label}
      </label>
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">▾</span>
    </div>
  )
}

function SectionHead({ icon, label }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="w-8 h-8 rounded-[10px] shrink-0 flex items-center justify-center text-[15px]"
        style={{background:'rgba(249,115,22,.1)',border:'1px solid rgba(249,115,22,.22)'}}>
        {icon}
      </div>
      <p className="text-[11px] font-bold tracking-[.15em] uppercase whitespace-nowrap m-0"
        style={{color:'rgba(249,115,22,.65)'}}>
        {label}
      </p>
      <div className="flex-1 h-px" style={{background:'linear-gradient(90deg,rgba(249,115,22,.25),transparent)'}}/>
    </div>
  )
}

function Pill({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className="rounded-xl text-[11px] font-semibold cursor-pointer transition-all duration-200 text-center"
      style={{padding:'10px 6px',border:`1.5px solid ${on?'#f97316':'rgba(255,255,255,.07)'}`,
        background:on?'rgba(249,115,22,.12)':'rgba(255,255,255,.02)',
        color:on?'#fb923c':'rgba(148,163,184,.6)',fontFamily:'inherit',
        boxShadow:on?'0 4px 20px rgba(249,115,22,.18)':'none'}}>
      {children}
    </button>
  )
}

function PinBadge({ pin, district, state, count }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl"
      style={{background:'rgba(34,197,94,.05)',border:'1px solid rgba(34,197,94,.22)'}}>
      <div className="flex items-center gap-2">
        <span className="w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center text-[10px]"
          style={{background:'rgba(34,197,94,.15)',color:'#4ade80'}}>✓</span>
        <span className="text-xs font-semibold" style={{color:'#4ade80'}}>PIN {pin} — {district}, {state}</span>
      </div>
      <span className="text-[11px] text-slate-500">{count} PO{count>1?'s':''}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  Building (City Animation)
// ─────────────────────────────────────────────────────────────
function Building({ w, h, l, color, border, delay, cols, rows, scanColor }) {
  const windows = cols * rows
  return (
    <div className="city-rise absolute rounded-t-sm overflow-hidden"
      style={{width:w,height:h,left:l,bottom:3,background:color,border:`1px solid ${border}`,animationDelay:`${delay}ms`}}>
      <div className="absolute inset-1.5 grid gap-0.5" style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>
        {Array.from({length:windows}).map((_,i)=>(
          <div key={i} className="rounded-sm window-blink"
            style={{background:Math.random()>.45?`rgba(251,191,36,${.5+Math.random()*.4})`:'rgba(255,255,255,.04)',
              '--dur':`${1+Math.random()*2}s`,'--del':`${Math.random()*2000}ms`}}/>
        ))}
      </div>
      <div className="scan-line" style={{background:`linear-gradient(90deg,transparent,${scanColor},transparent)`,
        animationDelay:`${delay+100}ms`,animationIterationCount:3}}/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  ENHANCED Submit Animation
// ─────────────────────────────────────────────────────────────
function SubmitAnimation({ name }) {
  const [prog,  setProg]  = useState(0)
  const [step,  setStep]  = useState(0)
  const [phase, setPhase] = useState('loading') // loading → success
  const [floats, setFloats] = useState([])

  const steps = [
    { text: 'Verifying your details…',   icon: '🔍' },
    { text: 'Securing your spot…',        icon: '🔒' },
    { text: 'Building your profile…',     icon: '🏗️' },
    { text: 'Saving to Google Sheets…',   icon: '📊' },
    { text: 'You\'re in! Welcome aboard', icon: '🎉' },
  ]

  const particles = useRef(Array.from({length:32},(_,i)=>{
    const angle=(i/32)*Math.PI*2, dist=90+Math.random()*70
    return { tx:`${Math.cos(angle)*dist}px`, ty:`${Math.sin(angle)*dist}px`,
      color:['#f97316','#fbbf24','#22c55e','#60a5fa','#a78bfa','#fb7185'][i%6],
      delay:`${Math.random()*.5}s`, size: 3+Math.random()*4 }
  })).current

  useEffect(()=>{
    window.scrollTo({top:0,behavior:'smooth'})
    const iv = setInterval(()=>setProg(p=>{ if(p>=100){clearInterval(iv);return 100} return p+.55 }),18)
    const sv = setInterval(()=>setStep(s=>Math.min(s+1,steps.length-1)),520)
    const pt = setTimeout(()=>setPhase('success'),2600)

    // Float emojis
    const emojis = ['🏠','🏗️','✨','🎯','🔑','💫','🌟','🏙️']
    const fi = setInterval(()=>{
      setFloats(f=>[...f.slice(-6),{
        id:Date.now(), emoji:emojis[Math.floor(Math.random()*emojis.length)],
        x: 20+Math.random()*60, delay:0
      }])
    },600)
    const fc = setTimeout(()=>clearInterval(fi),2500)

    return()=>{ clearInterval(iv);clearInterval(sv);clearTimeout(pt);clearInterval(fi);clearTimeout(fc) }
  },[])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6"
      style={{background:'#070d18'}}>
      <style>{ANIM_CSS}</style>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none hologram"
        style={{background:'radial-gradient(ellipse 80% 60% at 50% 40%,rgba(249,115,22,.08) 0%,transparent 65%)'}}/>
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{backgroundImage:'radial-gradient(rgba(249,115,22,.28) 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>

      {/* Float emojis */}
      {floats.map(f=>(
        <div key={f.id} className="fixed text-2xl pointer-events-none z-50"
          style={{left:`${f.x}%`,bottom:'10%',animation:'floatUp 2s ease forwards'}}>
          {f.emoji}
        </div>
      ))}

      {phase==='loading' ? (
        <>
          {/* City */}
          <div className="relative mb-10" style={{width:320,height:220}}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
              style={{width:280,height:120,background:'radial-gradient(ellipse,rgba(249,115,22,.14) 0%,transparent 70%)'}}/>
            <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full ground-line"/>
            <Building w={64} h={130} l={128} color="rgba(249,115,22,.13)" border="rgba(249,115,22,.5)"  delay={0}   cols={3} rows={5} scanColor="rgba(249,115,22,.9)"/>
            <Building w={72} h={90}  l={40}  color="rgba(249,115,22,.08)" border="rgba(249,115,22,.3)"  delay={200} cols={3} rows={3} scanColor="rgba(249,115,22,.7)"/>
            <Building w={56} h={75}  l={208} color="rgba(249,115,22,.1)"  border="rgba(249,115,22,.38)" delay={350} cols={2} rows={3} scanColor="rgba(249,115,22,.8)"/>
            <Building w={44} h={55}  l={0}   color="rgba(249,115,22,.06)" border="rgba(249,115,22,.22)" delay={500} cols={2} rows={2} scanColor="rgba(249,115,22,.5)"/>
            <Building w={40} h={50}  l={272} color="rgba(249,115,22,.07)" border="rgba(249,115,22,.22)" delay={450} cols={2} rows={2} scanColor="rgba(249,115,22,.5)"/>
            <div className="absolute crane-swing" style={{bottom:130,left:168,transformOrigin:'bottom center'}}>
              <div className="w-1 h-14 rounded-sm" style={{background:'rgba(249,115,22,.65)'}}/>
              <div className="absolute top-0 rounded-sm" style={{left:-38,width:42,height:3,background:'rgba(249,115,22,.5)'}}/>
              <div className="absolute rounded-sm" style={{top:3,left:-38,width:2,height:16,background:'rgba(249,115,22,.4)',animation:'cloudDrift 1.5s ease-in-out infinite alternate'}}/>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full max-w-xs text-center">
            <div className="relative h-7 overflow-hidden mb-4">
              {steps.map((s,i)=>(
                <div key={i} className="absolute inset-x-0 flex items-center justify-center gap-2 transition-all duration-400"
                  style={{opacity:step===i?1:0,transform:step===i?'translateY(0)':'translateY(-12px)'}}>
                  <span className="text-base">{s.icon}</span>
                  <span className="text-[13px] font-semibold tracking-wide" style={{color:'rgba(249,115,22,.9)'}}>{s.text}</span>
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-2.5" style={{background:'rgba(249,115,22,.1)'}}>
              <div className="h-full rounded-full progress-bar transition-[width] duration-100 ease-linear" style={{width:`${prog}%`}}/>
            </div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-[11px] font-bold m-0" style={{color:'rgba(249,115,22,.55)'}}>{Math.round(prog)}%</p>
              <p className="text-[10px] text-slate-600 m-0">Please wait…</p>
            </div>
            <p className="font-black text-2xl text-white mb-1.5 m-0" style={{fontFamily:"'Sora',sans-serif"}}>Building Your Profile</p>
            <p className="text-xs m-0" style={{color:'rgba(100,116,139,.75)'}}>One moment — something great is being built for you ✦</p>
          </div>
        </>
      ) : (
        /* SUCCESS SCREEN */
        <div className="w-full max-w-sm text-center fade-up">
          {/* Particles */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {particles.map((p,i)=>(
              <div key={i} className="absolute rounded-full"
                style={{top:'50%',left:'50%',width:p.size,height:p.size,background:p.color,
                  '--tx':p.tx,'--ty':p.ty,animation:`burst .9s ease ${p.delay} both`}}/>
            ))}
            {/* Ripple rings */}
            {[0,200,400].map(d=>(
              <div key={d} className="absolute inset-0 rounded-full border-2"
                style={{borderColor:'rgba(249,115,22,.4)',animation:`ripple 1.2s ease ${d}ms infinite`}}/>
            ))}
            {/* Check circle */}
            <div className="absolute inset-4 rounded-full flex items-center justify-center success-pop"
              style={{background:'linear-gradient(135deg,#f97316,#ea580c)',boxShadow:'0 0 40px rgba(249,115,22,.6)'}}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path className="check-draw" d="M10 20 L17 27 L30 14" stroke="white" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.3)'}}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"/>
            <span className="text-[11px] font-bold tracking-wider uppercase text-green-400">Registration Successful</span>
          </div>

          <h2 className="font-black text-3xl text-white m-0 mb-2" style={{fontFamily:"'Sora',sans-serif"}}>
            Welcome,{name?` ${name.split(' ')[0]}!`:'!'} 🎉
          </h2>
          <p className="text-sm mb-6 m-0" style={{color:'rgba(100,116,139,.85)'}}>
            You're on the waitlist. We'll contact you on priority when we launch.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              {icon:'📧',label:'Email Sent',sub:'Check inbox'},
              {icon:'🔔',label:'Priority',sub:'Early access'},
              {icon:'🏙️',label:'Your City',sub:'We`re coming'},
            ].map(c=>(
              <div key={c.label} className="py-3 px-2 rounded-2xl text-center"
                style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)'}}>
                <div className="text-xl mb-1">{c.icon}</div>
                <p className="text-white text-[11px] font-bold m-0">{c.label}</p>
                <p className="text-slate-600 text-[10px] m-0">{c.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-[11px]" style={{color:'rgba(100,116,139,.5)'}}>
            Redirecting to home…
          </p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  MAIN REGISTER PAGE
// ─────────────────────────────────────────────────────────────
export default function Register() {
  const nav   = useNavigate()
  const toast = useToast()

  const [f, setF] = useState({
    name:'', phone:'', whatsapp:'', email:'',
    pin:'', area:'', city:'', district:'', state:'', country:'India',
    userType:'', otherRole:'', size:'', source:'', suggestion:'',
  })
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [err,     setErr]     = useState({})
  const [pinSt,   setPinSt]   = useState('idle')
  const [offices, setOffices] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitDone, setSubmitDone] = useState(false)
  const pinTimer = useRef(null)

  const upd = (k,v) => { setF(x=>({...x,[k]:v})); setErr(e=>({...e,[k]:''})) }
  const inp = e => upd(e.target.name, e.target.value)

  useEffect(()=>{ if(sameAsPhone) upd('whatsapp',f.phone) },[sameAsPhone,f.phone])

  const phoneSt = !f.phone ? null : f.phone.length<10 ? 'mid' : /^[6-9]\d{9}$/.test(f.phone) ? 'ok' : 'bad'
  const waSt    = !f.whatsapp ? null : f.whatsapp.length<10 ? 'mid' : /^[6-9]\d{9}$/.test(f.whatsapp) ? 'ok' : 'bad'
  const emailSt = !f.email ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) ? 'ok' : 'bad'
  const nameSt  = !f.name ? null : f.name.trim().length>=2 ? 'ok' : 'bad'

  const fetchPin = async (pin) => {
    if(!/^\d{6}$/.test(pin)) return
    setPinSt('loading'); setOffices([])
    try {
      const res  = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
      const data = await res.json()
      if(data[0]?.Status==='Success' && data[0]?.PostOffice?.length) {
        const list=data[0].PostOffice, first=list[0]
        setF(x=>({...x,district:first.District||'',state:first.State||'',country:first.Country||'India',
          city:first.Division||first.District||'',area:list.length===1?first.Name:''}))
        setOffices(list.map(o=>o.Name))
        setPinSt('ok')
        setErr(e=>({...e,pin:'',city:'',district:'',state:''}))
        toast.pin('Pincode Found!',`${first.District}, ${first.State} • ${list.length} post office${list.length>1?'s':''}`)
      } else { setPinSt('bad'); toast.err('Invalid Pincode','Fill address manually below.') }
    } catch { setPinSt('bad'); toast.err('Network Error','Check connection & retry.') }
  }

  useEffect(()=>{
    clearTimeout(pinTimer.current)
    if(/^\d{6}$/.test(f.pin)) pinTimer.current=setTimeout(()=>fetchPin(f.pin),400)
    if(f.pin.length<6){ setPinSt('idle'); setOffices([]) }
  },[f.pin])

  // ✅ FIXED: sendToSheets using FormData + no-cors
  const sendToSheets = async (data) => {
    try {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))

      await fetch(SHEETS_URL, {
        method: 'POST',
        mode:   'no-cors',   // ← Required for Google Apps Script
        body:   formData,
      })

      // no-cors gives opaque response — assume success if no error thrown
      return true
    } catch (err) {
      console.error('❌ Sheet error:', err)
      return false
    }
  }

  const validate = () => {
    const e = {}
    if(!f.name.trim())                      e.name      = 'Name is required'
    if(phoneSt!=='ok')                      e.phone     = 'Valid 10-digit number required'
    if(!f.whatsapp.trim())                  e.whatsapp  = 'WhatsApp number is required'
    else if(waSt!=='ok'&&waSt!=='mid')      e.whatsapp  = 'Valid 10-digit WhatsApp number'
    if(!f.email.trim())                     e.email     = 'Email is required'
    else if(emailSt!=='ok')                 e.email     = 'Invalid email address'
    if(!/^\d{6}$/.test(f.pin))             e.pin       = '6-digit pincode required'
    if(!f.city.trim())                      e.city      = 'City is required'
    if(!f.district.trim())                  e.district  = 'District is required'
    if(!f.state.trim())                     e.state     = 'State is required'
    if(!f.userType)                         e.userType  = 'Select your role'
    if(f.userType==='Other'&&!f.otherRole.trim()) e.otherRole = 'Describe your role'
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if(Object.keys(errs).length) {
      setErr(errs)
      toast.err('Check Form',`${Object.keys(errs).length} field${Object.keys(errs).length>1?'s':''} need attention`)
      document.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.scrollIntoView({behavior:'smooth',block:'center'})
      return
    }

    setLoading(true)
    window.scrollTo({top:0,behavior:'smooth'})

    const payload = {
      timestamp : new Date().toLocaleString('en-IN'),
      name      : f.name.trim(),
      phone     : '+91' + f.phone,
      whatsapp  : '+91' + f.whatsapp,
      email     : f.email.trim(),
      pincode   : f.pin,
      area      : f.area.trim() || '—',
      city      : f.city.trim(),
      district  : f.district.trim(),
      state     : f.state.trim(),
      country   : f.country.trim(),
      userType  : f.userType==='Other' ? f.otherRole.trim() : f.userType,
      budget    : f.size   || '—',
      source    : f.source || '—',
      suggestion: f.suggestion.trim() || '—',
    }

    await sendToSheets(payload)

    // Show success screen, then navigate
    setSubmitDone(true)
    setTimeout(()=>{
      nav('/thank-you',{
        state:{
          name:f.name, city:f.city, state:f.state,
          userType:f.userType, pin:f.pin, suggestion:f.suggestion
        }
      })
    },3800)
  }

  if(loading) return <SubmitAnimation name={f.name}/>

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{background:'#070d18',fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{ANIM_CSS}</style>
      <Toasts list={toast.list}/>

      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background:`radial-gradient(ellipse 100% 60% at 50% -10%,rgba(249,115,22,.07) 0%,transparent 60%),
                   radial-gradient(ellipse 50% 40% at 85% 85%,rgba(59,130,246,.04) 0%,transparent 50%)`}}/>
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{backgroundImage:'radial-gradient(rgba(249,115,22,.2) 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>

      {/* Header */}
      <header className="max-w-[720px] mx-auto px-5 py-5 flex items-center justify-between relative z-20">
        <button onClick={()=>nav('/')} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0">
          <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center"
            style={{background:'linear-gradient(135deg,#f97316,#c2410c)',boxShadow:'0 4px 20px rgba(249,115,22,.4)'}}>
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <div>
            <p className="font-black text-white text-sm m-0 leading-tight" style={{fontFamily:"'Sora',sans-serif"}}>Our City Nirman</p>
            <p className="m-0 text-[9px] tracking-[.15em] uppercase" style={{color:'rgba(249,115,22,.5)'}}>Pvt. Ltd.</p>
          </div>
        </button>
        <button onClick={()=>nav('/')}
          className="bg-transparent border-0 text-slate-500 text-[13px] cursor-pointer px-2.5 py-1.5 rounded-lg transition-colors hover:text-orange-400">
          ← Home
        </button>
      </header>

      {/* Hero */}
      <div className="fade-up text-center px-5 pb-8 max-w-[520px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{background:'rgba(249,115,22,.08)',border:'1px solid rgba(249,115,22,.2)'}}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{background:'#f97316'}}/>
          <span className="text-[11px] font-bold tracking-[.08em] uppercase" style={{color:'#fb923c'}}>Early Access Registration</span>
        </div>
        <h1 className="font-black text-white m-0 mb-2 leading-tight"
          style={{fontFamily:"'Sora',sans-serif",fontSize:'clamp(28px,5vw,40px)'}}>
          Register Now  {' '}
          <span style={{background:'linear-gradient(135deg,#f97316,#fb923c)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
           Our City Nirman 
          </span>
        </h1>
        <p className="text-sm m-0" style={{color:'rgba(100,116,139,.85)'}}>Register now — get priority access when we launch.</p>
      </div>

      {/* Form */}
      <main className="max-w-[720px] mx-auto px-4 pb-20 relative z-10">
        <div className="rounded-[20px] p-6 sm:p-7"
          style={{background:'rgba(255,255,255,.025)',border:'1px solid rgba(255,255,255,.06)',backdropFilter:'blur(12px)'}}>
          <form onSubmit={submit} noValidate className="flex flex-col gap-7">

            {/* ── Personal Info ── */}
            <SectionHead icon="👤" label="Personal Info"/>
            <div className="flex flex-col gap-4">
              <FInput label="Full Name *" name="name" value={f.name} onChange={inp} status={nameSt} error={err.name} autoComplete="name"/>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <div className="shrink-0 px-3 rounded-xl flex items-center text-slate-400 text-[13px] font-bold min-w-[52px] justify-center"
                      style={{background:'rgba(255,255,255,.03)',border:'1.5px solid rgba(255,255,255,.07)'}}>+91</div>
                    <div className="flex-1">
                      <FInput label="Mobile No. *" name="phone" value={f.phone} onChange={inp}
                        type="tel" maxLength={10} status={phoneSt==='mid'?null:phoneSt}
                        error={err.phone} autoComplete="tel" inputMode="numeric"/>
                    </div>
                  </div>
                  {!err.phone && phoneSt==='ok'  && <p className="text-[11px] m-0" style={{color:'#4ade80'}}>✓ Valid number</p>}
                  {!err.phone && phoneSt==='bad' && <p className="text-[#f87171] text-[11px] m-0">⚠ Must start 6–9, 10 digits</p>}
                  {!err.phone && phoneSt==='mid' && <p className="text-slate-500 text-[11px] m-0">{f.phone.length}/10</p>}
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none mb-1">
                    <input type="checkbox" checked={sameAsPhone} onChange={e=>setSameAsPhone(e.target.checked)}
                      className="w-3.5 h-3.5 cursor-pointer accent-orange-500"/>
                    <span className="text-[11px] text-slate-400">Same as phone number</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="shrink-0 px-2.5 rounded-xl flex items-center min-w-[52px] justify-center text-base"
                      style={{background:'rgba(37,211,102,.07)',border:'1.5px solid rgba(37,211,102,.2)'}}>📱</div>
                    <div className="flex-1">
                      <FInput label="WhatsApp No. *" name="whatsapp" value={f.whatsapp}
                        onChange={sameAsPhone?undefined:inp} disabled={sameAsPhone}
                        type="tel" maxLength={10} status={waSt==='mid'?null:waSt}
                        error={err.whatsapp} inputMode="numeric"/>
                    </div>
                  </div>
                  {!err.whatsapp && waSt==='ok'  && <p className="text-[11px] m-0" style={{color:'#4ade80'}}>✓ Valid WhatsApp</p>}
                  {!err.whatsapp && waSt==='bad' && <p className="text-[#f87171] text-[11px] m-0">⚠ Must start 6–9, 10 digits</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <FInput label="Email Address *" name="email" value={f.email} onChange={inp}
                  type="email" status={emailSt} error={err.email} autoComplete="email"/>
                {!err.email && emailSt==='ok'  && <p className="text-[11px] m-0" style={{color:'#4ade80'}}>✓ Valid email</p>}
                {!err.email && emailSt==='bad' && <p className="text-[#f87171] text-[11px] m-0">⚠ e.g. name@gmail.com</p>}
              </div>
            </div>

            {/* ── Address ── */}
            <SectionHead icon="📮" label="Address"/>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex gap-2.5">
                  <div className="relative flex-1">
                    <input name="pin" value={f.pin} type="tel" maxLength={6}
                      onChange={e=>upd('pin',e.target.value.replace(/\D/g,'').slice(0,6))}
                      placeholder="Enter 6-digit Pincode"
                      className="w-full outline-none transition-all duration-200"
                      style={{padding:'18px 48px 18px 20px',borderRadius:12,background:'rgba(249,115,22,.04)',
                        color:'white',fontSize:22,fontWeight:800,letterSpacing:'.3em',fontFamily:'inherit',
                        border:`2px solid ${pinSt==='ok'?'#22c55e':pinSt==='bad'?'#ef4444':pinSt==='loading'?'#f97316':'rgba(249,115,22,.25)'}`,
                        boxShadow:pinSt==='ok'?'0 0 0 3px rgba(34,197,94,.12)':pinSt==='loading'?'0 0 0 3px rgba(249,115,22,.14)':'none'}}/>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      {pinSt==='loading' && <svg className="spin-anim" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(249,115,22,.3)" strokeWidth="4"/><path fill="#f97316" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                      {pinSt==='ok'  && <span className="font-black text-green-400 text-lg">✓</span>}
                      {pinSt==='bad' && <span className="font-black text-red-400 text-lg">✗</span>}
                    </span>
                  </div>
                  <button type="button" onClick={()=>fetchPin(f.pin)} disabled={f.pin.length!==6||pinSt==='loading'}
                    className="px-5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 shrink-0"
                    style={{border:'1.5px solid rgba(249,115,22,.35)',background:'rgba(249,115,22,.07)',color:'#fb923c',
                      fontFamily:'inherit',opacity:f.pin.length!==6?.4:1}}>
                    {pinSt==='loading'?'…':'Search'}
                  </button>
                </div>
                <div className="mt-1.5 ml-1 text-[11px]">
                  {pinSt==='idle'&&f.pin.length>0&&f.pin.length<6 && <span className="text-slate-500">{f.pin.length}/6 digits</span>}
                  {pinSt==='loading' && <span className="flex items-center gap-1.5" style={{color:'rgba(249,115,22,.85)'}}><span className="w-1.5 h-1.5 rounded-full inline-block pulse-dot" style={{background:'#f97316'}}/>Fetching address data…</span>}
                  {pinSt==='bad'  && <span className="text-red-400">⚠ Not found — fill address manually below</span>}
                  {err.pin && <span className="text-red-400">⚠ {err.pin}</span>}
                </div>
                {pinSt==='ok' && (
                  <div className="slide-down mt-3 flex flex-col gap-2">
                    <PinBadge pin={f.pin} district={f.district} state={f.state} count={offices.length}/>
                    {offices.length>1 && (
                      <div>
                        <p className="text-[11px] text-slate-500 mb-2 mt-1 m-0">Select your post office:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {offices.map(o=>(
                            <button key={o} type="button" onClick={()=>upd('area',o)}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all duration-200"
                              style={{fontFamily:'inherit',
                                border:f.area===o?'1px solid rgba(249,115,22,.5)':'1px solid rgba(255,255,255,.08)',
                                background:f.area===o?'rgba(249,115,22,.15)':'rgba(255,255,255,.03)',
                                color:f.area===o?'#fb923c':'rgba(148,163,184,.7)'}}>
                              {o}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <FInput label="Area / Colony / Locality (optional)" name="area" value={f.area} onChange={inp}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FInput label="City / Division *" name="city" value={f.city} onChange={inp} status={f.city&&pinSt==='ok'?'ok':null} error={err.city}/>
                <FInput label="District *" name="district" value={f.district} onChange={inp} status={f.district&&pinSt==='ok'?'ok':null} error={err.district}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FInput label="State *" name="state" value={f.state} onChange={inp} status={f.state&&pinSt==='ok'?'ok':null} error={err.state}/>
                <FInput label="Country" name="country" value={f.country} onChange={inp}/>
              </div>
            </div>

            {/* ── Project Details ── */}
            <SectionHead icon="🏗️" label="Project Details"/>
            <div className="flex flex-col gap-5">

              {/* User Type */}
              <div>
                <p className="text-[11px] font-bold tracking-[.12em] uppercase m-0 mb-2.5" style={{color:'rgba(100,116,139,.75)'}}>
                  I Am A… <span style={{color:'#f97316'}}>*</span>
                </p>
                <div className="grid gap-2" style={{gridTemplateColumns:'repeat(5,1fr)'}}>
                  {USER_TYPES.map(({v,e})=>(
                    <Pill key={v} on={f.userType===v}
                      onClick={()=>{ upd('userType',v); if(v!=='Other') upd('otherRole','') }}>
                      <div className="flex flex-col items-center gap-1.5 py-0.5">
                        <span className="text-xl">{e}</span>
                        <span className="text-[10px] leading-none">{v}</span>
                      </div>
                    </Pill>
                  ))}
                </div>
                {err.userType && <p className="text-[#f87171] text-[11px] mt-1.5 ml-0.5 m-0">⚠ {err.userType}</p>}

                {/* ✅ Other — custom role input */}
                {f.userType==='Other' && (
                  <div className="slide-down mt-3">
                    <FInput label="Describe your role *" name="otherRole" value={f.otherRole}
                      onChange={inp} error={err.otherRole}/>
                    {f.otherRole && (
                      <p className="text-[11px] mt-1 m-0" style={{color:'rgba(249,115,22,.7)'}}>
                        ✦ Will be saved as: "{f.otherRole}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Budget */}
              <div>
                <p className="text-[11px] font-bold tracking-[.12em] uppercase m-0 mb-2.5" style={{color:'rgba(100,116,139,.75)'}}>
                  Budget / Project Size <span className="normal-case tracking-normal text-[10px] text-slate-600">(optional)</span>
                </p>
                <div className="grid gap-1.5" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
                  {SIZES.map(s=>(
                    <Pill key={s} on={f.size===s} onClick={()=>upd('size',s)}>
                      <span className="block py-1 text-[10px]">{s}</span>
                    </Pill>
                  ))}
                </div>
                {f.size && <p className="text-[11px] mt-1.5 ml-0.5 m-0" style={{color:'rgba(249,115,22,.75)'}}>✦ Selected: {f.size}</p>}
              </div>

              <FSelect label="How Did You Hear? (optional)" name="source" value={f.source} onChange={inp} options={SOURCES}/>

              {/* Suggestion */}
              <div>
                <p className="text-[11px] font-bold tracking-[.12em] uppercase m-0 mb-2.5" style={{color:'rgba(100,116,139,.75)'}}>
                  Suggestions / Feedback <span className="normal-case tracking-normal text-[10px] text-slate-600">(optional)</span>
                </p>
                <FTextarea label="What features would you like to see?" name="suggestion" value={f.suggestion} onChange={inp}
                  placeholder="e.g. Live vendor pricing, EMI options, local material brands…"/>
                {f.suggestion.length>0 && (
                  <p className="text-[11px] mt-1 text-right m-0" style={{color:'rgba(249,115,22,.5)'}}>{f.suggestion.length} chars</p>
                )}
              </div>
            </div>

            {/* ── Submit ── */}
            <div>
              <div className="h-px mb-6" style={{background:'linear-gradient(90deg,transparent,rgba(249,115,22,.2),transparent)'}}/>
              <button type="submit"
                className="w-full py-[17px] rounded-2xl border-0 text-white text-[15px] font-black cursor-pointer transition-all duration-200 tracking-wide shimmer-btn"
                style={{boxShadow:'0 4px 32px rgba(249,115,22,.35)',fontFamily:"'DM Sans',sans-serif"}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 48px rgba(249,115,22,.55)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 32px rgba(249,115,22,.35)'}}>
                Register — Get Early Access ✦
              </button>
              <p className="text-center text-[11px] mt-3 mb-0" style={{color:'rgba(71,85,105,.8)'}}>
                🔒 100% secure · No spam · No sharing
              </p>
            </div>

          </form>
        </div>

        <div className="mt-4 px-5 py-3.5 rounded-2xl flex flex-wrap gap-3 items-center justify-between"
          style={{background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.05)'}}>
          <p className="text-[13px] m-0" style={{color:'rgba(71,85,105,.8)'}}>Need help?</p>
          <a href="tel:+919065813209" className="no-underline text-[13px]" style={{color:'rgba(249,115,22,.75)'}}>📞 +91 90658 13209</a>
        </div>
      </main>
    </div>
  )
}