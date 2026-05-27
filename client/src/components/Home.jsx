import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ company, onNavigateToEdit, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout(); 
    navigate('/login'); 
  };

  return (
    <div className="dashboard-card" style={{ position: 'relative' }}>
      
      <button 
        onClick={handleLogoutClick}
        style={{
          position: 'absolute', top: '-20px', left: '-10px',
          background: '#ef4444', color: 'white', border: 'none',
          padding: '5px 12px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '0.85rem', fontWeight: 'bold', transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.target.style.background = '#dc2626'}
        onMouseOut={(e) => e.target.style.background = '#ef4444'}
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
            display: 'inline-block', width: '16px', height: '16px', 
            backgroundColor: company.company_color, borderRadius: '50%',
            verticalAlign: 'middle'
          }}></span>
        </p>
      </div>

      {/* האזור המעודכן של הכפתורים */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
        
        <button 
          onClick={() => navigate('/create-campaign')}
          style={{
            background: 'linear-gradient(to left, #2ab18a, #20878e)',
            color: 'white', border: 'none', padding: '12px 24px',
            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1
          }}
        >
          צור קמפיין ➕
        </button>

        <button 
          onClick={onNavigateToEdit}
          style={{ 
            flex: 1, background: 'white', color: '#1a202c',
            border: '1px solid #ccc', padding: '12px 24px', 
            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          עריכת פרופיל והעלאת קבצים ✏️
        </button>
        
      </div>
    </div>
  );
}