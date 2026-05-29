import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';
const STYLE_ID = 'home-v2-styles';

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const s = document.createElement('style');
  s.id = STYLE_ID;

  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    @keyframes home-fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .home-root {
      min-height: 100vh;
      font-family: 'Heebo', sans-serif;
      direction: rtl;
      background: #f0f4f8;
      color: #1e293b;
    }

    /* ── TOP NAV ── */
    .home-nav {
      position: sticky;
      top: 0;
      z-index: 10;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #e2e8f0;
      padding: 0 40px;
      height: 62px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .home-nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .home-nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1B6CA8, #3a9e52);
    }

    .home-nav-name {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .home-nav-logout {
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      padding: 7px 14px;
      font-size: 13px;
      font-weight: 600;
      font-family: 'Heebo', sans-serif;
      color: #64748b;
      cursor: pointer;
      transition: border-color .15s, color .15s, background .15s;
    }

    .home-nav-logout:hover {
      border-color: #cbd5e1;
      color: #0f172a;
      background: #f8fafc;
    }

    /* ── PAGE BODY ── */
    .home-body {
      max-width: 860px;
      margin: 0 auto;
      padding: 44px 32px 80px;
    }

    /* ── HERO HEADER ── */
    .home-hero {
      display: flex;
      align-items: center;
      gap: 22px;
      margin-bottom: 36px;
      animation: home-fadeUp .45s ease both;
    }

    .home-logo-wrap {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      border: 1.5px solid #e2e8f0;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    .home-logo-wrap img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .home-logo-placeholder {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: linear-gradient(135deg, #1B6CA8, #3a9e52);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 28px;
      font-weight: 900;
      color: #fff;
    }

    .home-hero-text {}

    .home-step-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(27,108,168,0.1);
      border: 1px solid rgba(27,108,168,0.2);
      color: #1B6CA8;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      margin-bottom: 10px;
      letter-spacing: 0.04em;
    }

    .home-greeting {
      font-size: clamp(22px, 3vw, 28px);
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.03em;
      margin-bottom: 6px;
    }

    .home-subtitle {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
    }

    /* ── WIDGETS GRID ── */
    .home-widgets {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 28px;
      animation: home-fadeUp .5s ease both;
      animation-delay: .05s;
    }

    .home-widget {
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .home-widget-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(27,108,168,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1B6CA8;
    }

    .home-widget-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #94a3b8;
      text-transform: uppercase;
    }

    .home-widget-value {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
      word-break: break-word;
    }

    .home-widget-value.about {
      font-size: 13px;
      font-weight: 400;
      color: #475569;
      line-height: 1.6;
    }

    .home-color-dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 4px;
      margin-left: 6px;
      vertical-align: middle;
      border: 1.5px solid rgba(0,0,0,0.08);
    }

    /* ── ABOUT SECTION ── */
    .home-about {
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px 22px;
      margin-bottom: 28px;
      animation: home-fadeUp .5s ease both;
      animation-delay: .1s;
    }

    .home-section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
    }

    .home-about-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.75;
    }

    /* ── ACTION BUTTONS ── */
    .home-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      animation: home-fadeUp .5s ease both;
      animation-delay: .15s;
    }

    .home-btn-primary {
      background: linear-gradient(135deg, #1B6CA8 0%, #3a9e52 100%);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 16px 24px;
      font-size: 15px;
      font-weight: 800;
      font-family: 'Heebo', sans-serif;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: filter .15s, transform .15s;
      position: relative;
      overflow: hidden;
    }

    .home-btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
      pointer-events: none;
    }

    .home-btn-primary:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }

    .home-btn-primary:active {
      transform: translateY(0);
    }

    .home-btn-secondary {
      background: #fff;
      color: #1B6CA8;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 24px;
      font-size: 15px;
      font-weight: 700;
      font-family: 'Heebo', sans-serif;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: border-color .15s, background .15s, transform .15s;
    }

    .home-btn-secondary:hover {
      border-color: #1B6CA8;
      background: rgba(27,108,168,0.04);
      transform: translateY(-1px);
    }

    .home-btn-secondary:active {
      transform: translateY(0);
    }

    @media (max-width: 700px) {
      .home-nav { padding: 0 20px; }
      .home-body { padding: 28px 20px 60px; }
      .home-widgets { grid-template-columns: 1fr; }
      .home-actions { grid-template-columns: 1fr; }
    }
  `;

  document.head.appendChild(s);
}

export default function Home({ company, onNavigateToEdit, onLogout }) {
  const navigate = useNavigate();

  injectStyles();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const initial = company.company_name?.[0]?.toUpperCase() || 'R';

  return (
    <div className="home-root">

      {/* NAV */}
      <nav className="home-nav">
        <div className="home-nav-brand">
          <img src={logoImage} alt="Raise Right" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
        </div>
        <button className="home-nav-logout" onClick={handleLogoutClick}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          התנתקות
        </button>
      </nav>

      {/* BODY */}
      <div className="home-body">

        {/* HERO */}
        <div className="home-hero">
          {company.logo_path ? (
            <div className="home-logo-wrap">
              <img src={`http://localhost:5000${company.logo_path}`} alt="לוגו" />
            </div>
          ) : (
            <div className="home-logo-placeholder">{initial}</div>
          )}

          <div className="home-hero-text">
            <div className="home-step-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              לוח בקרה
            </div>
            <h1 className="home-greeting">שלום, {company.company_name}!</h1>
            <p className="home-subtitle">נהלו את פרטי הארגון, עקבו אחר הקמפיינים ויצרו חדשים.</p>
          </div>
        </div>

        {/* STATS WIDGETS */}
        <div className="home-widgets">
          <div className="home-widget">
            <div className="home-widget-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="home-widget-label">יעד גיוס</span>
            <span className="home-widget-value">
              ₪{Number(company.fundraising_goal || 0).toLocaleString()}
            </span>
          </div>

          <div className="home-widget">
            <div className="home-widget-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <span className="home-widget-label">צבע מותג</span>
            <span className="home-widget-value">
              <span className="home-color-dot" style={{ backgroundColor: company.company_color }} />
              {company.company_color}
            </span>
          </div>

          <div className="home-widget">
            <div className="home-widget-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="home-widget-label">תורמים</span>
            <span className="home-widget-value">
              {company.donor_count != null ? company.donor_count.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* ABOUT */}
        {company.about_text && (
          <div className="home-about">
            <div className="home-section-label">קצת עלינו</div>
            <p className="home-about-text">{company.about_text}</p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="home-actions">
          <button className="home-btn-primary" onClick={() => navigate('/create-campaign')}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            צור קמפיין חדש
          </button>

          <button className="home-btn-secondary" onClick={onNavigateToEdit}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            עריכת פרופיל
          </button>
        </div>

      </div>
    </div>
  );
}