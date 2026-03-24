import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef, useMemo, useCallback } from 'react'

// ── CANVAS FIREWORKS ──────────────────────────────────────────────────────────
function Fireworks() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    window.addEventListener('resize', () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight })

    const COLORS = ['#f97316','#fb923c','#fbbf24','#34d399','#60a5fa','#a78bfa','#f472b6','#e11d48','#fff']
    const particles = []
    const rockets   = []

    function makeExplosion(x, y) {
      const color = COLORS[Math.floor(Math.random()*COLORS.length)]
      for (let i=0; i<80; i++) {
        const angle = (i/80)*Math.PI*2
        const speed = 1 + Math.random()*5
        particles.push({
          x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
          life:1, decay:.012+Math.random()*.015, size:2+Math.random()*3,
          color, trail:[], gravity:.05,
        })
      }
      for (let i=0; i<20; i++) {
        particles.push({
          x, y, vx:(Math.random()-.5)*8, vy:(Math.random()-.5)*8,
          life:1, decay:.008, size:1+Math.random()*2, color:'#fbbf24', trail:[],gravity:.03,
        })
      }
    }

    function makeRocket() {
      const x = W * (.15 + Math.random()*.7)
      rockets.push({
        x, y:H, vy:-(8+Math.random()*6), targetY:H*(.1+Math.random()*.4),
        trail:[], exploded:false,
      })
    }

    const confetti = Array.from({length:200},()=>({
      x:Math.random()*W, y:-10-Math.random()*H*.5,
      w:5+Math.random()*9, h:7+Math.random()*7,
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
      speed:1.5+Math.random()*3, angle:Math.random()*Math.PI*2,
      spin:(Math.random()-.5)*.14, drift:(Math.random()-.5)*1.4,
      wave:Math.random()*Math.PI*2, waveSpd:.02+Math.random()*.03,
      opacity:.7+Math.random()*.3, shape:Math.random()>.5?'rect':'circle', r:3+Math.random()*4,
    }))

    let raf, t=0
    const launchTimes = [0,800,1600,2500,3500,4800,6200,7800]
    let launched = 0

    const draw = () => {
      ctx.clearRect(0,0,W,H)
      t += 16

      if (launched < launchTimes.length && t > launchTimes[launched]) {
        makeRocket(); launched++
      }

      rockets.forEach(r => {
        if (r.exploded) return
        r.trail.push({x:r.x, y:r.y})
        if (r.trail.length > 12) r.trail.shift()
        r.y += r.vy; r.vy += .08
        if (r.y <= r.targetY) { r.exploded=true; makeExplosion(r.x, r.y) }
        r.trail.forEach((pt,i) => {
          const a = i/r.trail.length
          ctx.save(); ctx.globalAlpha=a*.8; ctx.fillStyle='#fb923c'
          ctx.beginPath(); ctx.arc(pt.x, pt.y, a*2.5, 0, Math.PI*2); ctx.fill(); ctx.restore()
        })
      })

      for (let i=particles.length-1; i>=0; i--) {
        const p=particles[i]
        p.trail.push({x:p.x,y:p.y})
        if (p.trail.length>6) p.trail.shift()
        p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=.98; p.life-=p.decay
        if (p.life<=0) { particles.splice(i,1); continue }
        p.trail.forEach((pt,ti) => {
          const a=(ti/p.trail.length)*p.life*.5
          ctx.save(); ctx.globalAlpha=a; ctx.fillStyle=p.color
          ctx.beginPath(); ctx.arc(pt.x,pt.y,p.size*(ti/p.trail.length),0,Math.PI*2); ctx.fill(); ctx.restore()
        })
        ctx.save(); ctx.globalAlpha=p.life; ctx.fillStyle=p.color
        ctx.shadowColor=p.color; ctx.shadowBlur=8
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore()
      }

      confetti.forEach(c => {
        c.y+=c.speed; c.x+=c.drift+Math.sin(c.wave)*.5; c.wave+=c.waveSpd; c.angle+=c.spin
        if (c.y>H+20){c.y=-20;c.x=Math.random()*W}
        ctx.save(); ctx.globalAlpha=c.opacity; ctx.fillStyle=c.color
        ctx.translate(c.x,c.y); ctx.rotate(c.angle)
        if (c.shape==='rect') ctx.fillRect(-c.w/2,-c.h/2,c.w,c.h)
        else { ctx.beginPath(); ctx.arc(0,0,c.r,0,Math.PI*2); ctx.fill() }
        ctx.restore()
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    const stop = setTimeout(()=>cancelAnimationFrame(raf), 10000)
    return ()=>{ cancelAnimationFrame(raf); clearTimeout(stop) }
  }, [])

  return <canvas ref={ref} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:5}}/>
}

// ── ANIMATED NUMBER ───────────────────────────────────────────────────────────
function AnimNum({ to, dur=1500, suffix='' }) {
  const [v, setV] = useState(0)
  useEffect(()=>{
    let start=null
    const step=ts=>{
      if(!start)start=ts
      const p=Math.min((ts-start)/dur,1)
      setV(Math.floor(p*to))
      if(p<1)requestAnimationFrame(step)
    }
    const t=setTimeout(()=>requestAnimationFrame(step),1000)
    return ()=>clearTimeout(t)
  },[to,dur])
  return <>{v.toLocaleString()}{suffix}</>
}

// ── COUNTDOWN RING ────────────────────────────────────────────────────────────
function CountdownRing({ total, current }) {
  const r = 22, circ = 2*Math.PI*r
  const progress = (current/total)*circ
  return (
    <svg width="56" height="56" style={{transform:'rotate(-90deg)'}}>
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(249,115,22,.15)" strokeWidth="3"/>
      <circle cx="28" cy="28" r={r} fill="none" stroke="#f97316" strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={circ-progress}
        style={{transition:'stroke-dashoffset .8s ease',strokeLinecap:'round'}}/>
    </svg>
  )
}

const WISH = {
  Homeowner:  { emoji:'🏠', msg:'May your dream home be everything you\'ve imagined — strong, beautiful, and yours.', color:'#60a5fa' },
  Vendor:     { emoji:'🏪', msg:'Here\'s to growing your business with thousands of verified customers — success awaits!', color:'#34d399' },
  Contractor: { emoji:'👷', msg:'To more projects, bigger builds, and a platform that always has your back. Let\'s build!', color:'#f97316' },
  Architect:  { emoji:'📐', msg:'May every design you create become a landmark that people admire for generations.', color:'#a78bfa' },
  Other:      { emoji:'✨', msg:'Whoever you are, whatever you build — we\'re honoured to have you on this journey.', color:'#fbbf24' },
}

function Step({ icon, title, desc, delay }) {
  return (
    <div style={{display:'flex',gap:14,alignItems:'flex-start',opacity:0,animation:`slideIn .5s ease ${delay}ms both`}}>
      <div style={{width:36,height:36,borderRadius:10,background:'rgba(249,115,22,.1)',border:'1px solid rgba(249,115,22,.22)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:16}}>
        {icon}
      </div>
      <div style={{textAlign:'left'}}>
        <p style={{color:'white',fontSize:13,fontWeight:700,margin:'0 0 2px'}}>{title}</p>
        <p style={{color:'rgba(100,116,139,.8)',fontSize:12,margin:0,lineHeight:1.5}}>{desc}</p>
      </div>
    </div>
  )
}

function AnimIcon() {
  return (
    <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:120,height:120}}>
      {[1,2,3].map(i=>(
        <div key={i} style={{
          position:'absolute', borderRadius:'50%',
          width:40+i*30, height:40+i*30,
          border:`1px solid rgba(249,115,22,${.35-i*.08})`,
          animation:`ringPop .6s cubic-bezier(.34,1.56,.64,1) ${i*.12}s both`,
        }}/>
      ))}
      {[1,2].map(i=>(
        <div key={i} style={{
          position:'absolute', borderRadius:'50%',
          width:80+i*20, height:80+i*20,
          border:'1px solid rgba(249,115,22,.15)',
          animation:`pulsRing 2.5s ease-in-out ${i*.6}s infinite`,
        }}/>
      ))}
      <div style={{
        width:80, height:80, borderRadius:'50%', position:'relative', zIndex:2,
        background:'linear-gradient(135deg,rgba(249,115,22,.3),rgba(234,88,12,.18))',
        border:'2px solid rgba(249,115,22,.5)',
        boxShadow:'0 0 60px rgba(249,115,22,.4),inset 0 0 30px rgba(249,115,22,.1)',
        display:'flex', alignItems:'center', justifyContent:'center',
        animation:'iconPop .7s cubic-bezier(.34,1.56,.64,1) .1s both',
      }}>
        <svg viewBox="0 0 48 48" width="52" height="52">
          <rect x="8" y="20" width="32" height="24" rx="2" fill="rgba(249,115,22,.1)" stroke="rgba(249,115,22,.6)" strokeWidth="1.5" style={{opacity:0,animation:'svgRise .4s ease .3s both'}}/>
          <rect x="15" y="10" width="18" height="12" rx="1.5" fill="rgba(249,115,22,.12)" stroke="rgba(249,115,22,.7)" strokeWidth="1.5" style={{opacity:0,animation:'svgRise .4s ease .5s both'}}/>
          {[12,20,28].map(x=><rect key={x} x={x} y={24} width={5} height={5} rx="1" fill="rgba(251,191,36,.8)" style={{opacity:0,animation:`svgRise .3s ease ${.65+x*.005}s both`}}/>)}
          {[12,20,28].map(x=><rect key={x+'b'} x={x} y={32} width={5} height={5} rx="1" fill="rgba(251,191,36,.5)" style={{opacity:0,animation:`svgRise .3s ease ${.75+x*.005}s both`}}/>)}
          {[18,25].map(x=><rect key={x} x={x} y={13} width={4} height={4} rx="1" fill="rgba(249,115,22,.9)" style={{opacity:0,animation:`svgRise .3s ease ${.85+x*.005}s both`}}/>)}
          <polygon points="24,3 31,10 17,10" fill="rgba(249,115,22,.8)" style={{opacity:0,animation:'svgRise .3s ease .7s both'}}/>
          <circle cx="36" cy="12" r="8" fill="#22c55e" style={{opacity:0,animation:'checkPop .5s cubic-bezier(.34,1.56,.64,1) 1s both'}}/>
          <path d="M32 12l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{strokeDasharray:20,strokeDashoffset:20,animation:'checkDraw .4s ease 1.3s forwards'}}/>
        </svg>
      </div>
    </div>
  )
}

const TOTAL_SECS = 15

export default function ThankYou() {
  const nav      = useNavigate()
  const location = useLocation()

  // ✅ FIX 1: state ko pehle variable mein lo
  const s          = location.state || null
  const name       = s?.name       || 'Friend'
  const city       = s?.city       || ''
  const st         = s?.state      || ''
  const userType   = s?.userType   || 'Homeowner'
  const pin        = s?.pin        || ''
  const suggestion = s?.suggestion || ''

  const [secs, setSecs]       = useState(TOTAL_SECS)
  const [showFX, setShowFX]   = useState(true)
  const [visible, setVisible] = useState(false)

  const regId = useMemo(() => `OCN-${Date.now().toString(36).toUpperCase().slice(-6)}`, [])
  const wish  = WISH[userType] || WISH.Other

  // ✅ FIX 2: stable reference
  const goHome = useCallback(() => nav('/'), [nav])

  // ✅ FIX 3: koi bhi nav() render ke dauran nahi — sab useEffect mein
  useEffect(() => {
    if (!s) {
      nav('/', { replace: true })
      return
    }
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => setShowFX(false), 10000)
    const iv = setInterval(() => setSecs(c => Math.max(c - 1, 0)), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ FIX 4: secs === 0 hone pe navigate — alag useEffect mein
  useEffect(() => {
    if (secs === 0) goHome()
  }, [secs, goHome])

  // Redirect ho raha hai to blank render
  if (!s) return null

  const CSS_TY = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800;900&display=swap');
    *{box-sizing:border-box}
    @keyframes ringPop{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:scale(1)}}
    @keyframes pulsRing{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.15);opacity:.1}}
    @keyframes iconPop{from{opacity:0;transform:scale(0) rotate(-20deg)}to{opacity:1;transform:scale(1) rotate(0)}}
    @keyframes svgRise{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
    @keyframes checkPop{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
    @keyframes checkDraw{to{stroke-dashoffset:0}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:none}}
    @keyframes cardIn{from{opacity:0;transform:translateY(50px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes shimmerMove{from{background-position:300% center}to{background-position:-300% center}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes glowPulse{0%,100%{box-shadow:0 0 30px rgba(249,115,22,.15),0 40px 80px rgba(0,0,0,.5)}50%{box-shadow:0 0 80px rgba(249,115,22,.35),0 40px 80px rgba(0,0,0,.5)}}
    @keyframes badgePop{0%{opacity:0;transform:scale(.5) translateY(8px)}60%{transform:scale(1.08) translateY(-2px)}100%{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes wishIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    @keyframes countPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    @keyframes scanLine{0%{top:0;opacity:.6}100%{top:100%;opacity:0}}
    .shimmer{background:linear-gradient(90deg,#f97316,#fbbf24,#34d399,#f97316,#fb923c);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmerMove 4s linear infinite}
    .card-in{animation:cardIn .8s cubic-bezier(.34,1.2,.64,1) both}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-thumb{background:rgba(249,115,22,.3);border-radius:4px}
  `

  return (
    <div style={{
      minHeight:'100vh', background:'#070d18',
      fontFamily:"'DM Sans',system-ui,sans-serif",
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      padding:'24px 16px 60px', position:'relative', overflowX:'hidden',
    }}>
      <style>{CSS_TY}</style>

      <div style={{position:'fixed',inset:0,pointerEvents:'none'}}>
        <div style={{position:'absolute',top:'5%',left:'50%',transform:'translateX(-50%)',width:700,height:500,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(249,115,22,.07) 0%,transparent 65%)'}}/>
        <div style={{position:'absolute',bottom:0,right:0,width:400,height:400,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(34,197,94,.04) 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',bottom:0,left:0,width:300,height:300,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(59,130,246,.04) 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',inset:0,opacity:.18,backgroundImage:'radial-gradient(rgba(249,115,22,.2) 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
      </div>

      {showFX && <Fireworks/>}

      {visible && (
        <div className="card-in" style={{width:'100%',maxWidth:480,position:'relative',zIndex:20}}>
          <div style={{
            borderRadius:28, overflow:'hidden',
            background:'rgba(8,13,24,.9)',
            border:'1px solid rgba(249,115,22,.18)',
            backdropFilter:'blur(24px)',
            animation:'glowPulse 4s ease-in-out infinite',
          }}>
            <div style={{height:4,background:'linear-gradient(90deg,transparent,#f97316,#fbbf24,#34d399,#fbbf24,#f97316,transparent)'}}/>

            <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden',borderRadius:28,zIndex:30}}>
              <div style={{position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,rgba(249,115,22,.4),transparent)',animation:'scanLine 3s ease-in-out 1s 2'}}/>
            </div>

            <div style={{padding:'36px 28px 32px',display:'flex',flexDirection:'column',alignItems:'center',gap:20,textAlign:'center'}}>

              <div style={{animation:'floatY 4s ease-in-out 2s infinite'}}>
                <AnimIcon/>
              </div>

              <div style={{
                display:'inline-flex',alignItems:'center',gap:8,padding:'7px 18px',
                borderRadius:999, background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.3)',
                animation:'badgePop .6s cubic-bezier(.34,1.56,.64,1) .6s both',opacity:0,
              }}>
                <span style={{width:7,height:7,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 8px #22c55e',animation:'pulsRing 2s infinite'}}/>
                <span style={{color:'#4ade80',fontSize:12,fontWeight:700,letterSpacing:'.05em'}}>Registration Successful ✓</span>
              </div>

              <div style={{opacity:0,animation:'svgRise .6s ease .8s both'}}>
                <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:'clamp(26px,6vw,36px)',fontWeight:900,color:'white',margin:'0 0 6px',lineHeight:1.15}}>
                  Welcome aboard,
                </h1>
                <h2 className="shimmer" style={{fontFamily:"'Sora',sans-serif",fontSize:'clamp(28px,6vw,38px)',fontWeight:900,margin:'0 0 12px',lineHeight:1.1}}>
                  {name}! 🎉
                </h2>
                <p style={{color:'rgba(148,163,184,.7)',fontSize:14,margin:0,lineHeight:1.6,maxWidth:360}}>
                  You're officially on the <strong style={{color:'white'}}>Our City Nirman</strong> early access waitlist. Be ready — something massive is coming!
                </p>
              </div>

              <div style={{
                width:'100%', padding:'16px 20px', borderRadius:16,
                background:`rgba(${wish.color==='#60a5fa'?'59,130,246':wish.color==='#34d399'?'34,197,94':wish.color==='#f97316'?'249,115,22':wish.color==='#a78bfa'?'167,139,250':'251,191,36'},.06)`,
                border:`1px solid ${wish.color}30`,
                opacity:0, animation:'wishIn .6s ease 1s both',
              }}>
                <span style={{fontSize:28,display:'block',marginBottom:8}}>{wish.emoji}</span>
                <p style={{color:wish.color,fontSize:13,fontStyle:'italic',lineHeight:1.6,margin:0,fontWeight:500}}>
                  "{wish.msg}"
                </p>
                <p style={{color:'rgba(100,116,139,.5)',fontSize:10,marginTop:6,letterSpacing:'.05em'}}>— Team Our City Nirman</p>
              </div>

              <div style={{
                width:'100%', padding:'16px 20px', borderRadius:16,
                background:'rgba(249,115,22,.05)', border:'1px solid rgba(249,115,22,.15)',
                opacity:0, animation:'svgRise .5s ease 1.2s both',
              }}>
                <p style={{color:'rgba(100,116,139,.6)',fontSize:10,textTransform:'uppercase',letterSpacing:'.15em',margin:'0 0 4px'}}>Your Registration ID</p>
                <p style={{fontFamily:'monospace',fontWeight:800,fontSize:20,letterSpacing:'.2em',margin:'0 0 4px',
                  background:'linear-gradient(135deg,#f97316,#fbbf24)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  {regId}
                </p>
                <p style={{color:'rgba(71,85,105,.8)',fontSize:11,margin:0}}>📸 Save this screenshot — needed at launch</p>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,width:'100%',opacity:0,animation:'svgRise .5s ease 1.35s both'}}>
                {[
                  { v:<AnimNum to={5000} suffix="+"/>, l:'Vendors' },
                  { v:'100%', l:'Verified' },
                  { v:'24×7', l:'Support' },
                ].map(({v,l})=>(
                  <div key={l} style={{borderRadius:12,padding:'12px 8px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)'}}>
                    <p style={{color:'#f97316',fontWeight:800,fontSize:16,margin:'0 0 2px'}}>{v}</p>
                    <p style={{color:'rgba(71,85,105,.9)',fontSize:11,margin:0}}>{l}</p>
                  </div>
                ))}
              </div>

              <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',opacity:0,animation:'svgRise .5s ease 1.45s both'}}>
                {city && <span style={{padding:'6px 14px',borderRadius:999,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',color:'rgba(148,163,184,.8)',fontSize:12}}>📍 {city}{st?`, ${st}`:''}</span>}
                {userType && <span style={{padding:'6px 14px',borderRadius:999,background:'rgba(249,115,22,.08)',border:'1px solid rgba(249,115,22,.22)',color:'#fb923c',fontSize:12}}>{wish.emoji} {userType}</span>}
                {pin && <span style={{padding:'6px 14px',borderRadius:999,background:'rgba(59,130,246,.07)',border:'1px solid rgba(59,130,246,.2)',color:'#93c5fd',fontSize:12}}>📮 {pin}</span>}
              </div>

              <div style={{width:'100%',padding:'18px 20px',borderRadius:16,background:'rgba(255,255,255,.025)',border:'1px solid rgba(255,255,255,.06)',opacity:0,animation:'svgRise .5s ease 1.55s both'}}>
                <p style={{fontSize:10,fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'rgba(249,115,22,.55)',margin:'0 0 16px',textAlign:'left'}}>What happens next?</p>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <Step icon="📱" title="Launch Notification" desc="You'll get an SMS & notification the moment we go live." delay={1600}/>
                  <Step icon="🎁" title="Early Bird Offer" desc="Exclusive discounts only for our first 1000 users." delay={1750}/>
                  <Step icon="🚀" title="Priority Onboarding" desc="You're in the first batch — skip the queue entirely." delay={1900}/>
                </div>
              </div>

              {suggestion && suggestion.trim().length > 10 && (
                <div style={{width:'100%',padding:'14px 18px',borderRadius:14,background:'rgba(167,139,250,.06)',border:'1px solid rgba(167,139,250,.18)',textAlign:'left',opacity:0,animation:'svgRise .5s ease 1.7s both'}}>
                  <p style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(167,139,250,.6)',margin:'0 0 6px'}}>💡 Your Suggestion</p>
                  <p style={{color:'rgba(148,163,184,.8)',fontSize:12,margin:0,lineHeight:1.6,fontStyle:'italic'}}>"{suggestion}"</p>
                  <p style={{color:'rgba(100,116,109,.5)',fontSize:10,margin:'6px 0 0'}}>We've noted this — thank you for helping us build better!</p>
                </div>
              )}

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,width:'100%',opacity:0,animation:'svgRise .5s ease 1.8s both'}}>
                <a href="tel:+918553866059" style={{padding:'12px 8px',borderRadius:14,textAlign:'center',fontSize:12,fontWeight:600,color:'#fb923c',textDecoration:'none',background:'rgba(249,115,22,.07)',border:'1px solid rgba(249,115,22,.2)',transition:'all .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(249,115,22,.14)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(249,115,22,.07)'}>
                  📞 +91 85538 66059
                </a>
                <a href="https://www.ourcitynirman.in" target="_blank" rel="noopener noreferrer"
                  style={{padding:'12px 8px',borderRadius:14,textAlign:'center',fontSize:12,fontWeight:600,color:'#93c5fd',textDecoration:'none',background:'rgba(59,130,246,.06)',border:'1px solid rgba(59,130,246,.2)',transition:'all .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(59,130,246,.13)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(59,130,246,.06)'}>
                  🌐 ourcitynirman.in
                </a>
              </div>

              <div style={{width:'100%',padding:'14px 18px',borderRadius:14,background:'linear-gradient(135deg,rgba(249,115,22,.08),rgba(234,88,12,.04))',border:'1px solid rgba(249,115,22,.18)',opacity:0,animation:'svgRise .5s ease 1.9s both'}}>
                <p style={{color:'#fb923c',fontSize:14,fontWeight:700,margin:'0 0 3px'}}>🤝 Spread the word!</p>
                <p style={{color:'rgba(71,85,105,.9)',fontSize:12,margin:0}}>More signups = faster launch. Tell your friends & family!</p>
              </div>

              <div style={{width:'100%',opacity:0,animation:'svgRise .5s ease 2s both'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:14}}>
                  <CountdownRing total={TOTAL_SECS} current={secs}/>
                  <div style={{textAlign:'left'}}>
                    <p style={{color:'rgba(249,115,22,.8)',fontSize:13,fontWeight:700,margin:'0 0 1px',animation:'countPulse 1s ease-in-out infinite'}}>
                      Redirecting in {secs}s
                    </p>
                    <p style={{color:'rgba(71,85,105,.7)',fontSize:11,margin:0}}>Auto back to home page</p>
                  </div>
                </div>

                <button onClick={goHome} style={{
                  width:'100%', padding:'16px', borderRadius:14, border:'none',
                  background:'linear-gradient(135deg,#f97316,#ea580c)',
                  color:'white', fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:800,
                  cursor:'pointer', transition:'all .25s', position:'relative', overflow:'hidden',
                  boxShadow:'0 4px 32px rgba(249,115,22,.35)', letterSpacing:'.02em',
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 50px rgba(249,115,22,.55)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 32px rgba(249,115,22,.35)'}}>
                  ← Back to Home
                  <div style={{
                    position:'absolute',bottom:0,left:0,height:3,
                    background:'rgba(255,255,255,.25)',
                    width:`${(secs/TOTAL_SECS)*100}%`,
                    transition:'width .9s linear', borderRadius:3,
                  }}/>
                </button>
              </div>

              <p style={{color:'rgba(30,41,59,.9)',fontSize:11,margin:0}}>
                © Our City Nirman Pvt Ltd · Simanpur, Pirpainti, Bihar 813209
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}