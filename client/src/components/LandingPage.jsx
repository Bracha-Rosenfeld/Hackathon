import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

/* ── Color utilities ── */
async function extractDominantColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 80; canvas.height = 80;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 80, 80);
        const data = ctx.getImageData(0, 0, 80, 80).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          const pr = data[i], pg = data[i+1], pb = data[i+2], pa = data[i+3];
          if (pa < 50) continue;
          const bright = (pr + pg + pb) / 3;
          const sat = Math.max(pr, pg, pb) - Math.min(pr, pg, pb);
          if (bright > 220 || bright < 20 || sat < 30) continue;
          r += pr; g += pg; b += pb; count++;
        }
        if (!count) { resolve(null); return; }
        resolve(`rgb(${Math.round(r/count)},${Math.round(g/count)},${Math.round(b/count)})`);
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

function parseColor(color) {
  if (!color) return { r: 36, g: 87, b: 166 };
  if (color.startsWith('#')) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : { r:36,g:87,b:166 };
  }
  const m = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  return m ? { r:+m[1], g:+m[2], b:+m[3] } : { r:36,g:87,b:166 };
}

function mix(c, factor, target = 255) {
  return { r: Math.round(c.r + (target - c.r) * factor), g: Math.round(c.g + (target - c.g) * factor), b: Math.round(c.b + (target - c.b) * factor) };
}
function rgb(c) { return `rgb(${c.r},${c.g},${c.b})`; }
function rgba(c, a) { return `rgba(${c.r},${c.g},${c.b},${a})`; }

/* ── Profile ── */
function getVariant(styleName) {
  const t = String(styleName || '').toLowerCase();
  if (t.includes('רגשי') || t.includes('emotional')) return 'emotional';
  if (t.includes('רציונלי') || t.includes('analytical')) return 'analytical';
  if (t.includes('מנהל') || t.includes('executive')) return 'executive';
  if (t.includes('דינמי') || t.includes('dynamic')) return 'dynamic';
  return 'classic';
}

function getCtaText(variant) {
  return { emotional:'אני רוצה לתרום', analytical:'המשך לתשלום', executive:'הצטרפות כשותף/ת', dynamic:'בואו נעשה את זה', classic:'המשך לתרומה' }[variant] || 'המשך לתרומה';
}

function formatAmount(amount) {
  const n = Number(amount);
  return isNaN(n) ? amount : n.toLocaleString('he-IL');
}

/* ── Inject CSS once ── */
const STYLE_ID = 'lp-v2-styles';
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    .lp-root{font-family:'Heebo',sans-serif;direction:rtl;}
    @keyframes lp-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes lp-spin{to{transform:rotate(360deg)}}
    .lp-in{opacity:0;animation:lp-up .5s cubic-bezier(.22,.68,0,1.15) forwards}
    .lp-card-opt{transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease;cursor:pointer;}
    .lp-card-opt:hover{transform:translateY(-2px);}
    .lp-btn-main{transition:filter .15s ease,transform .15s ease;}
    .lp-btn-main:hover{filter:brightness(1.07);transform:scale(1.012);}
    @media(max-width:820px){.lp-two-col{flex-direction:column!important;}.lp-col-left,.lp-col-right{width:100%!important;}}
  `;
  document.head.appendChild(s);
}

/* ── Component ── */
export default function LandingPage() {
  const { token } = useParams();
  const [data, setData]             = useState(null);
  const [selectedAmount, setSel]    = useState(null);
  const [error, setError]           = useState('');
  const [primaryColor, setPrimary]  = useState('#2457a6');
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/landing/${token}`)
      .then(r => r.json())
      .then(async json => {
        if (!json?.data) { setError('לא נמצאו נתונים לעמוד הזה.'); return; }
        const d = json.data;
        setData(d);
        setSel(d.option2 || d.option1 || d.option3 || null);

        const logoUrl = d.company_logo
          ? d.company_logo.startsWith('http') ? d.company_logo : `${API_BASE_URL}${d.company_logo}`
          : null;
        const fallback = d.company_color || d.brand_color || d.suggested_color || '#2457a6';
        const extracted = logoUrl ? await extractDominantColor(logoUrl) : null;
        setPrimary(extracted || fallback);
      })
      .catch(() => setError('אירעה שגיאה בטעינת העמוד.'));
  }, [token]);

  /* ── Loading / Error ── */
  if (error || !data) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Heebo,sans-serif', direction:'rtl', background:'#f8f9fb', color:'#6b7280', fontSize:18 }}>
      {error || <span style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{width:20,height:20,border:'2.5px solid #d1d5db',borderTopColor:'#6b7280',borderRadius:'50%',display:'inline-block',animation:'lp-spin .8s linear infinite'}}/>
        טוען…
      </span>}
    </div>
  );

  /* ── Derived values ── */
  const variant     = getVariant(data.style_name);
  const ctaText     = getCtaText(variant);
  const C           = parseColor(primaryColor);
  const Cdark       = mix(C, 0, 0);       // pure dark
  const Cdarker     = { r:Math.round(C.r*.6), g:Math.round(C.g*.6), b:Math.round(C.b*.6) };
  const Clight      = mix(C, 0.93);
  const Clighter    = mix(C, 0.96);
  const rgbStr      = `${C.r},${C.g},${C.b}`;

  const logoUrl     = data.company_logo
    ? data.company_logo.startsWith('http') ? data.company_logo : `${API_BASE_URL}${data.company_logo}`
    : null;
  const donorName   = data.donor_name   || 'שותף יקר';
  const companyName = data.company_name || 'הארגון';

  const options = [
    { amount: data.option1, label: 'תרומה בסיסית',   sub: 'נקודת התחלה משמעותית' },
    { amount: data.option2, label: 'הבחירה המומלצת', sub: 'השפעה מיטבית',          recommended: true },
    { amount: data.option3, label: 'שותפות רחבה',    sub: 'להוביל שינוי אמיתי' },
  ].filter(o => o.amount);

  const r = variant === 'executive' ? '10px' : variant === 'emotional' ? '24px' : '16px';

  /* ── Render ── */
  return (
    <div className="lp-root" style={{ minHeight:'100vh', background: rgb(Clighter) }}>

      {/* ── NAV ── */}
      <header style={{
        position:'sticky', top:0, zIndex:200,
        background:'rgba(255,255,255,0.9)',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(0,0,0,0.06)',
        padding:'0 6%',
      }}>
        <div style={{ maxWidth:1160, margin:'0 auto', height:62, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {logoUrl
              ? <img src={logoUrl} alt={companyName} onLoad={() => setLogoLoaded(true)}
                     style={{ maxHeight:38, maxWidth:130, objectFit:'contain', opacity: logoLoaded ? 1 : 0, transition:'opacity .3s' }} />
              : <span style={{ fontWeight:800, fontSize:17, color: rgb(C) }}>{companyName}</span>
            }
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#9ca3af' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            תשלום מאובטח
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(150deg, ${rgb(C)} 0%, ${rgb(Cdarker)} 100%)`,
        padding: '64px 6% 72px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* subtle mesh circles */}
        <div style={{ position:'absolute', top:-100, left:-100, width:360, height:360, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-80, right:'5%', width:260, height:260, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'20%', left:'35%', width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }}/>

        <div style={{ maxWidth:1160, margin:'0 auto', position:'relative' }}>
          <div className="lp-in" style={{ animationDelay:'.05s' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.15)', borderRadius:999, padding:'5px 14px', fontSize:13, fontWeight:600, marginBottom:20, backdropFilter:'blur(8px)' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#86efac', display:'inline-block' }}/>
              {companyName}
            </div>
          </div>
          <h1 className="lp-in" style={{ animationDelay:'.1s', fontSize:'clamp(30px,4.5vw,52px)', fontWeight:900, lineHeight:1.15, letterSpacing:'-0.025em', marginBottom:16 }}>
            שלום {donorName},<br/>
            <span style={{ opacity:.85, fontWeight:700 }}>הקמפיין שלנו צריך אותך</span>
          </h1>
          <p className="lp-in" style={{ animationDelay:'.17s', fontSize:17, lineHeight:1.75, opacity:.88, maxWidth:560 }}>
            {companyName} מזמינה אותך לקחת חלק פעיל בקמפיין שיוצר שינוי של ממש.
          </p>
        </div>
      </section>

      {/* ── MAIN 2-COL ── */}
      <main style={{ maxWidth:1160, margin:'0 auto', padding:'44px 6% 80px' }}>
        <div className="lp-two-col lp-in" style={{ animationDelay:'.22s', display:'flex', gap:28, alignItems:'flex-start' }}>

          {/* ── LEFT: message ── */}
          <div className="lp-col-left" style={{ width:'48%', flexShrink:0 }}>
            <div style={{
              background:'#fff',
              borderRadius: r,
              border: `1px solid ${rgba(C, 0.12)}`,
              boxShadow: `0 2px 16px ${rgba(C,0.07)}, 0 1px 3px rgba(0,0,0,0.04)`,
              overflow:'hidden',
              position:'sticky', top:82,
            }}>
              {/* card top accent strip */}
              <div style={{ height:4, background:`linear-gradient(90deg, ${rgb(C)}, ${rgb(Cdarker)})` }}/>

              <div style={{ padding:'32px 36px 36px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background: rgba(C,0.1), display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={rgb(C)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <h2 style={{ fontSize:18, fontWeight:800, color:'#111827' }}>מסר מהארגון</h2>
                </div>

                <div style={{ fontSize:16, lineHeight:2, color:'#374151', whiteSpace:'pre-line' }}>
                  {data.personalized_email}
                </div>

                {/* org signature */}
                <div style={{ marginTop:28, paddingTop:20, borderTop:`1px solid rgba(0,0,0,0.06)`, display:'flex', alignItems:'center', gap:10 }}>
                  {logoUrl
                    ? <img src={logoUrl} alt="" style={{ maxHeight:28, maxWidth:80, objectFit:'contain', opacity:.7 }}/>
                    : <span style={{ fontWeight:700, fontSize:14, color: rgba(C,0.7) }}>{companyName}</span>
                  }
                  <span style={{ fontSize:13, color:'#9ca3af' }}>— {companyName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: donation ── */}
          <div className="lp-col-right" style={{ flex:1 }}>
            <div style={{
              background:'#fff',
              borderRadius: r,
              border: `1px solid ${rgba(C,0.12)}`,
              boxShadow: `0 2px 16px ${rgba(C,0.07)}, 0 1px 3px rgba(0,0,0,0.04)`,
              overflow:'hidden',
            }}>
              <div style={{ height:4, background:`linear-gradient(90deg, ${rgb(Cdarker)}, ${rgb(C)})` }}/>

              <div style={{ padding:'32px 32px 36px' }}>
                <h2 style={{ fontSize:20, fontWeight:900, color:'#111827', marginBottom:6 }}>בחר/י סכום תרומה</h2>
                <p style={{ fontSize:14, color:'#6b7280', marginBottom:26, lineHeight:1.6 }}>כל סכום מוביל לשינוי ממשי בשטח.</p>

                {/* options */}
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:28 }}>
                  {options.map((opt, i) => {
                    const sel = selectedAmount === opt.amount;
                    return (
                      <button
                        key={i}
                        className="lp-card-opt"
                        onClick={() => setSel(opt.amount)}
                        style={{
                          position:'relative',
                          textAlign:'right',
                          background: sel ? rgba(C,0.05) : '#fafafa',
                          border: sel ? `2px solid ${rgb(C)}` : '1.5px solid #e5e7eb',
                          borderRadius: r,
                          padding:'18px 20px',
                          display:'flex',
                          alignItems:'center',
                          justifyContent:'space-between',
                          boxShadow: sel ? `0 6px 20px ${rgba(C,0.14)}` : 'none',
                        }}
                      >
                        {/* recommended badge */}
                        {opt.recommended && (
                          <div style={{
                            position:'absolute', top:-11, right:16,
                            background: rgb(C), color:'#fff',
                            fontSize:11, fontWeight:800, borderRadius:999,
                            padding:'3px 10px', letterSpacing:'0.04em',
                          }}>מומלץ</div>
                        )}

                        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                          <span style={{ fontSize:13, fontWeight:600, color: sel ? rgb(C) : '#6b7280', letterSpacing:'0.02em' }}>{opt.label}</span>
                          <span style={{ fontSize:12, color:'#9ca3af' }}>{opt.sub}</span>
                        </div>

                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ fontSize:30, fontWeight:900, color: sel ? rgb(C) : '#1f2937', letterSpacing:'-0.02em', lineHeight:1 }}>
                            ₪{formatAmount(opt.amount)}
                          </span>
                          <div style={{
                            width:22, height:22, borderRadius:'50%',
                            border: sel ? `none` : '1.5px solid #d1d5db',
                            background: sel ? rgb(C) : 'transparent',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            transition:'all .15s',
                            flexShrink:0,
                          }}>
                            {sel && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="2,6.5 4.8,9.5 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* CTA */}
                <button
                  className="lp-btn-main"
                  disabled={!selectedAmount}
                  onClick={() => alert(`נבחר: ₪${formatAmount(selectedAmount)}`)}
                  style={{
                    width:'100%',
                    background: selectedAmount ? `linear-gradient(135deg, ${rgb(C)}, ${rgb(Cdarker)})` : '#e5e7eb',
                    color: selectedAmount ? '#fff' : '#9ca3af',
                    border:'none',
                    borderRadius: variant === 'emotional' ? 999 : r,
                    padding:'17px 24px',
                    fontSize:17,
                    fontWeight:900,
                    cursor: selectedAmount ? 'pointer' : 'default',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    letterSpacing:'0.01em',
                    marginBottom:14,
                  }}
                >
                  {selectedAmount ? `${ctaText} — ₪${formatAmount(selectedAmount)}` : 'יש לבחור סכום'}
                  {selectedAmount && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,5 5,12 12,19"/>
                    </svg>
                  )}
                </button>

                {/* trust row */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, fontSize:12, color:'#9ca3af' }}>
                  {[['🔒','תשלום מאובטח'],['🏦','מוכר ברשויות'],['✉️','אישור מיידי']].map(([icon,label]) => (
                    <span key={label} style={{ display:'flex', alignItems:'center', gap:4 }}>{icon} {label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ padding:'24px 6%', borderTop:'1px solid rgba(0,0,0,0.06)', background:'#fff', textAlign:'center', fontSize:13, color:'#9ca3af' }}>
        © {companyName} · כל הזכויות שמורות
      </footer>

    </div>
  );
}