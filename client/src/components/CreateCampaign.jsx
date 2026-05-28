import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateCampaign({ company }) {
  const navigate = useNavigate();

  // 1. סטייט לניהול שדות הטופס
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignGoal: '',
    fundingTarget: ''
  });

  // 2. סטייט למצבי האפליקציה (טעינה / הצלחה)
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // עדכון הסטייט בכל שינוי בשדות הקלט
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. פונקציית שליחת הטופס
// 3. פונקציית שליחת הטופס האמיתית מול ה-Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // שליחת הבקשה ל-Backend עם כל הנתונים הנדרשים
      const response = await fetch('http://localhost:5000/api/campaigns/create', { // ודאי שזה הפורט הנכון של הסרבר שלכן
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignName: formData.campaignName,
          campaignGoal: formData.campaignGoal,
          fundingTarget: formData.fundingTarget,
          companyId: company?.id // שולח את ה-ID של החברה המחוברת
        }),
      });

      const data = await response.json();

      if (data.success) {
        // מעבר למסך הצלחה רק כשהשרת והאייגנטים סיימו בהצלחה
        setIsGenerating(false);
        setIsSuccess(true);
      } else {
        throw new Error(data.message || 'משהו השתבש בשרת');
      }

    } catch (error) {
      console.error("שגיאה ביצירת הקמפיין:", error);
      setIsGenerating(false);
      alert(error.message || "משהו השתבש, נסה שנית.");
    }
  };

  return (
    <div className="dashboard-card" style={{ position: 'relative', padding: '40px 30px' }}>
      

      {/* --- מצב 1: מסך הצלחה לאחר סיום ריצת האייגנטים --- */}
      {isSuccess ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>✅</div>
          <h2 style={{ color: '#2ab18a', marginBottom: '10px' }}>קמפיין נשלח בהצלחה!</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>
            הנתונים נשמרו בהצלחה וצוות סוכני ה-AI סיים לבנות את האסטרטגיה המנצחת.
          </p>
          <button className="auth-submit-btn" onClick={() => navigate('/dashboard')}>
            חזרה למסך הבית
          </button>
        </div>
      ) : (
        /* --- מצב 2: הטופס הראשי (או מצב טעינה) --- */
        <>
          <h2 style={{ marginBottom: '10px' }}>צור קמפיין חדש</h2>
          <p style={{ textalign: 'center', color: '#64748b', marginBottom: '30px', fontSize: '0.95rem' }}>
            עבור חברת <strong>{company?.company_name}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            {/* שדה 1: שם הקמפיין */}
            <div className="auth-input-group">
              <label htmlFor="campaignName">שם הקמפיין</label>
              <input 
                type="text" 
                id="campaignName"
                name="campaignName"
                required
                disabled={isGenerating}
                placeholder="לדוגמה: גיוס Seed 2026"
                value={formData.campaignName}
                onChange={handleChange}
              />
            </div>

            {/* שדה 2: מטרת הקמפיין */}
            <div className="auth-input-group">
              <label htmlFor="campaignGoal">מטרת הקמפיין</label>
              <textarea 
                id="campaignGoal"
                name="campaignGoal"
                required
                disabled={isGenerating}
                rows="3"
                placeholder="תאר בקצרה מה מטרת הגיוס או הקמפיין..."
                value={formData.campaignGoal}
                onChange={handleChange}
                style={{ resize: 'none' }}
              />
            </div>

            {/* שדה 3: יעד לגיוס */}
            <div className="auth-input-group">
              <label htmlFor="fundingTarget">יעד לגיוס (ב-$)</label>
              <input 
                type="number" 
                id="fundingTarget"
                name="fundingTarget"
                required
                disabled={isGenerating}
                placeholder="לדוגמה: 500000"
                value={formData.fundingTarget}
                onChange={handleChange}
              />
            </div>

            {/* כפתור הפעלה ועיגול מסתובב */}
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              {isGenerating ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  {/* עיגול מסתובב (Spinner) מבוסס CSS */}
                  <div className="loading-spinner"></div>
                  <p style={{ color: '#20878e', fontWeight: '600', animation: 'pulse 1.5s infinite' }}>
                    שומר נתונים ומפעיל סוכני AI... 🤖
                  </p>
                </div>
              ) : (
                <button type="submit" className="auth-submit-btn">
                  צור קמפיין 🚀
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}