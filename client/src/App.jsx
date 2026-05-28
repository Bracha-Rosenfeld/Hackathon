// client/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import EditProfile from './components/EditProfile';
import CreateCampaign from './components/CreateCampaign';

// מייבאים את הלוגו החדש ששמרת בתיקיית assets
import logo from './assets/logo.png';

function AppContent({ userCompany, setUserCompany }) {
  const navigate = useNavigate();

  // פונקציה שמנתבת באופן חכם לפי מצב החיבור של המשתמשת
  const handleLogoClick = () => {
    if (userCompany) {
      navigate('/dashboard'); // אם היא מחוברת - חוזר לדאשבורד הראשי
    } else {
      navigate('/login'); // אם היא לא מחוברת - חוזר למסך החיבור
    }
  };

  return (
    <div className="auth-container">
      
      {/* הלוגו שיופיע תמיד בראש כל הדפים באפליקציה */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img 
          src={logo} 
          alt="Raise Right" 
          onClick={handleLogoClick} // שימוש בפונקציית הניתוב החכמה
          style={{ 
            maxWidth: '260px', 
            width: '100%', 
            height: 'auto', 
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto',
            transition: 'transform 0.2s ease' // אפקט קטן ועדין כשעומדים על הלוגו
          }} 
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>

      {/* הראוטינג של האפליקציה */}
      <Routes>
        <Route path="/" element={userCompany ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        
        <Route 
          path="/login" 
          element={
            <Login 
              onLoginSuccess={(company) => { setUserCompany(company); navigate('/dashboard'); }} 
              onSwitchToRegister={() => navigate('/register')} 
            />
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <Register 
              onRegisterSuccess={() => navigate('/login')} 
              onSwitchToLogin={() => navigate('/login')} 
            />
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            userCompany ? (
              <Home 
                company={userCompany} 
                onNavigateToEdit={() => navigate('/edit')} 
                onLogout={() => setUserCompany(null)} 
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        <Route 
          path="/edit" 
          element={
            userCompany ? (
              <EditProfile 
                company={userCompany} 
                onUpdateSuccess={(updatedCompany) => { setUserCompany(updatedCompany); navigate('/dashboard'); }} 
                onCancel={() => navigate('/dashboard')} 
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/create-campaign" 
          element={
            userCompany ? (
              <CreateCampaign company={userCompany} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </div>
  );
}

export default function App() {
  const [userCompany, setUserCompany] = useState(null);

  return (
    <Router>
      <AppContent userCompany={userCompany} setUserCompany={setUserCompany} />
    </Router>
  );
}