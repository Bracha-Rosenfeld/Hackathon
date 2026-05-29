// client/src/App.jsx
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import EditProfile from './components/EditProfile';
import CreateCampaign from './components/CreateCampaign';
import LandingPage from './components/LandingPage';

import logo from './assets/logo.png';

function AppContent({ userCompany, setUserCompany }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname.startsWith('/landing/');

  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/landing/:token" element={<LandingPage />} />
      </Routes>
    );
  }

  const handleLogoClick = () => {
    if (userCompany) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <main className="app-shell">
      <div className="app-content">

        <Routes>
          <Route
            path="/"
            element={
              userCompany ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/login"
            element={
              <Login
                onLoginSuccess={(company) => {
                  setUserCompany(company);
                  navigate('/dashboard');
                }}
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
                  onUpdateSuccess={(updatedCompany) => {
                    setUserCompany(updatedCompany);
                    navigate('/dashboard');
                  }}
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
    </main>
  );
}

export default function App() {
  const [userCompany, setUserCompany] = useState(null);

  return (
    <Router>
      <AppContent
        userCompany={userCompany}
        setUserCompany={setUserCompany}
      />
    </Router>
  );
}