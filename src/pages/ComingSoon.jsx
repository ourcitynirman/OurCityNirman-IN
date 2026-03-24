import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 13.5H5.25L4.5 3zM9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
)

const features = [
  { icon: '📍', title: 'Live Tracking',           desc: 'Real-time construction progress updates' },
  { icon: '🧱', title: 'Book Materials & Workers', desc: 'Verified vendors at your fingertips' },
  { icon: '💰', title: 'Compare Prices',           desc: 'Best rates across multiple suppliers' },
  { icon: '🔒', title: 'Secure Payments',          desc: 'Escrow-backed safe transactions' },
  { icon: '📞', title: '24×7 Support',             desc: 'Expert assistance round the clock' },
  { icon: '🏗️', title: 'Smart Design & Planning',  desc: 'AI-powered blueprint recommendations' },
]

const stats = [
  { value: '5K+',  label: 'Verified Vendors' },
  { value: '100%', label: 'Background Checked' },
  { value: '24×7', label: 'Support Available' },
]

// ── Enhanced CSS injected globally ──────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Sora:wght@700;800;900&display=swap');

:root {
  --orange:     #f97316;
  --orange-dim: rgba(249,115,22,.18);
  --orange-glow:rgba(249,115,22,.35);
  --bg:         #08101f;
  --glass-bg:   rgba(255,255,255,.03);
  --glass-b:    rgba(255,255,255,.07);
}

*, *::before, *::after { box-sizing: border-box }
body { background: var(--bg); margin: 0; font-family: 'DM Sans', sans-serif }

/* ── Fonts ── */
.font-display { font-family: 'Sora', sans-serif }
.font-body    { font-family: 'DM Sans', sans-serif }

/* ── Glass card ── */
.glass-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-b);
  backdrop-filter: blur(14px);
  transition: border-color .3s, background .3s;
}
.glass-card:hover { border-color: rgba(249,115,22,.28) }

/* ── Orange gradient text ── */
.text-gradient-orange {
  background: linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Glow orange ── */
.glow-orange { box-shadow: 0 0 40px rgba(249,115,22,.18), 0 0 80px rgba(249,115,22,.06) }

/* ── Primary button ── */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 28px; border-radius: 50px; border: none; cursor: pointer;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white; font-weight: 700; font-family: 'DM Sans', sans-serif;
  box-shadow: 0 4px 24px rgba(249,115,22,.35);
  transition: transform .2s, box-shadow .2s;
  position: relative; overflow: hidden;
}
.btn-primary::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
  transform: translateX(-100%);
  transition: transform .5s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(249,115,22,.5) }
.btn-primary:hover::before { transform: translateX(100%) }
.btn-primary:active { transform: translateY(0) }

/* ── Feature pill ── */
.feature-pill {
  padding: 6px 14px; border-radius: 50px;
  border: 1px solid rgba(249,115,22,.25);
  background: rgba(249,115,22,.07);
  color: rgba(251,146,60,.9);
  font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif;
}

/* ── Pulse dot ── */
.pulse-dot { animation: pulseDot 2s ease-in-out infinite }
@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.6)} }

/* ── Float ── */
.animate-float { animation: float 5s ease-in-out infinite }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

/* ── Glow pulse ── */
.animate-glow-pulse { animation: glowPulse 3s ease-in-out infinite }
@keyframes glowPulse { 0%,100%{box-shadow:0 0 16px rgba(249,115,22,.3)} 50%{box-shadow:0 0 40px rgba(249,115,22,.7)} }

/* ── Countdown card flip ── */
@keyframes flipIn { 0%{opacity:0;transform:rotateX(-90deg) scale(.8)} 100%{opacity:1;transform:rotateX(0) scale(1)} }
.flip-in { animation: flipIn .4s cubic-bezier(.34,1.56,.64,1) both }

/* ── Scanline ── */
@keyframes scan { 0%{top:0;opacity:.6} 100%{top:100%;opacity:0} }
.scan-line {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(249,115,22,.6), transparent);
  animation: scan 2.5s ease-in-out infinite;
  pointer-events: none;
}

/* ── Shimmer ── */
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.shimmer {
  background: linear-gradient(90deg, rgba(249,115,22,.05) 0%, rgba(249,115,22,.15) 50%, rgba(249,115,22,.05) 100%);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

/* ── Stagger fade ── */
@keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
.stagger > * { animation: fadeSlideUp .6s ease both }
.stagger > *:nth-child(1){animation-delay:.1s}
.stagger > *:nth-child(2){animation-delay:.2s}
.stagger > *:nth-child(3){animation-delay:.3s}
.stagger > *:nth-child(4){animation-delay:.4s}
.stagger > *:nth-child(5){animation-delay:.5s}
.stagger > *:nth-child(6){animation-delay:.6s}

/* ── Number ticker ── */
@keyframes tickDown { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
.tick { animation: tickDown .3s cubic-bezier(.34,1.2,.64,1) both }

/* ── Progress bar ── */
@keyframes progressFill { from{width:0} to{width:var(--w)} }

/* ── Particle ── */
@keyframes particleDrift {
  0%   { opacity: 0; transform: translateY(0) scale(0) }
  20%  { opacity: 1 }
  100% { opacity: 0; transform: translateY(var(--dy)) translateX(var(--dx)) scale(1) }
}

/* ── Badge pulse ring ── */
@keyframes ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
.badge-ring::before {
  content: ''; position: absolute; inset: -4px; border-radius: 50%;
  border: 1px solid rgba(249,115,22,.5);
  animation: ring 2s ease-in-out infinite;
}
`

// ── Countdown Timer (enhanced) ───────────────────────────────
function CountdownTimer() {
  const [time, setTime]     = useState({ days:0, hours:0, minutes:0, seconds:0 })
  const [prev, setPrev]     = useState({ days:0, hours:0, minutes:0, seconds:0 })
  const [ticked, setTicked] = useState({})

  useEffect(() => {
    // 7 days from now
    const target = new Date()
    target.setDate(target.getDate() + 7)

    const tick = () => {
      const diff = target - new Date()
      if (diff <= 0) return
      const next = {
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      }
      setPrev(p => {
        const changed = {}
        Object.keys(next).forEach(k => { if (next[k] !== p[k]) changed[k] = true })
        setTicked(changed)
        setTimeout(() => setTicked({}), 350)
        return next
      })
      setTime(next)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Progress: 7 days = 604800s total
  const totalSecs   = 7 * 24 * 3600
  const remaining   = time.days*86400 + time.hours*3600 + time.minutes*60 + time.seconds
  const progressPct = Math.max(0, Math.min(100, ((totalSecs - remaining) / totalSecs) * 100))

  const units = [
    { label: 'Days',  value: time.days,    key: 'days' },
    { label: 'Hours', value: time.hours,   key: 'hours' },
    { label: 'Mins',  value: time.minutes, key: 'minutes' },
    { label: 'Secs',  value: time.seconds, key: 'seconds' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-3 md:gap-4">
        {units.map(({ label, value, key }) => (
          <div key={label} className="text-center">
            <div className="glass-card relative overflow-hidden w-14 h-14 md:w-[72px] md:h-[72px] flex items-center justify-center rounded-2xl border border-orange-500/20"
              style={{ boxShadow: ticked[key] ? '0 0 20px rgba(249,115,22,.5)' : '0 0 0px transparent', transition: 'box-shadow .3s' }}>
              <div className="scan-line" />
              <span key={`${key}-${value}`}
                className={`text-xl md:text-2xl font-bold text-white font-display ${ticked[key] ? 'tick' : ''}`}>
                {String(value).padStart(2, '0')}
              </span>
              {ticked[key] && (
                <div className="absolute inset-0 bg-orange-500/10 pointer-events-none" />
              )}
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 font-body tracking-wider uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[10px] text-slate-600 mb-1.5 font-body">
          <span>Launch Progress</span>
          <span style={{ color: 'rgba(249,115,22,.7)' }}>{progressPct.toFixed(1)}% elapsed</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.05)' }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#f97316,#fbbf24)', boxShadow: '0 0 8px rgba(249,115,22,.6)' }} />
        </div>
      </div>
    </div>
  )
}

// ── Animated counter (for stats) ─────────────────────────────
function AnimCounter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const num = parseFloat(target)
    if (isNaN(num)) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = num / 40
        const iv = setInterval(() => {
          start = Math.min(start + step, num)
          setVal(Math.round(start))
          if (start >= num) clearInterval(iv)
        }, 30)
      }
    }, { threshold: .5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{val}{suffix}</span>
}

// ── Floating particles background ────────────────────────────
function Particles() {
  const items = useRef(Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x:  Math.random() * 100,
    y:  Math.random() * 100,
    s:  2 + Math.random() * 3,
    dur:`${6 + Math.random() * 8}s`,
    del:`${Math.random() * 6}s`,
    dx: `${(Math.random()-0.5)*120}px`,
    dy: `-${60 + Math.random()*120}px`,
  }))).current

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map(p => (
        <div key={p.id} className="absolute rounded-full"
          style={{ left:`${p.x}%`, top:`${p.y}%`, width:p.s, height:p.s,
            background:`rgba(249,115,22,${.1+Math.random()*.2})`,
            '--dx':p.dx,'--dy':p.dy,
            animation:`particleDrift ${p.dur} ease-in-out ${p.del} infinite` }} />
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export default function ComingSoon() {
  const navigate  = useNavigate()
  const heroRef   = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#08101f' }}>
      <style>{GLOBAL_CSS}</style>

      {/* Particles */}
      <Particles />

      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage:`linear-gradient(rgba(249,115,22,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.035) 1px,transparent 1px)`, backgroundSize:'60px 60px' }}/>

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle,rgba(249,115,22,.07) 0%,transparent 70%)' }}/>
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle,rgba(59,130,246,.05) 0%,transparent 70%)' }}/>
      <div className="fixed top-1/2 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle,rgba(249,115,22,.05) 0%,transparent 70%)' }}/>

      {/* ── NAVBAR ── */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-glow-pulse"
            style={{ background: 'linear-gradient(135deg,#f97316,#c2410c)', boxShadow: '0 4px 20px rgba(249,115,22,.4)' }}>
            <BuildingIcon />
          </div>
          <div>
            <p className="font-display font-bold text-white text-base leading-tight">Our City Nirman</p>
            <p className="text-[10px] font-body tracking-wider uppercase" style={{ color: 'rgba(249,115,22,.6)' }}>Pvt. Ltd.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="badge-ring absolute inline-flex h-full w-full rounded-full" style={{ background: '#f97316' }}/>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#f97316' }}/>
          </span>
          <span className="text-xs font-body tracking-widest uppercase hidden sm:block" style={{ color: 'rgba(249,115,22,.8)' }}>Launching in 7 Days</span>
        </div>

        <button onClick={() => navigate('/register')} className="btn-primary text-sm hidden sm:block">
          <span>Get Early Access</span>
        </button>
      </header>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT */}
          <div className={`space-y-7 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ border: '1px solid rgba(249,115,22,.3)', background: 'rgba(249,115,22,.08)' }}>
              <span className="pulse-dot w-2 h-2 rounded-full" style={{ background: '#f97316' }}/>
              <span className="text-sm font-body font-semibold tracking-wider uppercase" style={{ color: 'rgba(251,146,60,.9)' }}>
                🔥 Only 7 Days Left — Register Now
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-black leading-[1.1] text-white">
              Our City Nirman{' '}
              <span className="block text-gradient-orange">Modern Home App</span>
            </h1>

            <p className="font-body text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
              India's first complete digital platform to{' '}
              <strong className="text-white">build, manage & track</strong>{' '}
              your home construction — all from one powerful app. Verified vendors, live progress, smart planning.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {['🏠 Build', '📊 Manage', '📍 Track'].map(item => (
                <div key={item} className="glass-card px-3 py-3 text-center rounded-xl shimmer">
                  <span className="text-sm text-slate-300 font-body font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {['🤖 Android', '🍎 iOS', '🌐 Web App'].map(p => (
                <span key={p} className="feature-pill">{p}</span>
              ))}
            </div>

            <div>
              <p className="text-xs text-slate-500 font-body mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="inline-block w-4 h-px" style={{ background: 'rgba(249,115,22,.4)' }}/>
                Launching in
                <span className="inline-block w-4 h-px" style={{ background: 'rgba(249,115,22,.4)' }}/>
              </p>
              <CountdownTimer />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={() => navigate('/register')} className="btn-primary text-base">
                <span>🚀 Register Now — Get Early Access</span>
              </button>
              <a href="tel:+918553866059"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-body text-sm transition-all duration-300"
                style={{ border: '1px solid rgba(100,116,139,.4)', color: '#94a3b8' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(249,115,22,.4)'; e.currentTarget.style.color='#fb923c' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(100,116,139,.4)'; e.currentTarget.style.color='#94a3b8' }}>
                📞 Contact Us
              </a>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex -space-x-2">
                {['🧑','👩','👨','🧑‍💼','👩‍💼'].map((e,i)=>(
                  <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2"
                    style={{ borderColor:'#08101f', background: `hsl(${i*40+20},60%,25%)` }}>{e}</div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i=><span key={i} className="text-xs" style={{ color: '#f97316' }}>★</span>)}
                </div>
                <p className="text-[11px] text-slate-500 font-body m-0">
                  <strong className="text-white">500+</strong> people already registered
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — App Card */}
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative animate-float">
              <div className="absolute -inset-4 rounded-3xl blur-2xl"
                style={{ background: 'radial-gradient(ellipse,rgba(249,115,22,.2) 0%,rgba(59,130,246,.08) 100%)' }}/>

              <div className="glass-card glow-orange relative p-8 max-w-sm w-full rounded-2xl">

                {/* Urgency banner */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-body whitespace-nowrap"
                  style={{ background: 'linear-gradient(90deg,#dc2626,#f97316)', color: 'white', boxShadow: '0 4px 14px rgba(239,68,68,.4)' }}>
                  <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-white"/>
                  ⚡ Closing in 7 Days
                </div>

                <div className="flex items-center gap-4 mb-8 mt-2">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg animate-glow-pulse"
                    style={{ background: 'linear-gradient(135deg,#f97316,#c2410c)' }}>
                    <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg leading-tight">Our City Nirman</h3>
                    <p className="font-body text-xs mt-0.5" style={{ color: '#fb923c' }}>Modern Home App</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map(i=><span key={i} className="text-xs" style={{ color: '#f97316' }}>★</span>)}
                    </div>
                  </div>
                </div>

                <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg,transparent,rgba(249,115,22,.3),transparent)' }}/>

                {/* Stats with animated counters */}
                <div className="grid grid-cols-3 gap-3 mb-7">
                  {[
                    { raw: '5', suffix: 'K+', label: 'Verified Vendors' },
                    { raw: '100', suffix: '%', label: 'Bg Checked' },
                    { raw: '24', suffix: '×7', label: 'Support' },
                  ].map(({ raw, suffix, label }) => (
                    <div key={label} className="text-center p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)' }}>
                      <p className="font-display font-bold text-lg m-0" style={{ color: '#f97316' }}>
                        <AnimCounter target={raw} suffix={suffix}/>
                      </p>
                      <p className="text-[10px] leading-tight mt-0.5 m-0 font-body" style={{ color: '#64748b' }}>{label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 mb-7">
                  {[
                    { icon:'✅', text:'Verified Vendors Network' },
                    { icon:'✅', text:'Live Construction Tracking' },
                    { icon:'✅', text:'Smart Material Planning' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200"
                      style={{ background: 'rgba(249,115,22,.04)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(249,115,22,.1)'}
                      onMouseLeave={e=>e.currentTarget.style.background='rgba(249,115,22,.04)'}>
                      <span className="text-sm">{icon}</span>
                      <span className="text-xs font-body font-medium" style={{ color: '#94a3b8' }}>{text}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg,transparent,rgba(249,115,22,.2),transparent)' }}/>

                <div className="space-y-2 text-xs font-body mb-6">
                  <a href="https://www.ourcitynirman.in" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-colors" style={{ color: '#60a5fa' }}
                    onMouseEnter={e=>e.currentTarget.style.color='#93c5fd'} onMouseLeave={e=>e.currentTarget.style.color='#60a5fa'}>
                    🌐 www.ourcitynirman.in
                  </a>
                  <a href="tel:+918553866059" className="flex items-center gap-2 transition-colors" style={{ color: '#64748b' }}
                    onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='#64748b'}>
                    📞 +91 85538 66059
                  </a>
                  <a href="tel:+919065813209" className="flex items-center gap-2 transition-colors" style={{ color: '#64748b' }}
                    onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='#64748b'}>
                    📞 +91 90658 13209
                  </a>
                  <p className="flex items-start gap-2 pt-1 m-0" style={{ color: '#475569' }}>
                    <span>📍</span><span>Simanpur, Pirpainti, Bihar — 813209</span>
                  </p>
                </div>

                <button onClick={() => navigate('/register')} className="btn-primary w-full text-sm text-center">
                  <span>🔔 Notify Me at Launch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-sm font-body tracking-widest uppercase mb-3" style={{ color: '#f97316' }}>Everything You Need</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            One Platform.{' '}
            <span className="text-gradient-orange">Complete Home Construction.</span>
          </h2>
          <p className="text-slate-500 mt-3 font-body max-w-lg mx-auto">
            From foundation to finishing — manage every aspect of your dream home digitally.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {features.map((f, i) => (
            <div key={f.title}
              className="glass-card p-6 rounded-2xl group transition-all duration-300 cursor-default relative overflow-hidden"
              style={{ animationDelay:`${i*.1}s` }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(249,115,22,.4)'; e.currentTarget.style.background='rgba(249,115,22,.05)'; e.currentTarget.style.transform='translateY(-4px)' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,.07)'; e.currentTarget.style.background='rgba(255,255,255,.03)'; e.currentTarget.style.transform='translateY(0)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(249,115,22,.6),transparent)' }}/>
              <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110">{f.icon}</div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm font-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="glass-card glow-orange rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(249,115,22,.1) 0%,transparent 70%)' }}/>

          {/* Decorative corner lines */}
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
            style={{ borderTop: '2px solid rgba(249,115,22,.3)', borderLeft: '2px solid rgba(249,115,22,.3)', borderRadius: '16px 0 0 0' }}/>
          <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
            style={{ borderBottom: '2px solid rgba(249,115,22,.3)', borderRight: '2px solid rgba(249,115,22,.3)', borderRadius: '0 0 16px 0' }}/>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-3 font-body"
            style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', color: '#f87171' }}>
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-red-400"/>
            🕐 Only 7 Days Remaining
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Be the First to Build Smarter
          </h2>
          <p className="text-slate-400 font-body mb-8 max-w-md mx-auto">
            Register now and get exclusive early access, priority onboarding, and launch-day offers from Our City Nirman.
          </p>
          <button onClick={() => navigate('/register')} className="btn-primary text-base">
            <span>🚀 Register Now — Free Early Access</span>
          </button>
          <p className="text-slate-600 text-xs font-body mt-4">No credit card required. Available on Android, iOS & Web.</p>
        </div>
      </section>

    </div>
  )
}