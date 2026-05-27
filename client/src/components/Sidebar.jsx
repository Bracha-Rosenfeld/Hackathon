export default function Sidebar({ activeTab, setActiveTab, companyName }) {
  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo">
          PEACH
          <span>AI Management Portal</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            onClick={() => setActiveTab('register')}
            className={`nav-btn ${activeTab === 'register' ? 'active' : ''}`}
          >
            1. הרשמת ארגון
          </button>
          
          <button 
            onClick={() => setActiveTab('page-config')}
            className={`nav-btn ${activeTab === 'page-config' ? 'active' : ''}`}
          >
            2. הגדרת דף נחיתה
          </button>
          
          <button 
            onClick={() => setActiveTab('donors')}
            className={`nav-btn ${activeTab === 'donors' ? 'active' : ''}`}
          >
            3. רשימות תפוצה ו-AI
          </button>
        </nav>
      </div>
      
      <div className="sidebar-footer">
        ארגון מחובר: {companyName || 'טרם הוגדר'}
      </div>
    </div>
  );
}