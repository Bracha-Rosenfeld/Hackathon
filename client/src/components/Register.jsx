
export default function Register({ orgData, setOrgData, onNext }) {
  return (
    <div className="card">
      <div className="title-section">
        <h2>הרשמת ארגון לשירותי Peach</h2>
        <p>הגדירו את פרטי הארגון או העמותה כדי להתחיל לייצר דפי נחיתה חכמים.</p>
      </div>
      
      <div className="form-group">
        <label>שם הארגון / החברה</label>
        <input 
          type="text" 
          value={orgData.companyName} 
          onChange={(e) => setOrgData({...orgData, companyName: e.target.value})}
        />
      </div>
      
      <div className="form-group">
        <label>שם מנהל המערכת</label>
        <input 
          type="text" 
          value={orgData.adminName} 
          onChange={(e) => setOrgData({...orgData, adminName: e.target.value})}
        />
      </div>
      
      <div className="form-group">
        <label>אימייל ארגוני לקבלת דיווחים</label>
        <input 
          type="email" 
          value={orgData.email} 
          onChange={(e) => setOrgData({...orgData, email: e.target.value})}
          style={{ textAlign: 'left', direction: 'ltr' }}
        />
      </div>
      
      <button onClick={onNext} className="btn-primary">
        שמור והמשך לעיצוב הדף המותאם
      </button>
    </div>
  );
}