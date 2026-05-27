import React, { useState } from 'react';

export default function EditProfile({ company, onUpdateSuccess, onCancel }) {
  const [companyName, setCompanyName] = useState(company.company_name);
  const [aboutText, setAboutText] = useState(company.about_text || '');
  const [fundraisingGoal, setFundraisingGoal] = useState(company.fundraising_goal || '');
  const [companyColor, setCompanyColor] = useState(company.company_color || '#1094A9');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/company/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          about_text: aboutText,
          fundraising_goal: fundraisingGoal,
          company_color: companyColor,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        // מעדכן את האבא בנתונים החדשים כדי שדף הבית יתעדכן מיד
        onUpdateSuccess({
          ...company,
          company_name: companyName,
          about_text: aboutText,
          fundraising_goal: fundraisingGoal,
          company_color: companyColor,
        });
      }
    } catch (err) {
      alert('עדכון הנתונים נכשל.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>עריכת פרופיל חברה</h2>
      
      <div className="form-group">
        <label>שם החברה</label>
        <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>תיאור החברה</label>
        <textarea rows="3" value={aboutText} onChange={e => setAboutText(e.target.value)} />
      </div>
      <div className="form-group">
        <label>יעד גיוס</label>
        <input type="text" value={fundraisingGoal} onChange={e => setFundraisingGoal(e.target.value)} />
      </div>
      <div className="form-group">
        <label>צבע מותג</label>
        <div className="color-picker-wrapper">
          <input type="color" value={companyColor} onChange={e => setCompanyColor(e.target.value)} />
          <span>{companyColor}</span>
        </div>
      </div>
      
      <button type="submit" className="btn-primary" style={{ background: companyColor }}>שמור שינויים</button>
      <button type="button" className="btn-primary" style={{ marginTop: '1rem', background: '#64748b' }} onClick={onCancel}>ביטול</button>
    </form>
  );
}