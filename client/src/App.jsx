import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import EditProfile from './components/EditProfile';

export default function App() {
  const [view, setView] = useState('login'); // מצבים אפשריים: login | register | home | edit
  const [userCompany, setUserCompany] = useState(null); // ישמור את נתוני החברה המחוברת

  return (
    <div className="auth-container">
      {/* לוגו האתר הקבוע והמעוצב בראש הפאנל */}
      <div className="brand-header">
        <div className="brand-logo-text">RAISE RIGHT</div>
        <div className="brand-tagline">Personalized. Precise. Impact.</div>
      </div>

      {/* ניתוב חכם בין הקומפוננטות השונות בהתאם לסטייט */}
      {view === 'login' && (
        <Login 
          onLoginSuccess={(company) => { setUserCompany(company); setView('home'); }} 
          onSwitchToRegister={() => setView('register')} 
        />
      )}

      {view === 'register' && (
        <Register 
          onRegisterSuccess={() => setView('login')} 
          onSwitchToLogin={() => setView('login')} 
        />
      )}

      {view === 'home' && userCompany && (
        <Home 
          company={userCompany} 
          onNavigateToEdit={() => setView('edit')} 
        />
      )}

      {view === 'edit' && userCompany && (
        <EditProfile 
          company={userCompany} 
          onUpdateSuccess={(updatedCompany) => { setUserCompany(updatedCompany); setView('home'); }} 
          onCancel={() => setView('home')} 
        />
      )}
    </div>
  );
}