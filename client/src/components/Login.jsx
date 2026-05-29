import React, { useState } from 'react';
import logoImage from '../assets/logo.png';

const STYLE_ID = 'login-v2-styles';

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

    @keyframes login-fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes login-spin {
      to { transform: rotate(360deg); }
    }

    .login-root {
      min-height: 100vh;
      font-family: 'Heebo', sans-serif;
      direction: rtl;
      display: flex;
      background: #f0f4f8;
      color: #1e293b;
    }

    .login-left {
      width: 380px;
      flex-shrink: 0;
      background: linear-gradient(160deg, #1B6CA8 0%, #1a5a96 60%, #157a3a 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px 40px;
      position: sticky;
      top: 0;
      height: 100vh;
    }

    .login-brand {
      display: flex;
      flex-direction: column;
      gap: 14px;
      align-items: flex-start;
    }

    .login-logo {
      max-width: 190px;
      width: 100%;
      height: auto;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 12px 20px rgba(0,0,0,0.18));
    }

    .login-brand-sub {
      font-size: 14px;
      color: rgba(255,255,255,0.72);
      line-height: 1.6;
      margin-top: 2px;
    }

    .login-perks {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .login-perk {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .login-perk-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      flex-shrink: 0;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.85);
    }

    .login-perk-title {
      font-size: 14px;
      font-weight: 700;
      color: rgba(255,255,255,0.95);
      margin-bottom: 3px;
    }

    .login-perk-desc {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      line-height: 1.5;
    }

    .login-left-footer {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      line-height: 1.7;
    }

    .login-right {
      flex: 1;
      overflow-y: auto;
      padding: 52px 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #f0f4f8;
    }

    .login-header {
      margin-bottom: 36px;
      animation: login-fadeUp .45s ease both;
    }

    .login-step-badge {
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
      margin-bottom: 16px;
      letter-spacing: 0.04em;
    }

    .login-title {
      font-size: clamp(22px, 3vw, 30px);
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.03em;
      margin-bottom: 8px;
    }

    .login-subtitle {
      font-size: 15px;
      color: #64748b;
      line-height: 1.65;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 0;
      animation: login-fadeUp .5s ease both;
    }

    .login-section {
      margin-bottom: 28px;
    }

    .login-section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
    }

    .login-fields {
      display: flex;
      flex-direction: column;
      gap: 13px;
    }

    .login-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .login-label {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }

    .login-label span {
      color: #1B6CA8;
      margin-right: 2px;
    }

    .login-input {
      width: 100%;
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 15px;
      font-size: 15px;
      font-family: 'Heebo', sans-serif;
      color: #0f172a;
      transition: border-color .15s ease, box-shadow .15s ease;
      outline: none;
    }

    .login-input::placeholder {
      color: #94a3b8;
    }

    .login-input:focus {
      border-color: #1B6CA8;
      box-shadow: 0 0 0 3px rgba(27,108,168,0.1);
    }

    .login-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 13px;
      margin-bottom: 20px;
      animation: login-fadeUp .3s ease;
    }

    .login-submit-wrap {
      margin-top: 8px;
    }

    .login-submit {
      width: 100%;
      background: linear-gradient(135deg, #1B6CA8 0%, #3a9e52 100%);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 17px 28px;
      font-size: 16px;
      font-weight: 800;
      font-family: 'Heebo', sans-serif;
      cursor: pointer;
      letter-spacing: 0.01em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: filter .15s ease, transform .15s ease;
      position: relative;
      overflow: hidden;
    }

    .login-submit::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
      pointer-events: none;
    }

    .login-submit:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .login-submit:active {
      transform: translateY(0);
    }

    .login-submit:disabled {
      opacity: .5;
      cursor: not-allowed;
      transform: none;
    }

    .login-spinner {
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: login-spin .7s linear infinite;
    }

    .login-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 20px 0;
      font-size: 12px;
      color: #94a3b8;
    }

    .login-divider::before,
    .login-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }

    .login-switch {
      text-align: center;
      font-size: 14px;
      color: #94a3b8;
    }

    .login-switch-link {
      color: #1B6CA8;
      font-weight: 700;
      cursor: pointer;
      margin-right: 5px;
      text-decoration: underline;
      text-decoration-color: transparent;
      transition: text-decoration-color .15s;
    }

    .login-switch-link:hover {
      text-decoration-color: currentColor;
    }

    @media (max-width: 900px) {
      .login-left { display: none; }
      .login-right { padding: 36px 28px; }
    }
  `;

  document.head.appendChild(s);
}

const PERKS = [
  {
    title: 'גישה מאובטחת',
    desc: 'כל הנתונים מוצפנים ומוגנים ברמה הגבוהה ביותר',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: 'ניהול תורמים',
    desc: 'צפו וערכו את רשימת התורמים שלכם בקלות',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'דשבורד בזמן אמת',
    desc: 'עקבו אחר ביצועי הקמפיין שלכם בכל רגע',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
  },
];

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  injectStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.company);
      } else {
        setError(data.message || 'כניסה נכשלה.');
      }
    } catch {
      setError('שגיאת תקשורת עם השרת.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <aside className="login-left">
        <div className="login-brand">
          <img src={logoImage} alt="Raise Right" className="login-logo" />
          <div className="login-brand-sub">
            מערכת חכמה ליצירת דפי נחיתה מותאמים אישית לכל תורם.
          </div>
        </div>

        <div className="login-perks">
          {PERKS.map((perk, i) => (
            <div className="login-perk" key={i}>
              <div className="login-perk-icon">{perk.icon}</div>
              <div>
                <div className="login-perk-title">{perk.title}</div>
                <div className="login-perk-desc">{perk.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="login-left-footer">
          © Raise Right · כל הנתונים מוצפנים ומאובטחים.<br />
          בכניסה אתם מסכימים לתנאי השימוש.
        </div>
      </aside>

      <div className="login-right">
        <div className="login-header">
          <div className="login-step-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            Raise Right · כניסה לחשבון
          </div>
          <h1 className="login-title">ברוכים השבים 👋</h1>
          <p className="login-subtitle">
            התחברו לאזור הניהול האישי שלכם כדי לנהל קמפיינים ותורמים.
          </p>
        </div>

        {error && <div className="login-error">⚠️ {error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-section">
            <div className="login-section-label">פרטי הכניסה</div>
            <div className="login-fields">
              <div className="login-field">
                <label className="login-label">שם הארגון <span>*</span></label>
                <input
                  className="login-input"
                  type="text"
                  required
                  placeholder="לדוגמה: עמותת אור לחינוך"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="login-field">
                <label className="login-label">סיסמה <span>*</span></label>
                <input
                  className="login-input"
                  type="password"
                  required
                  placeholder="הזינו את הסיסמה שלכם"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="login-submit-wrap">
            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="login-spinner" />
                  מתחבר…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10,17 15,12 10,7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  כניסה לחשבון
                </>
              )}
            </button>
          </div>

          <div className="login-divider">או</div>

          <div className="login-switch">
            אין לכם חשבון עדיין?
            <span className="login-switch-link" onClick={onSwitchToRegister}>
              הרשמה לחץ כאן
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}