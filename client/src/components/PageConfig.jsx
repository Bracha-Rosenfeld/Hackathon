
export default function PageConfig({ pageConfig, setPageConfig, onNext }) {
  return (
    <div className="card">
      <div className="title-section">
        <h2>הגדרת קמפיין ודף נחיתה דינמי</h2>
        <p>הגדירו את תוכן הבסיס. מנוע ה-AI יזריק את הסכומים המותאמים אישית לכל קישור.</p>
      </div>
      
      <div className="form-group">
        <label>כותרת דף הנחיתה</label>
        <input 
          type="text" 
          value={pageConfig.title} 
          onChange={(e) => setPageConfig({...pageConfig, title: e.target.value})}
        />
      </div>
      
      <div className="form-group">
        <label>טקסט הנעה לפעולה (Hero Text)</label>
        <textarea 
          rows="3"
          value={pageConfig.heroText} 
          onChange={(e) => setPageConfig({...pageConfig, heroText: e.target.value})}
        ></textarea>
      </div>
      
      <div className="form-group">
        <label>צבע נושא מוביל</label>
        <div className="color-picker-wrapper">
          <input 
            type="color" 
            value={pageConfig.themeColor} 
            onChange={(e) => setPageConfig({...pageConfig, themeColor: e.target.value})}
            style={{ width: '60px', height: '45px', cursor: 'pointer' }}
          />
          <span style={{ color: 'var(--text-gray)', fontSize: '14px' }}>
            צבע זה ישמש עבור רכיבי הסליקה של Peach בדף הנחיתה
          </span>
        </div>
      </div>
      
      <button onClick={onNext} className="btn-primary">
        שמור והמשך לייבוא רשימת המיילים
      </button>
    </div>
  );
}