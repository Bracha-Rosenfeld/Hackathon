import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateCampaign({ company }) {
  const navigate = useNavigate();
  // סטייט שמנהל את מצב הטעינה בזמן שהסוכנים רצים
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateCampaign = async () => {
    setIsGenerating(true); // משנה את הכפתור למצב עבודה
    
    // 💡 כאן תבוא בעתיד קריאת ה-API לשרת שלכן (למשל fetch ל-backend)
    console.log("🚀 מתחיל ריצת סוכנים עבור:", company.company_name);
    
    // כרגע עשיתי סימולציה של המתנה של 2.5 שניות כדי שתראי איך זה נראה
    setTimeout(() => {
      setIsGenerating(false);
      alert('הסוכנים סיימו את העבודה! הקמפיין נוצר בהצלחה.');
      navigate('/dashboard'); // מחזיר לדאשבורד בסיום
    }, 2500);
  };

  return (
    <div className="dashboard-card" style={{ position: 'relative', textAlign: 'center', padding: '50px 20px' }}>
      
      {/* כפתור ביטול/חזרה */}
      <button 
        onClick={() => navigate('/dashboard')}
        style={{
          position: 'absolute', top: '15px', right: '15px',
          background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0',
          padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '0.85rem', fontWeight: '500'
        }}
      >
        חזרה לדאשבורד ↩
      </button>

      <h2 style={{ marginBottom: '15px', fontSize: '1.8rem', color: '#0f172a' }}>
        יצירת קמפיין חכם
      </h2>
      
      <p style={{ margin: '0 auto 40px', color: '#64748b', maxWidth: '400px', lineHeight: '1.6' }}>
        בלחיצת כפתור, צוות סוכני הבינה המלאכותית שלנו ינתח את הנתונים ויבנה את הקמפיין האופטימלי עבור <strong>{company.company_name}</strong>.
      </p>
      
      {/* כפתור הפעולה הראשי שמפעיל את הסוכנים */}
      <button 
        onClick={handleCreateCampaign}
        disabled={isGenerating} // מכבה את הכפתור בזמן ריצה
        style={{
          background: isGenerating ? '#94a3b8' : 'linear-gradient(to left, #2ab18a, #20878e)', 
          color: 'white',
          border: 'none',
          padding: '16px 36px',
          borderRadius: '12px', // פינות קצת יותר עגולות
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          boxShadow: isGenerating ? 'none' : '0 10px 15px -3px rgba(32, 135, 142, 0.3)',
          transition: 'all 0.3s ease',
          transform: isGenerating ? 'scale(0.98)' : 'scale(1)' // אנימציה קטנה בלחיצה
        }}
      >
        {isGenerating ? 'הסוכנים עובדים... 🤖' : 'הפעל סוכנים עכשיו 🚀'}
      </button>
      
    </div>
  );
}