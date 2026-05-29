import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const STYLE_ID = 'campaign-v2-styles';

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

    @keyframes camp-fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes camp-spin {
      to { transform: rotate(360deg); }
    }

    @keyframes camp-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @keyframes camp-pop {
      0% { opacity: 0; transform: scale(0.85); }
      60% { transform: scale(1.04); }
      100% { opacity: 1; transform: scale(1); }
    }

    .camp-root {
      min-height: 100vh;
      font-family: 'Heebo', sans-serif;
      direction: rtl;
      background: #f0f4f8;
      color: #1e293b;
    }

    .camp-nav {
      position: sticky;
      top: 0;
      z-index: 10;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #e2e8f0;
      padding: 0 48px;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .camp-nav-logo {
      height: 38px;
      width: auto;
      object-fit: contain;
      display: block;
    }

    .camp-nav-back {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px 15px;
      font-size: 13px;
      font-weight: 700;
      font-family: 'Heebo', sans-serif;
      color: #64748b;
      cursor: pointer;
      transition: border-color .15s, color .15s, background .15s, transform .15s;
    }

    .camp-nav-back:hover {
      border-color: #cbd5e1;
      color: #0f172a;
      background: #f8fafc;
      transform: translateY(-1px);
    }

    .camp-body {
      width: min(1180px, calc(100% - 48px));
      margin: 0 auto;
      padding: 44px 0 80px;
    }

    .camp-header {
      margin-bottom: 28px;
      animation: camp-fadeUp .45s ease both;
    }

    .camp-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(27, 108, 168, 0.1);
      border: 1px solid rgba(27, 108, 168, 0.2);
      color: #1B6CA8;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      margin-bottom: 14px;
      letter-spacing: 0.04em;
    }

    .camp-title {
      font-size: clamp(26px, 3vw, 38px);
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.04em;
      margin-bottom: 8px;
    }

    .camp-subtitle {
      max-width: 760px;
      font-size: 15px;
      color: #64748b;
      line-height: 1.7;
    }

    .camp-subtitle strong {
      color: #1B6CA8;
      font-weight: 800;
    }

    .camp-card {
      width: 100%;
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 20px;
      padding: 38px 42px;
      animation: camp-fadeUp .5s ease both;
      animation-delay: .05s;
      box-shadow:
        0 20px 45px -28px rgba(15, 23, 42, 0.35),
        0 1px 0 rgba(255, 255, 255, 0.8) inset;
    }

    .camp-section-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 22px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
    }

    .camp-fields {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .camp-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: start;
    }

    .camp-field {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .camp-field-full {
      grid-column: 1 / -1;
    }

    .camp-label {
      font-size: 13px;
      font-weight: 700;
      color: #475569;
    }

    .camp-label span {
      color: #1B6CA8;
      margin-right: 2px;
    }

    .camp-input,
    .camp-textarea {
      width: 100%;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 13px 15px;
      font-size: 15px;
      font-family: 'Heebo', sans-serif;
      color: #0f172a;
      transition: border-color .15s, box-shadow .15s, background .15s;
      outline: none;
    }

    .camp-input::placeholder,
    .camp-textarea::placeholder {
      color: #94a3b8;
    }

    .camp-input:focus,
    .camp-textarea:focus {
      border-color: #1B6CA8;
      box-shadow: 0 0 0 3px rgba(27, 108, 168, 0.1);
      background: #fff;
    }

    .camp-input:disabled,
    .camp-textarea:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    .camp-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .camp-submit-wrap {
      margin-top: 8px;
    }

    .camp-submit {
      width: 100%;
      background: linear-gradient(135deg, #1B6CA8 0%, #3a9e52 100%);
      color: #fff;
      border: none;
      border-radius: 14px;
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
      transition: filter .15s, transform .15s, box-shadow .15s;
      position: relative;
      overflow: hidden;
      box-shadow: 0 14px 26px -14px rgba(27, 108, 168, 0.75);
    }

    .camp-submit::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.13) 0%, transparent 60%);
      pointer-events: none;
    }

    .camp-submit:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
      box-shadow: 0 18px 34px -16px rgba(27, 108, 168, 0.85);
    }

    .camp-submit:active {
      transform: translateY(0);
    }

    .camp-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
      padding: 30px 0 16px;
    }

    .camp-spinner-wrap {
      position: relative;
      width: 64px;
      height: 64px;
    }

    .camp-spinner {
      width: 64px;
      height: 64px;
      border: 3px solid #e2e8f0;
      border-top-color: #1B6CA8;
      border-radius: 50%;
      animation: camp-spin .8s linear infinite;
    }

    .camp-spinner-inner {
      position: absolute;
      inset: 9px;
      border: 2px solid #e2e8f0;
      border-top-color: #3a9e52;
      border-radius: 50%;
      animation: camp-spin .5s linear infinite reverse;
    }

    .camp-loading-title {
      font-size: 17px;
      font-weight: 900;
      color: #0f172a;
    }

    .camp-loading-steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      width: 100%;
      margin-top: 6px;
    }

    .camp-loading-step {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 13px;
      color: #64748b;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 12px;
      animation: camp-pulse 2s ease infinite;
      text-align: center;
    }

    .camp-loading-step:nth-child(2) { animation-delay: .3s; }
    .camp-loading-step:nth-child(3) { animation-delay: .6s; }

    .camp-loading-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #1B6CA8;
      flex-shrink: 0;
    }

    .camp-success {
      width: 100%;
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 20px;
      padding: 42px;
      animation: camp-pop .5s ease both;
      box-shadow:
        0 20px 45px -28px rgba(15, 23, 42, 0.35),
        0 1px 0 rgba(255, 255, 255, 0.8) inset;
    }

    .camp-success-icon {
      width: 68px;
      height: 68px;
      border-radius: 20px;
      background: linear-gradient(135deg, #1B6CA8 0%, #3a9e52 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .camp-success-title {
      font-size: clamp(24px, 3vw, 34px);
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.03em;
      margin-bottom: 8px;
      text-align: center;
    }

    .camp-success-sub {
      max-width: 720px;
      font-size: 15px;
      color: #64748b;
      line-height: 1.7;
      text-align: center;
      margin: 0 auto 30px;
    }

    .camp-links-box {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    .camp-links-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #94a3b8;
      text-transform: uppercase;
    }

    .camp-links-list {
      display: flex;
      flex-direction: column;
    }

    .camp-link-row {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto;
      align-items: center;
      gap: 18px;
      padding: 16px 20px;
      border-bottom: 1px solid #f1f5f9;
      transition: background .15s;
    }

    .camp-link-row:last-child {
      border-bottom: none;
    }

    .camp-link-row:hover {
      background: #fff;
    }

    .camp-link-info {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .camp-link-name {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      word-break: break-word;
    }

    .camp-link-email {
      font-size: 13px;
      color: #94a3b8;
      word-break: break-word;
      direction: ltr;
      text-align: right;
    }

    .camp-link-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: rgba(27, 108, 168, 0.08);
      border: 1px solid rgba(27, 108, 168, 0.18);
      color: #1B6CA8;
      border-radius: 10px;
      padding: 9px 15px;
      font-size: 13px;
      font-weight: 800;
      font-family: 'Heebo', sans-serif;
      text-decoration: none;
      transition: background .15s, border-color .15s, transform .15s;
      white-space: nowrap;
    }

    .camp-link-btn:hover {
      background: rgba(27, 108, 168, 0.15);
      border-color: rgba(27, 108, 168, 0.3);
      transform: translateY(-1px);
    }

    .camp-back-btn {
      width: 100%;
      background: linear-gradient(135deg, #1B6CA8 0%, #3a9e52 100%);
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 17px 28px;
      font-size: 16px;
      font-weight: 800;
      font-family: 'Heebo', sans-serif;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: filter .15s, transform .15s, box-shadow .15s;
      box-shadow: 0 14px 26px -14px rgba(27, 108, 168, 0.75);
    }

    .camp-back-btn:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
      box-shadow: 0 18px 34px -16px rgba(27, 108, 168, 0.85);
    }

    @media (max-width: 900px) {
      .camp-loading-steps {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 700px) {
      .camp-nav {
        padding: 0 20px;
      }

      .camp-nav-logo {
        height: 32px;
      }

      .camp-body {
        width: calc(100% - 28px);
        padding: 28px 0 60px;
      }

      .camp-card,
      .camp-success {
        padding: 24px 18px;
        border-radius: 18px;
      }

      .camp-form-grid {
        grid-template-columns: 1fr;
      }

      .camp-link-row {
        grid-template-columns: 1fr;
        align-items: flex-start;
      }

      .camp-link-btn {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(s);
}

export default function CreateCampaign({ company }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campaignName: '',
    campaignGoal: '',
    fundingTarget: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState([]);

  injectStyles();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:5000/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignName: formData.campaignName,
          campaignGoal: formData.campaignGoal,
          fundingTarget: formData.fundingTarget,
          companyId: company?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.generatedLinks && Array.isArray(data.generatedLinks)) {
          setGeneratedLinks(data.generatedLinks);
        }

        setIsGenerating(false);
        setIsSuccess(true);
      } else {
        throw new Error(data.message || 'משהו השתבש בשרת');
      }
    } catch (error) {
      console.error('שגיאה:', error);
      setIsGenerating(false);
      alert(error.message || 'משהו השתבש, נסה שנית.');
    }
  };

  return (
    <div className="camp-root">
      <nav className="camp-nav">
        <img src={logoImage} alt="Raise Right" className="camp-nav-logo" />

        <button className="camp-nav-back" onClick={() => navigate('/dashboard')}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15,18 9,12 15,6" />
          </svg>
          חזרה לדשבורד
        </button>
      </nav>

      <div className="camp-body">
        {isSuccess ? (
          <div className="camp-success">
            <div className="camp-success-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>

            <h1 className="camp-success-title">הקמפיין נוצר בהצלחה!</h1>

            <p className="camp-success-sub">
              הנתונים נשמרו וסוכני ה-AI סיימו לבנות דפי נחיתה מותאמים אישית לכל תורם.
            </p>

            {generatedLinks.length > 0 && (
              <div className="camp-links-box">
                <div className="camp-links-header">דפי נחיתה שנוצרו</div>

                <div className="camp-links-list">
                  {generatedLinks.map((item, index) => (
                    <div key={index} className="camp-link-row">
                      <div className="camp-link-info">
                        <span className="camp-link-name">
                          {item.name || 'תורם ללא שם'}
                        </span>

                        <span className="camp-link-email">
                          {item.email}
                        </span>
                      </div>

                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="camp-link-btn"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15,3 21,3 21,9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        צפייה בדף
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="camp-back-btn" onClick={() => navigate('/dashboard')}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15,18 9,12 15,6" />
              </svg>
              חזרה לדשבורד
            </button>
          </div>
        ) : (
          <>
            <div className="camp-header">
              <div className="camp-badge">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'currentColor',
                    display: 'inline-block',
                  }}
                />
                קמפיין חדש
              </div>

              <h1 className="camp-title">יצירת קמפיין</h1>

              <p className="camp-subtitle">
                עבור <strong>{company?.company_name}</strong> — מלאו את הפרטים ו-AI יבנה דפי נחיתה לכל תורם.
              </p>
            </div>

            <div className="camp-card">
              <div className="camp-section-label">פרטי הקמפיין</div>

              {isGenerating ? (
                <div className="camp-loading">
                  <div className="camp-spinner-wrap">
                    <div className="camp-spinner" />
                    <div className="camp-spinner-inner" />
                  </div>

                  <div className="camp-loading-title">מפעיל סוכני AI...</div>

                  <div className="camp-loading-steps">
                    <div className="camp-loading-step">
                      <div className="camp-loading-dot" />
                      שומר נתוני קמפיין
                    </div>

                    <div className="camp-loading-step">
                      <div className="camp-loading-dot" />
                      מנתח רשימת תורמים
                    </div>

                    <div className="camp-loading-step">
                      <div className="camp-loading-dot" />
                      בונה דפי נחיתה מותאמים אישית
                    </div>
                  </div>
                </div>
              ) : (
                <form className="camp-fields camp-form-grid" onSubmit={handleSubmit}>
                  <div className="camp-field">
                    <label className="camp-label">
                      שם הקמפיין <span>*</span>
                    </label>

                    <input
                      className="camp-input"
                      type="text"
                      name="campaignName"
                      required
                      placeholder="לדוגמה: גיוס Seed 2026"
                      value={formData.campaignName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="camp-field">
                    <label className="camp-label">
                      יעד לגיוס <span>*</span>
                    </label>

                    <input
                      className="camp-input"
                      type="number"
                      name="fundingTarget"
                      required
                      placeholder="לדוגמה: 500000"
                      value={formData.fundingTarget}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="camp-field camp-field-full">
                    <label className="camp-label">
                      מטרת הקמפיין <span>*</span>
                    </label>

                    <textarea
                      className="camp-textarea"
                      name="campaignGoal"
                      required
                      placeholder="תארו בקצרה מה מטרת הגיוס..."
                      value={formData.campaignGoal}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="camp-submit-wrap camp-field-full">
                    <button className="camp-submit" type="submit">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                      </svg>
                      צור קמפיין
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}