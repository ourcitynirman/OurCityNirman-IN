// FooterSection.jsx — Enhanced Production Ready
import { useNavigate } from 'react-router-dom'

// ─── DATA ────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'Home',          type: 'nav', to: '/' },
  { label: 'Register Now',  type: 'nav', to: '/register' },
  { label: 'Our Website',   type: 'ext', href: 'https://www.ourcitynirman.in' },
]

const SERVICES = [
  { i: '🏠', t: 'Home Construction' },
  { i: '🏪', t: 'Verified Vendors' },
  { i: '📦', t: 'Material Sourcing' },
  { i: '📍', t: 'Live Project Tracking' },
  { i: '💳', t: 'Secure Payments' },
  { i: '🛠️', t: '24×7 Support' },
  { i: '📐', t: 'Architect Connect' },
  { i: '📊', t: 'Budget Planning' },
]

const SOCIAL_LINKS = [
  {
    name: 'WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    href: 'https://wa.me/918553866059',
    color: '#25D366',
    bg: 'rgba(37,211,102,.1)',
    border: 'rgba(37,211,102,.25)',
  },
  {
    name: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    href: 'https://www.instagram.com/ourcitynirman',
    color: '#E1306C',
    bg: 'rgba(225,48,108,.1)',
    border: 'rgba(225,48,108,.25)',
  },
  {
    name: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    href: 'https://www.youtube.com/@ourcitynirman',
    color: '#FF0000',
    bg: 'rgba(255,0,0,.08)',
    border: 'rgba(255,0,0,.2)',
  },
  {
    name: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    href: 'https://www.facebook.com/people/OurCity-Nirman/pfbid026nZP6jKK35fgsc3VN1KLo9XcCtY96qUzL7H12TYddNoWJWs6dgGKesUYBw9AwDAHl/',
    color: '#1877F2',
    bg: 'rgba(24,119,242,.08)',
    border: 'rgba(24,119,242,.2)',
  },
  {
    name: 'Twitter / X',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    href: 'https://www.instagram.com/ourcitynirman/',
    color: '#E7E9EA',
    bg: 'rgba(231,233,234,.06)',
    border: 'rgba(231,233,234,.15)',
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    href: 'https://www.instagram.com/ourcitynirman/',
    color: '#0A66C2',
    bg: 'rgba(10,102,194,.08)',
    border: 'rgba(10,102,194,.2)',
  },
]

const BOTTOM_LINKS = [
  { label: 'Website',  href: 'https://www.ourcitynirman.in', ext: true },
  { label: 'Contact',  href: 'tel:+918553866059' },
  { label: 'Location', href: 'https://maps.google.com/?q=25.262807,87.395522', ext: true },
]

// ─── CSS ──────────────────────────────────────────────────────
const FOOTER_CSS = `
  .footer-social-btn {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    transition: all .25s cubic-bezier(.34,1.56,.64,1);
    cursor: pointer; text-decoration: none;
    position: relative; overflow: hidden;
  }
  .footer-social-btn:hover {
    transform: translateY(-3px) scale(1.12);
  }
  .footer-social-btn::after {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: rgba(255,255,255,.06);
    opacity: 0; transition: opacity .2s;
  }
  .footer-social-btn:hover::after { opacity: 1 }

  .footer-nav-link {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: #64748b;
    transition: color .2s, transform .2s;
    background: none; border: none; cursor: pointer;
    padding: 0; text-align: left; width: 100%;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
  }
  .footer-nav-link:hover { color: #fb923c; transform: translateX(3px) }
  .footer-nav-link .dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: rgba(249,115,22,.3); flex-shrink: 0;
    transition: background .2s, transform .2s;
  }
  .footer-nav-link:hover .dot { background: #f97316; transform: scale(1.5) }

  .service-row {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 0; cursor: default;
    transition: padding-left .2s;
  }
  .service-row:hover { padding-left: 4px }
  .service-row:hover .service-text { color: #cbd5e1 }
  .service-text { font-size: 13px; color: #64748b; transition: color .2s; font-family: 'DM Sans', sans-serif }

  @keyframes footerGlow {
    0%,100%{ opacity: .4 } 50%{ opacity: .9 }
  }
  .footer-pulse { animation: footerGlow 3s ease-in-out infinite }

  .map-frame {
    border-radius: 0 0 14px 14px;
    overflow: hidden;
    position: relative;
  }
  .map-frame::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    box-shadow: inset 0 -20px 30px rgba(5,9,15,.6);
    border-radius: inherit;
  }

  .footer-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(249,115,22,.18), transparent);
  }

  .cta-strip {
    background: linear-gradient(135deg, rgba(249,115,22,.07), rgba(234,88,12,.03));
    border: 1px solid rgba(249,115,22,.15);
    border-radius: 18px;
    padding: 20px 28px;
  }
`

// ─── HELPER COMPONENTS ───────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <p style={{ color:'rgba(249,115,22,.5)', fontSize:10, fontWeight:700,
        letterSpacing:'.18em', textTransform:'uppercase', margin:0 }}>
        {children}
      </p>
      <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(249,115,22,.2),transparent)' }}/>
    </div>
  )
}

// ─── MAIN FOOTER ─────────────────────────────────────────────
export default function FooterSection() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <footer style={{ background:'#05090f', borderTop:'1px solid rgba(255,255,255,.05)', position:'relative', overflow:'hidden' }}>
      <style>{FOOTER_CSS}</style>

      {/* Background ambience */}
      <div style={{ position:'absolute', bottom:-40, left:'50%', transform:'translateX(-50%)',
        width:700, height:200, background:'radial-gradient(ellipse,rgba(249,115,22,.05) 0%,transparent 70%)',
        borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:0, right:0, width:300, height:300,
        background:'radial-gradient(circle,rgba(59,130,246,.03) 0%,transparent 70%)',
        filter:'blur(60px)', pointerEvents:'none' }}/>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'56px 24px 40px' }}>

        {/* ── 4-COL GRID ──────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:40 }}>

          {/* COL 1 — Brand + Social */}
          <div style={{ gridColumn:'span 1' }}>
            {/* Logo */}
            <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:12,
              background:'none', border:'none', cursor:'pointer', padding:0, marginBottom:20 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#f97316,#c2410c)',
                boxShadow:'0 4px 20px rgba(249,115,22,.4)', display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, transition:'transform .2s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'}
                onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                <svg viewBox="0 0 24 24" fill="white" style={{ width:22, height:22 }}>
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <div style={{ textAlign:'left' }}>
                <p style={{ fontFamily:"'Sora','DM Sans',sans-serif", fontWeight:900, color:'white',
                  fontSize:14, margin:0, lineHeight:1.3 }}>Our City Nirman</p>
                <p style={{ color:'rgba(249,115,22,.45)', fontSize:9, letterSpacing:'.2em',
                  textTransform:'uppercase', margin:0, marginTop:2 }}>Pvt. Ltd.</p>
              </div>
            </button>

            <p style={{ color:'#475569', fontSize:13, lineHeight:1.7, margin:'0 0 20px' }}>
              India's first digital platform connecting homeowners, verified vendors &amp;
              contractors — built for transparency, speed, and trust.
            </p>

            {/* Trust chips */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
              {[
                { e:'🏗️', t:'Build Smarter' },
                { e:'🔒', t:'100% Verified' },
                { e:'⚡', t:'Live Tracking' },
                { e:'🇮🇳', t:'Made in Bihar' },
              ].map(({e,t})=>(
                <span key={t} style={{ display:'inline-flex', alignItems:'center', gap:6,
                  padding:'5px 10px', borderRadius:50, background:'rgba(255,255,255,.04)',
                  border:'1px solid rgba(255,255,255,.07)', color:'#64748b', fontSize:11,
                  fontFamily:"'DM Sans',sans-serif" }}>
                  {e} {t}
                </span>
              ))}
            </div>

            {/* Social links */}
            <SectionTitle>Follow Us</SectionTitle>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
              {SOCIAL_LINKS.map(s=>(
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="footer-social-btn"
                  title={s.name}
                  style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.color }}>
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Contact quick buttons */}
            <div style={{ display:'flex', gap:8 }}>
              <a href="tel:+918553866059"
                style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10,
                  background:'rgba(249,115,22,.08)', border:'1px solid rgba(249,115,22,.2)',
                  color:'#fb923c', fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif",
                  textDecoration:'none', transition:'all .2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(249,115,22,.16)'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(249,115,22,.08)'; e.currentTarget.style.transform='translateY(0)' }}>
                📞 Call Us
              </a>
              <a href="https://wa.me/918553866059" target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10,
                  background:'rgba(37,211,102,.07)', border:'1px solid rgba(37,211,102,.2)',
                  color:'#4ade80', fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif",
                  textDecoration:'none', transition:'all .2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(37,211,102,.14)'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(37,211,102,.07)'; e.currentTarget.style.transform='translateY(0)' }}>
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* COL 2 — Quick Links */}
          <div>
            <SectionTitle>Quick Links</SectionTitle>
            <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:4 }}>
              {QUICK_LINKS.map(item=>(
                <li key={item.label}>
                  {item.type==='nav'
                    ? <button onClick={()=>navigate(item.to)} className="footer-nav-link">
                        <span className="dot"/>{item.label}
                      </button>
                    : <a href={item.href} target="_blank" rel="noopener noreferrer" className="footer-nav-link">
                        <span className="dot"/>{item.label}
                      </a>
                  }
                </li>
              ))}
            </ul>

            <div style={{ height:1, background:'linear-gradient(90deg,rgba(249,115,22,.12),transparent)',
              margin:'20px 0' }}/>

            <SectionTitle>Our Services</SectionTitle>
            <ul style={{ listStyle:'none', margin:0, padding:0 }}>
              {SERVICES.map(({i,t})=>(
                <li key={t} className="service-row">
                  <span style={{ fontSize:14, flexShrink:0 }}>{i}</span>
                  <span className="service-text">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — Contact + Stats */}
          <div>
            <SectionTitle>Get In Touch</SectionTitle>

            <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:28 }}>
              {[
                
                { icon:'📞', label:'Phone', value:'+91 90658 13209', href:'tel:+919065813209' },
                { icon:'🌐', label:'Website', value:'www.ourcitynirman.in', href:'https://www.ourcitynirman.in', ext:true },
                { icon:'💬', label:'WhatsApp', value:'Chat with us', href:'https://wa.me/918553866059', ext:true },
                { icon:'📍', label:'Address', value:'Simanpur, Pirpainti\nBhagalpur, Bihar — 813209', multi:true },
               
              ].map(({icon,label,value,href,ext,multi})=>(
                <div key={label} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{icon}</span>
                  <div style={{ minWidth:0 }}>
                    <p style={{ color:'#334155', fontSize:9, textTransform:'uppercase',
                      letterSpacing:'.15em', margin:'0 0 2px', fontFamily:"'DM Sans',sans-serif" }}>{label}</p>
                    {href
                      ? <a href={href} target={ext?'_blank':undefined} rel="noopener noreferrer"
                          style={{ color:'#94a3b8', fontSize:12, textDecoration:'none',
                            whiteSpace:multi?'pre-line':'normal', lineHeight:1.6, fontFamily:"'DM Sans',sans-serif",
                            transition:'color .2s' }}
                          onMouseEnter={e=>e.currentTarget.style.color='#fb923c'}
                          onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
                          {value}
                        </a>
                      : <p style={{ color:'#94a3b8', fontSize:12, margin:0,
                          whiteSpace:multi?'pre-line':'normal', lineHeight:1.6, fontFamily:"'DM Sans',sans-serif" }}>
                          {value}
                        </p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Mini stats */}
            
          </div>

          {/* COL 4 — Map */}
          <div>
            <SectionTitle>Our Location</SectionTitle>

            {/* Map card */}
            <div style={{ borderRadius:16, overflow:'hidden',
              border:'1px solid rgba(249,115,22,.15)',
              boxShadow:'0 0 0 1px rgba(249,115,22,.06), 0 8px 40px rgba(0,0,0,.5)',
              marginBottom:16 }}>

              {/* Browser chrome */}
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px',
                background:'rgba(255,255,255,.04)', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                <div style={{ display:'flex', gap:5 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'rgba(239,68,68,.5)', display:'block' }}/>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'rgba(234,179,8,.5)', display:'block' }}/>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'rgba(34,197,94,.5)', display:'block' }}/>
                </div>
                <div style={{ flex:1, background:'rgba(255,255,255,.05)', borderRadius:6, padding:'3px 10px' }}>
                  <span style={{ color:'#475569', fontSize:10, fontFamily:"'DM Sans',sans-serif" }}>
                    📍 Simanpur, Pirpainti, Bihar
                  </span>
                </div>
                <a href="https://maps.google.com/?q=25.262807,87.395522" target="_blank" rel="noopener noreferrer"
                  style={{ color:'#f97316', fontSize:10, fontWeight:700,
                    fontFamily:"'DM Sans',sans-serif", textDecoration:'none', flexShrink:0,
                    padding:'2px 8px', borderRadius:6, background:'rgba(249,115,22,.1)',
                    border:'1px solid rgba(249,115,22,.2)' }}>
                  Open ↗
                </a>
              </div>

              {/* Map iframe */}
              <div className="map-frame" style={{ height:180, position:'relative' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d449.4200722128725!2d87.39552234081536!3d25.262807778246145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDE1JzQ2LjEiTiA4N8KwMjMnNDQuMyJF!5e1!3m2!1sen!2sin!4v1772438365991!5m2!1sen!2sin"
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:0,
                    filter:'invert(92%) hue-rotate(180deg) saturate(.85) brightness(.82)' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our City Nirman — Simanpur, Bihar"
                />
              </div>

              {/* Map footer */}
              <div style={{ padding:'10px 14px', background:'rgba(255,255,255,.02)',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                borderTop:'1px solid rgba(255,255,255,.05)' }}>
                <div>
                  <p style={{ color:'#94a3b8', fontSize:11, margin:0, fontFamily:"'DM Sans',sans-serif" }}>
                    📍 Simanpur, Pirpainti
                  </p>
                  <p style={{ color:'#475569', fontSize:10, margin:'2px 0 0', fontFamily:"'DM Sans',sans-serif" }}>
                    Bhagalpur, Bihar — 813209
                  </p>
                </div>
                <a href="https://maps.google.com/?q=25.262807,87.395522" target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:8,
                    background:'linear-gradient(135deg,#f97316,#ea580c)',
                    color:'white', fontSize:11, fontWeight:700,
                    fontFamily:"'DM Sans',sans-serif", textDecoration:'none',
                    boxShadow:'0 3px 12px rgba(249,115,22,.35)', transition:'all .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 5px 20px rgba(249,115,22,.5)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 3px 12px rgba(249,115,22,.35)' }}>
                  🗺️ Directions
                </a>
              </div>
            </div>

            {/* App download hint */}
            <div style={{ padding:'12px 14px', borderRadius:12,
              background:'rgba(249,115,22,.05)', border:'1px solid rgba(249,115,22,.12)',
              display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>📱</span>
              <div>
                <p style={{ color:'#cbd5e1', fontSize:12, fontWeight:600, margin:0,
                  fontFamily:"'DM Sans',sans-serif" }}>App Coming Soon</p>
                <p style={{ color:'#475569', fontSize:10, margin:'2px 0 0',
                  fontFamily:"'DM Sans',sans-serif" }}>Android • iOS • Web</p>
              </div>
              <div style={{ marginLeft:'auto' }}>
                <span className="footer-pulse" style={{ display:'block', width:8, height:8,
                  borderRadius:'50%', background:'#f97316' }}/>
              </div>
            </div>
          </div>

        </div>

        {/* ── DIVIDER ─────────────────────────────────────────── */}
        <div className="footer-divider" style={{ margin:'44px 0 32px' }}/>

        {/* ── CTA STRIP ───────────────────────────────────────── */}
        <div className="cta-strip" style={{ display:'flex', flexWrap:'wrap', alignItems:'center',
          justifyContent:'space-between', gap:16, marginBottom:32 }}>
          <div>
            <p style={{ fontFamily:"'Sora','DM Sans',sans-serif", fontWeight:900, color:'white',
              fontSize:14, margin:'0 0 4px' }}>🚀 Haven't registered yet?</p>
            <p style={{ color:'#475569', fontSize:12, margin:0, fontFamily:"'DM Sans',sans-serif" }}>
              Limited early access spots — join the waitlist for free. Launching in 7 days!
            </p>
          </div>
          <button onClick={()=>navigate('/register')}
            style={{ flexShrink:0, padding:'10px 24px', borderRadius:12, fontWeight:700, color:'white',
              fontSize:13, border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
              background:'linear-gradient(135deg,#f97316,#ea580c)',
              boxShadow:'0 4px 20px rgba(249,115,22,.3)', transition:'all .2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 28px rgba(249,115,22,.5)' }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(249,115,22,.3)' }}>
            Register Free ✦
          </button>
        </div>

        {/* ── BOTTOM BAR ──────────────────────────────────────── */}
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center',
          justifyContent:'space-between', gap:12 }}>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:24, height:24, borderRadius:8, background:'linear-gradient(135deg,#f97316,#c2410c)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg viewBox="0 0 24 24" fill="white" style={{ width:14, height:14 }}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <p style={{ color:'#334155', fontSize:11, margin:0, fontFamily:"'DM Sans',sans-serif" }}>
              © {year} Our City Nirman Pvt. Ltd. — All Rights Reserved
            </p>
          </div>

          <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:16 }}>
            {BOTTOM_LINKS.map(({label,href,ext})=>(
              <a key={label} href={href} target={ext?'_blank':undefined} rel="noopener noreferrer"
                style={{ color:'#334155', fontSize:11, textDecoration:'none', fontFamily:"'DM Sans',sans-serif",
                  transition:'color .2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#f97316'}
                onMouseLeave={e=>e.currentTarget.style.color='#334155'}>
                {label}
              </a>
            ))}
            <button onClick={()=>navigate('/register')}
              style={{ color:'#334155', fontSize:11, background:'none', border:'none',
                cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'color .2s', padding:0 }}
              onMouseEnter={e=>e.currentTarget.style.color='#f97316'}
              onMouseLeave={e=>e.currentTarget.style.color='#334155'}>
              Register
            </button>
            <span style={{ color:'rgba(51,65,85,.5)', fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>
              Made with ❤️ in Bihar, India
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}