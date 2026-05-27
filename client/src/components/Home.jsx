// client/src/components/Home.jsx
import React from 'react';

export default function Home({ company, onNavigateToEdit }) {
  // פונקציית התנתקות פשוטה שמחזירה אותנו ללוגין על ידי רענון עדין או איפוס
  const handleLogout = () => {
    window.location.reload(); // הדרך המהירה והבטוחה ב-Hackathon לאפס את כל הסטייט של האפליקציה מאפס
  };

  return (
    <div className="dashboard-card" style={{ position: 'relative' }}>
      
      {/* כפתור התנתקות מעוצב בראש הכרטיס */}
      <button 
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '-20px',
          left: '-10px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '5px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 'bold'
        }}
      >
        התנתק ↩
      </button>

      <h2>שלום, {company.company_name}!</h2>
      
      {company.logo_path && (
        <img 
          src={`http://localhost:5000${company.logo_path}`} 
          alt="Company Logo" 
          className="company-logo-preview" 
        />
      )}

      <div style={{ margin: '2rem 0', textAlign: 'right' }}>
        <p><strong>קצת עלינו:</strong> {company.about_text || 'אין תיאור זמין'}</p>
        <p><strong>יעד גיוס:</strong> ₪{Number(company.fundraising_goal).toLocaleString()}</p>
        <p>
          <strong>צבע מותג:</strong> {' '}
          <span style={{ 
            display: 'inline-block', 
            width: '16px', 
            height: '16px', 
            backgroundColor: company.company_color,
            borderRadius: '50%',
            verticalAlign: 'middle'
          }}></span>
        </p>
      </div>

      <button className="btn-primary" onClick={onNavigateToEdit}>
        עריכת פרופיל והעלאת קבצים
      </button>
    </div>
  );
}