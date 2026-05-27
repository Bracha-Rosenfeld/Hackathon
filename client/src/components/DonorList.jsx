/* eslint-disable react/prop-types */
import { useState } from 'react';

export default function DonorList({ donors, onSendEmails, isSending, emailsSent, onAddDonor, onUpdateDonor }) {
  // סטייט לניהול הטופס (הוספה / עריכה)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', tz: '' });

  // פתיחת טופס להוספת תורם חדש
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', tz: '' });
    setIsFormOpen(true);
  };

  // פתיחת טופס לעריכת תורם קיים
  const handleOpenEdit = (donor) => {
    setEditingId(donor.id);
    setFormData({ name: donor.name, email: donor.email, tz: donor.tz || '' });
    setIsFormOpen(true);
  };

  // שמירת הטופס (הוספה או עדכון)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return alert('נא למלא שם ומייל');

    if (editingId) {
      onUpdateDonor(editingId, formData);
    } else {
      onAddDonor(formData);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="card card-large">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="title-section" style={{ flex: 1 }}>
          <h2>ניהול רשימת תורמים וקמפיין</h2>
          <p>הכניסו פרטי תורמים בסיסיים. מנוע ה-AI יעשיר את שאר הנתונים אוטומטית בשלב השליחה.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleOpenAdd} className="btn-primary" style={{ width: 'auto', backgroundColor: '#4c2885', padding: '12px 20px' }}>
            ➕ הוסף תורם חדש
          </button>
          
          <button
            onClick={onSendEmails}
            disabled={isSending || emailsSent}
            className="ai-btn"
            style={{
              background: emailsSent ? '#48bb78' : 'linear-gradient(135deg, #ed8936 0%, #6b46c1 100%)',
              boxShadow: emailsSent ? 'none' : '0 4px 10px rgba(107, 70, 193, 0.3)'
            }}
          >
            {isSending ? '⏳ AI מנתח, מעשיר נתונים ושולח...' : emailsSent ? '✅ המיילים והנתונים שוגרו!' : '✉️ הפעל AI ושלח מיילים'}
          </button>
        </div>
      </div>

      {/* טופס הוספה/עריכה דינמי */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} style={{ background: '#f7fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>{editingId ? '📝 עדכון פרטי תורם' : '👤 הוספת תורם חדש (נתוני מינימום)'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>שם מלא</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ישראל ישראלי" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>כתובת אימייל</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@company.com" style={{ textAlign: 'left', direction: 'ltr' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>תעודת זהות</label>
              <input type="text" value={formData.tz} onChange={(e) => setFormData({...formData, tz: e.target.value})} placeholder="012345678" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '8px 16px', background: '#cbd5e0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>ביטול</button>
            <button type="submit" style={{ padding: '8px 16px', background: '#ed8936', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>שמירה</button>
          </div>
        </form>
      )}

      {/* טבלת התורמים המורחבת */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>תעודת זהות</th>
              <th style={{ textAlign: 'left' }}>אימייל</th>
              <th>יישוב (מועשר ב-AI)</th>
              <th>תפקיד (מועשר ב-AI)</th>
              <th>סטטוס / הצעה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor) => (
              <tr key={donor.id}>
                <td style={{ fontWeight: 'bold' }}>{donor.name}</td>
                <td style={{ color: '#4a5568' }}>{donor.tz || '—'}</td>
                <td style={{ textAlign: 'left', direction: 'ltr' }}>{donor.email}</td>
                
                {/* הצגת נתונים מועשרים או סימן שהם ממתינים ל-AI */}
                <td>{donor.aiEnriched ? donor.city : <span style={{ color: '#a0aec0', fontSize: '14px' }}>ממתין ל-AI ⏳</span>}</td>
                <td>{donor.aiEnriched ? donor.role : <span style={{ color: '#a0aec0', fontSize: '14px' }}>ממתין ל-AI ⏳</span>}</td>
                
                <td>
                  {emailsSent && donor.askString ? (
                    <span style={{ color: '#2b6cb0', backgroundColor: '#ebf8ff', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                      {donor.askString.low}₪ | {donor.askString.medium}₪ | {donor.askString.high}₪
                    </span>
                  ) : (
                    <span style={{ color: '#718096', fontSize: '14px', fontStyle: 'italic' }}>טרם נשלח</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleOpenEdit(donor)} style={{ background: 'none', border: 'none', color: '#4c2885', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
                    ערוך
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}