import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Design tokens (match the site-wide theme) ─────────────────
// Fonts are loaded globally via index.css — no @import needed here.
const GLOBAL_CSS = `
:root {
  --orange:     #f97316;
  --orange-dim: rgba(249,115,22,.18);
  --orange-glow:rgba(249,115,22,.35);
  --bg:         #08101f;
  --glass-bg:   rgba(255,255,255,.03);
  --glass-b:    rgba(255,255,255,.07);
}

*, *::before, *::after { box-sizing: border-box }
html { scroll-behavior: smooth }
body { background: var(--bg); margin: 0; font-family: 'DM Sans', sans-serif; color: #94a3b8 }

.font-display { font-family: 'Sora', sans-serif }
.font-body    { font-family: 'DM Sans', sans-serif }

/* Glass card */
.glass-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-b);
  backdrop-filter: blur(14px);
  transition: border-color .3s, background .3s;
}

/* Orange gradient text */
.text-gradient-orange {
  background: linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glow orange */
.glow-orange { box-shadow: 0 0 40px rgba(249,115,22,.18), 0 0 80px rgba(249,115,22,.06) }

/* Primary button */
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

/* Pulse dot */
.pulse-dot { animation: pulseDot 2s ease-in-out infinite }
@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.6)} }

/* Glow pulse */
.animate-glow-pulse { animation: glowPulse 3s ease-in-out infinite }
@keyframes glowPulse { 0%,100%{box-shadow:0 0 16px rgba(249,115,22,.3)} 50%{box-shadow:0 0 40px rgba(249,115,22,.7)} }

/* Badge pulse ring */
@keyframes ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
.badge-ring::before {
  content: ''; position: absolute; inset: -4px; border-radius: 50%;
  border: 1px solid rgba(249,115,22,.5);
  animation: ring 2s ease-in-out infinite;
}

/* TOC highlight nav */
.toc-link {
  display: block; padding: 8px 14px; border-radius: 10px;
  font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 500;
  color: #64748b; text-decoration: none;
  border: 1px solid transparent;
  transition: all .2s;
}
.toc-link:hover, .toc-link.active {
  color: #fb923c;
  background: rgba(249,115,22,.07);
  border-color: rgba(249,115,22,.2);
}
.toc-link.active { color: #f97316; font-weight: 600; }

/* Section card */
.tos-section {
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,.06);
  background: rgba(255,255,255,.025);
  padding: 36px 40px;
  transition: border-color .3s;
  scroll-margin-top: 100px;
}
.tos-section:hover { border-color: rgba(249,115,22,.15) }

/* Section divider line */
.section-div {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(249,115,22,.2), transparent);
  margin: 8px 0 24px;
}

/* Shimmer */
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.shimmer {
  background: linear-gradient(90deg, rgba(249,115,22,.05) 0%, rgba(249,115,22,.15) 50%, rgba(249,115,22,.05) 100%);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

/* Particle */
@keyframes particleDrift {
  0%   { opacity: 0; transform: translateY(0) scale(0) }
  20%  { opacity: 1 }
  100% { opacity: 0; transform: translateY(var(--dy)) translateX(var(--dx)) scale(1) }
}

/* Fade slide up */
@keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
.fade-up { animation: fadeSlideUp .7s ease both }

/* Tooltip */
.highlight-box {
  background: rgba(249,115,22,.07);
  border: 1px solid rgba(249,115,22,.18);
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 16px;
}

/* Numbered list style */
.tos-list {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: tos-counter;
}
.tos-list li {
  counter-increment: tos-counter;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,.04);
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.7;
}
.tos-list li::before {
  content: "(" counter(tos-counter) ")";
  flex-shrink: 0;
  font-weight: 700;
  color: #fb923c;
  font-size: 13px;
  margin-top: 2px;
  min-width: 28px;
}
.tos-list li:last-child { border-bottom: none }

/* Back to top button */
.back-top {
  position: fixed;
  bottom: 32px; right: 32px; z-index: 50;
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(249,115,22,.4);
  transition: all .3s; opacity: 0; transform: translateY(16px);
}
.back-top.show { opacity: 1; transform: translateY(0) }
.back-top:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(249,115,22,.6) }

/* Responsive tweaks */
@media (max-width: 1024px) {
  .tos-section { padding: 24px 20px; }
}
`

// ── Table of contents sections ────────────────────────────────
const TOC = [
  { id: 'introduction',       label: '1. Introduction' },
  { id: 'acceptance',         label: '2. Acceptance of Terms' },
  { id: 'copyright',          label: '3. Copyright & Trademarks' },
  { id: 'legality',           label: '4. Legality of Use' },
  { id: 'disclaimer',         label: '5. Disclaimer of Warranty' },
  { id: 'limitation',         label: '6. Limitation of Liability' },
  { id: 'contact',            label: '7. Contact Us' },
]

// ── Building icon (matches site-wide navbar) ──────────────────
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 13.5H5.25L4.5 3zM9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
)

// ── Floating particles (reused pattern) ───────────────────────
function Particles() {
  const items = useRef(Array.from({ length: 12 }, (_, i) => ({
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
            background:`rgba(249,115,22,${.08+Math.random()*.15})`,
            '--dx':p.dx,'--dy':p.dy,
            animation:`particleDrift ${p.dur} ease-in-out ${p.del} infinite` }} />
      ))}
    </div>
  )
}

// ── Main TermsOfUse component ─────────────────────────────────
export default function TermsOfUse() {
  const navigate         = useNavigate()
  const [active, setActive]   = useState('introduction')
  const [showTop, setShowTop] = useState(false)
  const sectionRefs      = useRef({})

  // Intersection Observer: highlight active TOC link on scroll
  useEffect(() => {
    const observers = []

    TOC.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-30% 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Show/hide back-to-top button
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const lastUpdated = '16 April 2026'

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#08101f' }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── SEO meta (injected into <head> via Helmet-compatible approach) ── */}
      {/* Note: For full react-helmet support, wrap App in HelmetProvider */}

      {/* Background layers */}
      <Particles />

      {/* Grid pattern */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage:`linear-gradient(rgba(249,115,22,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.03) 1px,transparent 1px)`, backgroundSize:'60px 60px' }}/>

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle,rgba(249,115,22,.06) 0%,transparent 70%)' }}/>
      <div className="fixed bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle,rgba(59,130,246,.04) 0%,transparent 70%)' }}/>

      {/* ── NAVBAR ────────────────────────────────────────────────── */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto"
        style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-left bg-transparent border-0 p-0 cursor-pointer">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-glow-pulse"
            style={{ background: 'linear-gradient(135deg,#f97316,#c2410c)', boxShadow: '0 4px 20px rgba(249,115,22,.4)' }}>
            <BuildingIcon />
          </div>
          <div>
            <p className="font-display font-bold text-white text-base leading-tight m-0">Our City Nirman</p>
            <p className="text-[10px] font-body tracking-wider uppercase m-0" style={{ color: 'rgba(249,115,22,.6)' }}>Pvt. Ltd.</p>
          </div>
        </button>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-body" style={{ color: '#475569' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12 }}
            onMouseEnter={e => e.currentTarget.style.color='#fb923c'}
            onMouseLeave={e => e.currentTarget.style.color='#64748b'}>
            Home
          </button>
          <span style={{ color: '#334155' }}>/</span>
          <span style={{ color: '#fb923c' }}>Terms of Use</span>
        </div>

        <button onClick={() => navigate('/register')} className="btn-primary text-sm hidden sm:block">
          <span>Get Early Access</span>
        </button>
      </header>

      {/* ── HERO BANNER ───────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="fade-up text-center max-w-3xl mx-auto">
          {/* Label badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ border: '1px solid rgba(249,115,22,.3)', background: 'rgba(249,115,22,.08)' }}>
            <span className="text-lg">📋</span>
            <span className="text-sm font-body font-semibold tracking-wider uppercase" style={{ color: 'rgba(251,146,60,.9)' }}>
              Legal Document
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-black leading-[1.1] text-white mb-5">
            Terms of{' '}
            <span className="text-gradient-orange">Use</span>
          </h1>

          <p className="font-body text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
            These Terms of Service govern your use of the products and services operated by{' '}
            <strong className="text-white">OurCityNirman Pvt Ltd</strong>.
            Please read them carefully before using our platform.
          </p>

          {/* Meta strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-body" style={{ color: '#475569' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#f97316' }}/>
              Last Updated: {lastUpdated}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }}/>
              Effective Immediately
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }}/>
              Applicable to All Users
            </span>
          </div>
        </div>
      </section>

      {/* ── MAIN BODY ─────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="flex gap-10 lg:gap-14" style={{ alignItems: 'flex-start' }}>

          {/* ── SIDEBAR (Table of Contents) ───────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0" style={{ position: 'sticky', top: '100px' }}>
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs font-body font-bold tracking-widest uppercase mb-4"
                style={{ color: 'rgba(249,115,22,.7)' }}>
                Table of Contents
              </p>
              <nav className="space-y-1">
                {TOC.map(({ id, label }) => (
                  <a key={id} href={`#${id}`} className={`toc-link ${active === id ? 'active' : ''}`}>
                    {label}
                  </a>
                ))}
              </nav>

              {/* Quick contact */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                <p className="text-xs font-body font-semibold mb-3" style={{ color: '#64748b' }}>
                  Need Help?
                </p>
                <a href="mailto:ourcitynirman@gmail.com"
                  className="flex items-center gap-2 text-xs font-body rounded-xl p-2.5 transition-all duration-200"
                  style={{ background: 'rgba(249,115,22,.06)', border: '1px solid rgba(249,115,22,.15)', color: '#fb923c' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(249,115,22,.12)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(249,115,22,.06)'}>
                  <span>✉️</span>
                  <span>ourcitynirman@gmail.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* ── CONTENT AREA ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* ─ 0. Intro disclaimer ─ */}
            <div className="highlight-box fade-up">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <div>
                  <p className="font-body font-bold text-white text-sm mb-1">Important Notice</p>
                  <p className="text-sm font-body leading-relaxed" style={{ color: '#94a3b8' }}>
                    By accessing and using our products and Services, you acknowledge that you have read, understood,
                    and agree to be bound by the terms and conditions in full. You may not use our Products
                    (applications) if you do not accept all of the terms and conditions of this Agreement.
                  </p>
                </div>
              </div>
            </div>

            {/* ─ 1. Introduction ─ */}
            <div id="introduction" className="tos-section fade-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,22,.12)', border: '1px solid rgba(249,115,22,.25)' }}>
                  <span className="text-base">📖</span>
                </div>
                <h2 className="font-display font-bold text-white text-xl m-0">Introduction</h2>
              </div>
              <div className="section-div"/>
              <p className="font-body text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                This Agreement is legally binding between you (<strong className="text-slate-300">"User"</strong>,{' '}
                <strong className="text-slate-300">"you"</strong> or <strong className="text-slate-300">"your"</strong>) and{' '}
                <strong className="text-white">OurCity Nirman Pvt Ltd</strong>{' '}
                (<strong className="text-slate-300">"Products"</strong>, <strong className="text-slate-300">"we"</strong>,{' '}
                <strong className="text-slate-300">"us"</strong> or <strong className="text-slate-300">"our"</strong>).
                You can download or install our apps from the Play Store and App Store.
              </p>
            </div>

            {/* ─ 2. Acceptance ─ */}
            <div id="acceptance" className="tos-section fade-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,22,.12)', border: '1px solid rgba(249,115,22,.25)' }}>
                  <span className="text-base">✅</span>
                </div>
                <h2 className="font-display font-bold text-white text-xl m-0">Acceptance of General Terms and Conditions</h2>
              </div>
              <div className="section-div"/>
              <p className="font-body text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                By accessing the products and/or using our Products, you agree to accept these terms and conditions.
                If you do not agree with the terms of this Agreement, you must not accept this Agreement and may not
                access and use the products and Services.
              </p>
              <p className="font-body text-sm leading-relaxed mt-4" style={{ color: '#94a3b8' }}>
                OurCity Nirman Pvt Ltd reserve the right to modify this Agreement or its terms relating to the products
                and Services at any time, in our sole discretion without notice, and are effective immediately upon posting
                such changes on the Site. An updated version of this Agreement will be available on{' '}
                <a href="https://ourcitynirman.com/" target="_blank" rel="noopener noreferrer"
                  className="font-medium"
                  style={{ color: '#60a5fa', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color='#93c5fd'}
                  onMouseLeave={e => e.currentTarget.style.color='#60a5fa'}>
                  https://ourcitynirman.com/
                </a>
              </p>
            </div>

            {/* ─ 3. Copyright & Trademarks ─ */}
            <div id="copyright" className="tos-section fade-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,22,.12)', border: '1px solid rgba(249,115,22,.25)' }}>
                  <span className="text-base">©️</span>
                </div>
                <h2 className="font-display font-bold text-white text-xl m-0">Copyright and Trademarks</h2>
              </div>
              <div className="section-div"/>
              <p className="font-body text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                Unless otherwise indicated, the Products or Service is our proprietary property and all source code,
                texts, videos, logos, images, clips, graphics, icons, data compilations and information
                (collectively, the <strong className="text-slate-300">"Content"</strong>) and the trademarks, service marks,
                and logos contained therein (the <strong className="text-slate-300">"Marks"</strong>) are owned or controlled
                by us or licensed to us and are protected by copyright and trademark laws.
              </p>
            </div>

            {/* ─ 4. Legality of Use ─ */}
            <div id="legality" className="tos-section fade-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,22,.12)', border: '1px solid rgba(249,115,22,.25)' }}>
                  <span className="text-base">⚖️</span>
                </div>
                <h2 className="font-display font-bold text-white text-xl m-0">Legality of Use</h2>
              </div>
              <div className="section-div"/>
              <p className="font-body text-sm leading-relaxed mb-5" style={{ color: '#94a3b8' }}>
                By using our Products or Service, you represent and warrant that:
              </p>
              <ul className="tos-list">
                <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                <li>You are not a minor in the jurisdiction in which you reside.</li>
                <li>You will not access our application &amp; services through automated or non-human means, whether through a bot, script, or otherwise.</li>
                <li>You will not use our applications for any illegal or unauthorized purpose.</li>
                <li>Your use of the application will not violate any applicable law or regulation.</li>
                <li>You are fully responsible or liable for any direct or indirect loss, risk, injury, or damage arising from your use of Our Products.</li>
                <li>You acknowledge that you are both physically and mentally able to use Our Products.</li>
                <li>You are accessing and using the Mobile Application and Services knowingly and fully aware of all effects/implications associated with their use.</li>
              </ul>

              <div className="highlight-box mt-6">
                <p className="font-body text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                  <strong className="text-orange-400">⚠️ Account Termination:</strong> If you provide any information that is
                  untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account
                  and refuse any and all current or future use of the applications and services (or any portion thereof).
                </p>
              </div>
            </div>

            {/* ─ 5. Disclaimer of Warranty ─ */}
            <div id="disclaimer" className="tos-section fade-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,22,.12)', border: '1px solid rgba(249,115,22,.25)' }}>
                  <span className="text-base">🛡️</span>
                </div>
                <h2 className="font-display font-bold text-white text-xl m-0">Disclaimer of Warranty</h2>
              </div>
              <div className="section-div"/>
              <p className="font-body text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                These services are provided by the company on an{' '}
                <strong className="text-slate-300">"as is"</strong> and{' '}
                <strong className="text-slate-300">"as available"</strong> basis.
                OurCityNirman Pvt Ltd makes no representations or warranties of any kind, express or implied, as to the
                operation of their services, or the information, content, or materials included therein.
              </p>
              <p className="font-body text-sm leading-relaxed mt-4" style={{ color: '#94a3b8' }}>
                You expressly agree that your use of these services, their content, and any services or items obtained
                from us is at your sole risk.
              </p>
            </div>

            {/* ─ 6. Limitation of Liability ─ */}
            <div id="limitation" className="tos-section fade-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,22,.12)', border: '1px solid rgba(249,115,22,.25)' }}>
                  <span className="text-base">📊</span>
                </div>
                <h2 className="font-display font-bold text-white text-xl m-0">Limitation of Liability</h2>
              </div>
              <div className="section-div"/>
              <p className="font-body text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                OurCity Nirman Pvt Ltd shall not be liable for any loss or damages, any direct, indirect, punitive,
                special, incidental, or consequential damage, however it arises, whether in an action of contract,
                negligence, or other tortious action, or arising out of or in connection with this agreement, including
                without limitation any claim for personal injury or property damage, arising from this agreement and any
                violation by you of any federal, state, or local laws, statutes, rules, or regulations, even if the
                company has been previously advised of the possibility of such damage.
              </p>
              <p className="font-body text-sm leading-relaxed mt-4" style={{ color: '#94a3b8' }}>
                Except as prohibited by law, if there is liability found on the part of the company, it will be limited
                to the amount paid for the products and/or services, and under no circumstances will there be
                consequential or punitive damages. Some states do not allow the exclusion or limitation of punitive,
                incidental, or consequential damages, so the prior limitation or exclusion may not apply to you.
              </p>
            </div>

            {/* ─ 7. Contact Us ─ */}
            <div id="contact" className="tos-section glow-orange fade-up" style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,.6), transparent)' }}/>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,22,.12)', border: '1px solid rgba(249,115,22,.25)' }}>
                  <span className="text-base">✉️</span>
                </div>
                <h2 className="font-display font-bold text-white text-xl m-0">Contact Us</h2>
              </div>
              <div className="section-div"/>
              <p className="font-body text-sm leading-relaxed mb-6" style={{ color: '#94a3b8' }}>
                In order to resolve a complaint regarding our applications or to receive further information regarding
                the use of the applications and services, please contact us at:
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:ourcitynirman@gmail.com"
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl font-body text-sm font-semibold transition-all duration-300 flex-1"
                  style={{ background: 'rgba(249,115,22,.08)', border: '1px solid rgba(249,115,22,.25)', color: '#fb923c' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(249,115,22,.15)'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(249,115,22,.08)'; e.currentTarget.style.transform='translateY(0)' }}>
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="m-0 text-xs font-normal" style={{ color: '#64748b' }}>Email Us</p>
                    <p className="m-0">ourcitynirman@gmail.com</p>
                  </div>
                </a>

                <a href="https://ourcitynirman.com/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl font-body text-sm font-semibold transition-all duration-300 flex-1"
                  style={{ background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.2)', color: '#60a5fa' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(59,130,246,.12)'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(59,130,246,.06)'; e.currentTarget.style.transform='translateY(0)' }}>
                  <span className="text-xl">🌐</span>
                  <div>
                    <p className="m-0 text-xs font-normal" style={{ color: '#64748b' }}>Visit Website</p>
                    <p className="m-0">ourcitynirman.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* ─ Agreement confirmation strip ─ */}
            <div className="glass-card rounded-2xl p-8 text-center shimmer fade-up">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-display font-bold text-white text-lg mb-2">
                By using our platform, you agree to these terms.
              </h3>
              <p className="font-body text-sm mb-6" style={{ color: '#64748b' }}>
                If you have any questions, feel free to reach out to us before proceeding.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button onClick={() => navigate('/register')} className="btn-primary text-sm">
                  <span>🚀 Get Early Access</span>
                </button>
                <button onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-body text-sm transition-all duration-300"
                  style={{ border: '1px solid rgba(100,116,139,.4)', color: '#94a3b8' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(249,115,22,.4)'; e.currentTarget.style.color='#fb923c' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(100,116,139,.4)'; e.currentTarget.style.color='#94a3b8' }}>
                  ← Back to Home
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BACK TO TOP ───────────────────────────────────────────── */}
      <button
        id="back-to-top"
        onClick={scrollToTop}
        className={`back-top ${showTop ? 'show' : ''}`}
        aria-label="Back to top"
        title="Back to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
        </svg>
      </button>

    </div>
  )
}
