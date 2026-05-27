import React from 'react';

export default function Home({ company, onNavigateToEdit }) {
  return (
    <div className="dashboard-card">
      {company.logo_path && (
        <img src={`http://localhost:5000${company.logo_path}`} alt="Company Logo" className="company-logo-preview" />
      )}
      
      <h2 style={{ borderBottom: `3px solid ${company.company_color || '#1094A9'}`, paddingBottom: '10px' }}>
        ברוכים הבאים, {company.company_name}!
      </h2>
      
      <p><strong>אודות:</strong> {company.about_text || 'לא הוזן תיאור'}</p>
      <p><strong>יעד גיוס:</strong> {company.fundraising_goal || 'לא הוזן יעד'}</p>
      
      <button 
        className="btn-primary" 
        style={{ marginTop: '2rem', background: company.company_color }}
        onClick={onNavigateToEdit}
      >
        ערוך נתוני חברה
      </button>
    </div>
  );
}