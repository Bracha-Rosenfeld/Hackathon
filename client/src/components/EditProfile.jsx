import { useState } from 'react';
import logoImage from '../assets/logo.png';

const STYLE_ID = 'edit-v2-styles';

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

    @keyframes edit-fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes edit-spin {
      to { transform: rotate(360deg); }
    }

    @keyframes edit-slideIn {
      from { opacity: 0; transform: translateX(10px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .edit-root {
      min-height: 100vh;
      font-family: 'Heebo', sans-serif;
      direction: rtl;
      background: #f0f4f8;
      color: #1e293b;
    }

    /* ── NAV ── */
    .edit-nav {
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

    .edit-nav-logo {
      height: 32px;
      width: auto;
      object-fit: contain;
    }

    .edit-nav-back {
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

    .edit-nav-back:hover {
      border-color: #cbd5e1;
      color: #0f172a;
      background: #f8fafc;
    }

    /* ── BODY ── */
    .edit-body {
      max-width: 680px;
      margin: 0 auto;
      padding: 44px 32px 80px;
    }

    /* ── HEADER ── */
    .edit-header {
      margin-bottom: 36px;
      animation: edit-fadeUp .45s ease both;
    }

    .edit-badge {
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
      margin-bottom: 14px;
      letter-spacing: 0.04em;
    }

    .edit-title {
      font-size: clamp(22px, 3vw, 28px);
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.03em;
      margin-bottom: 8px;
    }

    .edit-subtitle {
      font-size: 14px;
      color: #64748b;
      line-height: 1.65;
    }

    /* ── ERROR ── */
    .edit-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 13px;
      margin-bottom: 20px;
      animation: edit-fadeUp .3s ease;
    }

    /* ── CARD ── */
    .edit-card {
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px;
      animation: edit-fadeUp .5s ease both;
      animation-delay: .05s;
    }

    .edit-section {
      margin-bottom: 32px;
    }

    .edit-section:last-of-type {
      margin-bottom: 0;
    }

    .edit-section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
    }

    .edit-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .edit-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .edit-label {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }

    .edit-input,
    .edit-textarea {
      width: 100%;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 15px;
      font-size: 15px;
      font-family: 'Heebo', sans-serif;
      color: #0f172a;
      transition: border-color .15s, box-shadow .15s, background .15s;
      outline: none;
    }

    .edit-input::placeholder,
    .edit-textarea::placeholder {
      color: #94a3b8;
    }

    .edit-input:focus,
    .edit-textarea:focus {
      border-color: #1B6CA8;
      box-shadow: 0 0 0 3px rgba(27,108,168,0.1);
      background: #fff;
    }

    .edit-textarea {
      resize: vertical;
      min-height: 100px;
    }

    /* ── COLOR ROW ── */
    .edit-color-row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 14px;
      transition: border-color .15s;
    }

    .edit-color-row:focus-within {
      border-color: #1B6CA8;
      background: #fff;
    }

    .edit-color-swatch {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      flex-shrink: 0;
      border: 2px solid rgba(0,0,0,0.08);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .edit-color-swatch input[type="color"] {
      position: absolute;
      inset: -4px;
      width: calc(100% + 8px);
      height: calc(100% + 8px);
      opacity: 0;
      cursor: pointer;
      border: none;
    }

    .edit-color-hex {
      font-size: 14px;
      font-weight: 700;
      color: #334155;
      letter-spacing: 0.04em;
    }

    .edit-color-hint {
      font-size: 12px;
      color: #94a3b8;
      margin-right: auto;
    }

    /* ── UPLOAD ── */
    .edit-upload {
      position: relative;
      border: 1.5px dashed #cbd5e1;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      transition: border-color .15s, background .15s;
      background: #f8fafc;
    }

    .edit-upload:hover,
    .edit-upload.has-file {
      border-color: #1B6CA8;
      background: rgba(27,108,168,0.03);
    }

    .edit-upload input[type="file"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }

    .edit-upload-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      flex-shrink: 0;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .edit-upload-title {
      font-size: 14px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 2px;
    }

    .edit-upload-sub {
      font-size: 12px;
      color: #94a3b8;
    }

    .edit-upload-badge {
      font-size: 11px;
      font-weight: 700;
      color: #1B6CA8;
      background: rgba(27,108,168,0.1);
      border: 1px solid rgba(27,108,168,0.2);
      border-radius: 999px;
      padding: 3px 10px;
      margin-right: auto;
      animation: edit-slideIn .2s ease;
      white-space: nowrap;
    }

    /* ── DIVIDER ── */
    .edit-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 28px 0;
    }

    /* ── ACTIONS ── */
    .edit-actions {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      margin-top: 28px;
    }

    .edit-submit {
      background: linear-gradient(135deg, #1B6CA8 0%, #3a9e52 100%);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 15px 28px;
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

    .edit-submit::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
      pointer-events: none;
    }

    .edit-submit:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }

    .edit-submit:active {
      transform: translateY(0);
    }

    .edit-submit:disabled {
      opacity: .5;
      cursor: not-allowed;
      transform: none;
    }

    .edit-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: edit-spin .7s linear infinite;
    }

    .edit-cancel {
      background: none;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 15px 20px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Heebo', sans-serif;
      color: #64748b;
      cursor: pointer;
      white-space: nowrap;
      transition: border-color .15s, color .15s, background .15s;
    }

    .edit-cancel:hover {
      border-color: #cbd5e1;
      color: #0f172a;
      background: #f8fafc;
    }

    @media (max-width: 700px) {
      .edit-nav  { padding: 0 20px; }
      .edit-body { padding: 28px 20px 60px; }
      .edit-card { padding: 22px 18px; }
      .edit-actions { grid-template-columns: 1fr; }
    }
  `;

  document.head.appendChild(s);
}

export default function EditProfile({ company, onUpdateSuccess, onCancel }) {
  const [aboutText, setAboutText]           = useState(company.about_text || '');
  const [fundraisingGoal, setFundraisingGoal] = useState(company.fundraising_goal || '');
  const [companyColor, setCompanyColor]     = useState(company.company_color || '#1B6CA8');
  const [logo, setLogo]                     = useState(null);
  const [csvFile, setCsvFile]               = useState(null);
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);

  injectStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('aboutText', aboutText);
    formData.append('fundraisingGoal', fundraisingGoal);
    formData.append('companyColor', companyColor);
    if (logo)    formData.append('logo', logo);
    if (csvFile) formData.append('csvFile', csvFile);

    try {
      const response = await fetch(`http://localhost:5000/api/company/${company.id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        onUpdateSuccess(data.company);
      } else {
        setError(data.message || 'עדכון הפרטים נכשל.');
      }
    } catch {
      setError('שגיאת תקשורת עם השרת.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-root" style={{ '--accent': companyColor }}>

      {/* NAV */}
      <nav className="edit-nav">
        <img src={logoImage} alt="Raise Right" className="edit-nav-logo" />
        <button className="edit-nav-back" onClick={onCancel}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          חזרה לדשבורד
        </button>
      </nav>

      <div className="edit-body">

        {/* HEADER */}
        <div className="edit-header">
          <div className="edit-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            עריכת פרופיל
          </div>
          <h1 className="edit-title">עדכון פרטי הארגון</h1>
          <p className="edit-subtitle">עדכנו את תיאור הארגון, צבע המותג, הלוגו ורשימת התורמים.</p>
        </div>

        {error && <div className="edit-error">⚠️ {error}</div>}

        <div className="edit-card">
          <form onSubmit={handleSubmit}>

            {/* SECTION — תוכן */}
            <div className="edit-section">
              <div className="edit-section-label">תוכן ומידע</div>
              <div className="edit-fields">

                <div className="edit-field">
                  <label className="edit-label">קצת עלינו</label>
                  <textarea
                    className="edit-textarea"
                    placeholder="ספרו בכמה משפטים מה הארגון עושה ולמה זה חשוב…"
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                  />
                </div>

                <div className="edit-field">
                  <label className="edit-label">יעד גיוס בשקלים</label>
                  <input
                    className="edit-input"
                    type="number"
                    placeholder="לדוגמה: 500000"
                    value={fundraisingGoal}
                    onChange={(e) => setFundraisingGoal(e.target.value)}
                  />
                </div>

              </div>
            </div>

            <div className="edit-divider" />

            {/* SECTION — מיתוג */}
            <div className="edit-section">
              <div className="edit-section-label">מיתוג וקבצים</div>
              <div className="edit-fields">

                <div className="edit-field">
                  <label className="edit-label">צבע מותג</label>
                  <div className="edit-color-row">
                    <div className="edit-color-swatch" style={{ background: companyColor }}>
                      <input
                        type="color"
                        value={companyColor}
                        onChange={(e) => setCompanyColor(e.target.value)}
                      />
                    </div>
                    <span className="edit-color-hex">{companyColor.toUpperCase()}</span>
                    <span className="edit-color-hint">לחצו על הצבע לשינוי</span>
                  </div>
                </div>

                <div className="edit-field">
                  <label className="edit-label">לוגו הארגון</label>
                  <label className={`edit-upload ${logo ? 'has-file' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogo(e.target.files[0])}
                    />
                    <div className="edit-upload-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21,15 16,10 5,21" />
                      </svg>
                    </div>
                    <div>
                      <div className="edit-upload-title">{logo ? logo.name : 'בחרו קובץ תמונה'}</div>
                      <div className="edit-upload-sub">PNG, JPG, SVG · עד 5MB</div>
                    </div>
                    {logo && <span className="edit-upload-badge">✓ הועלה</span>}
                  </label>
                </div>

                <div className="edit-field">
                  <label className="edit-label">רשימת תורמים</label>
                  <label className={`edit-upload ${csvFile ? 'has-file' : ''}`}>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files[0])}
                    />
                    <div className="edit-upload-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <polyline points="9,15 12,12 15,15" />
                      </svg>
                    </div>
                    <div>
                      <div className="edit-upload-title">{csvFile ? csvFile.name : 'העלאת קובץ CSV'}</div>
                      <div className="edit-upload-sub">עמודות: שם, מייל, טלפון, סכום מומלץ</div>
                    </div>
                    {csvFile && <span className="edit-upload-badge">✓ הועלה</span>}
                  </label>
                </div>

              </div>
            </div>

            {/* ACTIONS */}
            <div className="edit-actions">
              <button className="edit-submit" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="edit-spinner" />
                    שומר שינויים…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17,21 17,13 7,13 7,21" />
                      <polyline points="7,3 7,8 15,8" />
                    </svg>
                    שמור שינויים
                  </>
                )}
              </button>

              <button className="edit-cancel" type="button" onClick={onCancel}>
                ביטול
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}