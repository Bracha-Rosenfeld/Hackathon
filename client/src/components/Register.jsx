import React, { useState } from 'react';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [fundraisingGoal, setFundraisingGoal] = useState('');
  const [companyColor, setCompanyColor] = useState('#1094A9');
  const [logo, setLogo] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('password', password);
    formData.append('aboutText', aboutText);
    formData.append('fundraisingGoal', fundraisingGoal);
    formData.append('companyColor', companyColor);
    if (logo) formData.append('logo', logo);
    if (csvFile) formData.append('csvFile', csvFile);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('החברה נרשמה בהצלחה! כעת ניתן להתחבר.');
        onRegisterSuccess();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('הרשמה נכשלה. אנא נסה שוב.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>הרשמת חברת גיוס חדשה</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>שם החברה</label>
        <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>סיסמה</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
        <label>קצת עלינו (תיאור החברה)</label>
        <textarea rows="3" value={aboutText} onChange={e => setAboutText(e.target.value)} />
      </div>
      <div className="form-group">
        <label>מה החברה מנסה לגייס?</label>
        <input type="text" placeholder="לדוגמה: 5,000,000 ₪ לסבב Seed" value={fundraisingGoal} onChange={e => setFundraisingGoal(e.target.value)} />
      </div>
      <div className="form-group">
        <label>בחירת צבע מותג</label>
        <div className="color-picker-wrapper">
          <input type="color" value={companyColor} onChange={e => setCompanyColor(e.target.value)} />
          <span>{companyColor}</span>
        </div>
      </div>
      <div className="form-group">
        <label>העלאת לוגו החברה</label>
        <input type="file" accept="image/*" onChange={e => setLogo(e.target.files[0])} />
      </div>
      <div className="form-group">
        <label>טעינת רשימת תורמים (קובץ CSV)</label>
        <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} />
      </div>
      
      <button type="submit" className="btn-primary">סיום הרשמה ויצירת פרופיל</button>
      
      <div className="toggle-link">
        כבר רשום? <span onClick={onSwitchToLogin}>לחץ כאן להתחברות</span>
      </div>
    </form>
  );
}