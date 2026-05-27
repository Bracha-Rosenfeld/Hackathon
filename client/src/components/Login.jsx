import { useState } from 'react';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, password }),
      });
      
      const data = await response.json();
      if (data.success) {
        onLoginSuccess(data.company); // מעביר את נתוני החברה לאבא (App.jsx)
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('שגיאת תקשורת עם השרת');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>התחברות לאזור האישי</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>שם החברה</label>
        <input 
          type="text" 
          required 
          value={companyName} 
          onChange={e => setCompanyName(e.target.value)} 
        />
      </div>
      
      <div className="form-group">
        <label>סיסמה</label>
        <input 
          type="password" 
          required 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
      </div>
      
      <button type="submit" className="btn-primary">התחבר</button>
      
      <div className="toggle-link">
        אין לך חשבון? <span onClick={onSwitchToRegister}>להרשמה לחץ כאן</span>
      </div>
    </form>
  );
}