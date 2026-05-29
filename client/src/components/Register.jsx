import React, { useState } from 'react';
import logoImage from '../assets/logo.png';

const STYLE_ID = 'reg-v2-styles';

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

    @keyframes reg-fadeUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes reg-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes reg-slideIn {
      from {
        opacity: 0;
        transform: translateX(10px);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .reg-root {
      min-height: 100vh;
      font-family: 'Heebo', sans-serif;
      direction: rtl;
      display: flex;
      background: #f0f4f8;
      color: #1e293b;
    }

    .reg-left {
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

    .reg-brand {
      display: flex;
      flex-direction: column;
      gap: 14px;
      align-items: flex-start;
    }

    .reg-logo {
      max-width: 190px;
      width: 100%;
      height: auto;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.18));
    }

    .reg-brand-sub {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.72);
      line-height: 1.6;
      margin-top: 2px;
    }

    .reg-steps {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .reg-step {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .reg-step-num {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.6);
      transition: background .2s, color .2s;
    }

    .reg-step-num.active {
      background: #fff;
      border-color: #fff;
      color: var(--accent, #1B6CA8);
    }

    .reg-step-num.done {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
      color: #fff;
    }

    .reg-step-info {
      padding-top: 2px;
    }

    .reg-step-title {
      font-size: 14px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 3px;
    }

    .reg-step-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.5;
    }

    .reg-left-footer {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      line-height: 1.7;
    }

    .reg-right {
      flex: 1;
      overflow-y: auto;
      padding: 52px 60px;
      display: flex;
      flex-direction: column;
      background: #f0f4f8;
    }

    .reg-header {
      margin-bottom: 36px;
      animation: reg-fadeUp .45s ease both;
    }

    .reg-step-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(27, 108, 168, 0.1);
      border: 1px solid rgba(27, 108, 168, 0.2);
      color: var(--accent, #1B6CA8);
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      margin-bottom: 16px;
      letter-spacing: 0.04em;
    }

    .reg-title {
      font-size: clamp(22px, 3vw, 30px);
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.03em;
      margin-bottom: 8px;
    }

    .reg-subtitle {
      font-size: 15px;
      color: #64748b;
      line-height: 1.65;
    }

    .reg-form {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .reg-section {
      margin-bottom: 32px;
      animation: reg-fadeUp .5s ease both;
    }

    .reg-section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
    }

    .reg-fields {
      display: flex;
      flex-direction: column;
      gap: 13px;
    }

    .reg-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 13px;
    }

    .reg-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .reg-label {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }

    .reg-label span {
      color: var(--accent, #1B6CA8);
      margin-right: 2px;
    }

    .reg-input,
    .reg-textarea {
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

    .reg-input::placeholder,
    .reg-textarea::placeholder {
      color: #94a3b8;
    }

    .reg-input:focus,
    .reg-textarea:focus {
      border-color: var(--accent, #1B6CA8);
      box-shadow: 0 0 0 3px rgba(27, 108, 168, 0.1);
    }

    .reg-textarea {
      resize: vertical;
      min-height: 90px;
    }

    .reg-color-row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 14px;
      transition: border-color .15s;
    }

    .reg-color-row:focus-within {
      border-color: var(--accent, #1B6CA8);
    }

    .reg-color-swatch {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      flex-shrink: 0;
      border: 2px solid rgba(0, 0, 0, 0.08);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .reg-color-swatch input[type="color"] {
      position: absolute;
      inset: -4px;
      width: calc(100% + 8px);
      height: calc(100% + 8px);
      opacity: 0;
      cursor: pointer;
      border: none;
    }

    .reg-color-hex {
      font-size: 14px;
      font-weight: 700;
      color: #334155;
      letter-spacing: 0.04em;
    }

    .reg-color-label {
      font-size: 12px;
      color: #94a3b8;
      margin-right: auto;
    }

    .reg-upload {
      position: relative;
      border: 1.5px dashed #cbd5e1;
      border-radius: 10px;
      padding: 18px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      transition: border-color .15s, background .15s;
      background: #fff;
    }

    .reg-upload:hover,
    .reg-upload.has-file {
      border-color: var(--accent, #1B6CA8);
      background: rgba(27, 108, 168, 0.03);
    }

    .reg-upload input[type="file"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }

    .reg-upload-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      flex-shrink: 0;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .reg-upload-info {
      flex: 1;
    }

    .reg-upload-title {
      font-size: 14px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 2px;
    }

    .reg-upload-sub {
      font-size: 12px;
      color: #94a3b8;
    }

    .reg-upload-badge {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent, #1B6CA8);
      background: rgba(27, 108, 168, 0.1);
      border: 1px solid rgba(27, 108, 168, 0.2);
      border-radius: 999px;
      padding: 3px 10px;
      animation: reg-slideIn .2s ease;
    }

    .reg-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 13px;
      margin-bottom: 20px;
      animation: reg-fadeUp .3s ease;
    }

    .reg-submit-wrap {
      margin-top: 8px;
    }

    .reg-submit {
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

    .reg-submit::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
      pointer-events: none;
    }

    .reg-submit:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .reg-submit:active {
      transform: translateY(0);
    }

    .reg-submit:disabled {
      opacity: .5;
      cursor: not-allowed;
      transform: none;
    }

    .reg-spinner {
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: reg-spin .7s linear infinite;
    }

    .reg-switch {
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
      color: #94a3b8;
    }

    .reg-switch-link {
      color: var(--accent, #1B6CA8);
      font-weight: 700;
      cursor: pointer;
      margin-right: 5px;
      text-decoration: underline;
      text-decoration-color: transparent;
      transition: text-decoration-color .15s;
    }

    .reg-switch-link:hover {
      text-decoration-color: currentColor;
    }

    @media (max-width: 900px) {
      .reg-left {
        display: none;
      }

      .reg-right {
        padding: 36px 28px;
      }

      .reg-row {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(s);
}

const STEPS = [
  { title: 'פרטי הארגון', desc: 'שם, צבע מותג ולוגו' },
  { title: 'תיאור ומטרה', desc: 'על מה הקמפיין?' },
  { title: 'רשימת תורמים', desc: 'העלאת קובץ CSV' },
  { title: 'השקת הפרופיל', desc: 'הכל מוכן — נצא לדרך' },
];

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [fundraisingGoal, setFundraisingGoal] = useState('');
  const [companyColor, setCompanyColor] = useState('#1B6CA8');
  const [logo, setLogo] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const activeStep = (() => {
    if (csvFile) return 3;
    if (aboutText || fundraisingGoal) return 2;
    if (companyName || logo) return 1;
    return 0;
  })();

  injectStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();

    formData.append('companyName', companyName);
    formData.append('password', password);
    formData.append('aboutText', aboutText);
    formData.append('fundraisingGoal', fundraisingGoal);
    formData.append('companyColor', companyColor);

    if (logo) {
      formData.append('logo', logo);
    }

    if (csvFile) {
      formData.append('csvFile', csvFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onRegisterSuccess();
      } else {
        setError(data.message || 'הרשמה נכשלה.');
      }
    } catch {
      setError('הרשמה נכשלה. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-root" style={{ '--accent': companyColor }}>
      <aside className="reg-left">
        <div className="reg-brand">
          <img
            src={logoImage}
            alt="Raise Right"
            className="reg-logo"
          />

          <div className="reg-brand-sub">
            מערכת חכמה ליצירת דפי נחיתה מותאמים אישית לכל תורם.
          </div>
        </div>

        <div className="reg-steps">
          {STEPS.map((step, i) => (
            <div className="reg-step" key={i}>
              <div
                className={`reg-step-num ${
                  i < activeStep ? 'done' : i === activeStep ? 'active' : ''
                }`}
              >
                {i < activeStep ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <polyline
                      points="2,6.5 4.8,9.5 10,3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>

              <div className="reg-step-info">
                <div className="reg-step-title">{step.title}</div>
                <div className="reg-step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="reg-left-footer">
          © Raise Right · כל הנתונים מוצפנים ומאובטחים.
          <br />
          בהרשמה אתם מסכימים לתנאי השימוש.
        </div>
      </aside>

      <div className="reg-right">
        <div className="reg-header">
          <div className="reg-step-badge">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'currentColor',
                display: 'inline-block',
              }}
            />
            Raise Right · הרשמת ארגון
          </div>

          <h1 className="reg-title">יצירת פרופיל ארגון חדש</h1>

          <p className="reg-subtitle">
            מלאו את הפרטים כדי להפעיל דפי נחיתה חכמים ומותאמים אישית לכל תורם.
          </p>
        </div>

        {error && <div className="reg-error">⚠️ {error}</div>}

        <form className="reg-form" onSubmit={handleSubmit}>
          <div className="reg-section" style={{ animationDelay: '.05s' }}>
            <div className="reg-section-label">זהות הארגון</div>

            <div className="reg-fields">
              <div className="reg-row">
                <div className="reg-field">
                  <label className="reg-label">
                    שם הארגון <span>*</span>
                  </label>

                  <input
                    className="reg-input"
                    type="text"
                    required
                    placeholder="לדוגמה: עמותת אור לחינוך"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="reg-field">
                  <label className="reg-label">
                    סיסמה <span>*</span>
                  </label>

                  <input
                    className="reg-input"
                    type="password"
                    required
                    placeholder="לפחות 8 תווים"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">צבע מותג</label>

                <div className="reg-color-row">
                  <div
                    className="reg-color-swatch"
                    style={{ background: companyColor }}
                  >
                    <input
                      type="color"
                      value={companyColor}
                      onChange={(e) => setCompanyColor(e.target.value)}
                    />
                  </div>

                  <span className="reg-color-hex">
                    {companyColor.toUpperCase()}
                  </span>

                  <span className="reg-color-label">
                    לחצו על הצבע לשינוי
                  </span>
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">לוגו הארגון</label>

                <label className={`reg-upload ${logo ? 'has-file' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogo(e.target.files[0])}
                  />

                  <div className="reg-upload-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21,15 16,10 5,21" />
                    </svg>
                  </div>

                  <div className="reg-upload-info">
                    <div className="reg-upload-title">
                      {logo ? logo.name : 'בחרו קובץ תמונה'}
                    </div>

                    <div className="reg-upload-sub">
                      PNG, JPG, SVG · עד 5MB
                    </div>
                  </div>

                  {logo && <span className="reg-upload-badge">✓ הועלה</span>}
                </label>
              </div>
            </div>
          </div>

          <div className="reg-section" style={{ animationDelay: '.1s' }}>
            <div className="reg-section-label">על הקמפיין</div>

            <div className="reg-fields">
              <div className="reg-field">
                <label className="reg-label">קצת עלינו</label>

                <textarea
                  className="reg-textarea"
                  placeholder="ספרו בכמה משפטים מה הארגון עושה ולמה זה חשוב…"
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                />
              </div>

              <div className="reg-field">
                <label className="reg-label">יעד הגיוס</label>

                <input
                  className="reg-input"
                  type="text"
                  placeholder="לדוגמה: 500,000 ₪ לפתיחת כיתות חדשות"
                  value={fundraisingGoal}
                  onChange={(e) => setFundraisingGoal(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="reg-section" style={{ animationDelay: '.15s' }}>
            <div className="reg-section-label">רשימת תורמים</div>

            <label className={`reg-upload ${csvFile ? 'has-file' : ''}`}>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
              />

              <div className="reg-upload-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9,15 12,12 15,15" />
                </svg>
              </div>

              <div className="reg-upload-info">
                <div className="reg-upload-title">
                  {csvFile ? csvFile.name : 'העלאת קובץ CSV'}
                </div>

                <div className="reg-upload-sub">
                  עמודות: שם, מייל, טלפון, סכום מומלץ
                </div>
              </div>

              {csvFile && <span className="reg-upload-badge">✓ הועלה</span>}
            </label>
          </div>

          <div className="reg-submit-wrap">
            <button className="reg-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="reg-spinner" />
                  מרשים…
                </>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22,4 12,14.01 9,11.01" />
                  </svg>
                  סיום הרשמה ויצירת פרופיל
                </>
              )}
            </button>
          </div>

          <div className="reg-switch">
            כבר רשום?
            <span className="reg-switch-link" onClick={onSwitchToLogin}>
              כניסה לחשבון
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}