// client/src/components/EditProfile.jsx
import  { useState } from 'react';

export default function EditProfile({ company, onUpdateSuccess, onCancel }) {
  const [aboutText, setAboutText] = useState(company.about_text || '');
  const [fundraisingGoal, setFundraisingGoal] = useState(company.fundraising_goal || '');
  const [companyColor, setCompanyColor] = useState(company.company_color || '#1094A9');
  
  // סטייטים חדשים עבור הקבצים לעריכה
  const [logo, setLogo] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // משתמשים ב-FormData כדי לאפשר שליחת קבצים מחדש ב-PUT / POST
    const formData = new FormData();
    formData.append('aboutText', aboutText);
    formData.append('fundraisingGoal', fundraisingGoal);
    formData.append('companyColor', companyColor);
    
    if (logo) formData.append('logo', logo);
    if (csvFile) formData.append('csvFile', csvFile);

    try {
      // שליחת העדכון לשרת (שימי לב שאנחנו מעדכנים לפי ה-ID של החברה הנוכחית)
      const response = await fetch(`http://localhost:5000/api/company/${company.id}`, {
        method: 'PUT',
        body: formData, // שליחת ה-FormData עם הקבצים
      });

      const data = await response.json();

      if (data.success) {
        // מעדכנים את האפליקציה בנתונים החדשים שהשרת החזיר
        onUpdateSuccess(data.company);
      } else {
        setError(data.message || 'עדכון הפרטים נכשל.');
      }
    } catch (err) {
      setError('שגיאת תקשורת עם השרת.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>עריכת פרופיל חברה</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>קצת עלינו (תיאור החברה):</label>
          <textarea 
            rows="3" 
            value={aboutText} 
            onChange={(e) => setAboutText(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>יעד גיוס (בשקלים):</label>
          <input 
            type="number" 
            value={fundraisingGoal} 
            onChange={(e) => setFundraisingGoal(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>עדכון לוגו החברה (אופציונלי):</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>העלאת רשימת תורמים חדשה (CSV בלבד):</label>
          <input 
            type="file" 
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>צבע המותג שלך:</label>
          <div className="color-picker-wrapper">
            <input 
              type="color" 
              value={companyColor} 
              onChange={(e) => setCompanyColor(e.target.value)}
            />
            <span>בחרי צבע רקע מותאם לאתר</span>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'שומר שינויים...' : 'שמור שינויים'}
        </button>

        <button 
          type="button" 
          className="btn-primary" 
          style={{ background: '#64748b', marginTop: '0.5rem' }} 
          onClick={onCancel}
        >
          ביטול
        </button>
      </form>
    </div>
  );
}