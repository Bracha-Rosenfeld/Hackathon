// client/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import EditProfile from './components/EditProfile';

function AppContent({ userCompany, setUserCompany }) {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      {/* לוגו האתר הקבוע והמעוצב בראש הפאנל */}
      <div className="brand-header">
        <div className="brand-logo-text" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          RAISE RIGHT
        </div>
        <div className="brand-tagline">Personalized. Precise. Impact.</div>
      </div>

      {/* ראוטינג אמיתי מבוסס URL */}
      <Routes>
        {/* דף ברירת מחדל - אם מחובר הולך לבית, אם לא ללוגין */}
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
                onLogout={() => setUserCompany(null)} // איפוס הסטייט של החברה בזמן התנתקות
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