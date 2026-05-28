import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function LandingPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/landing/${token}`)
      .then((res) => res.json())
      .then((json) => setData(json.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [token]);

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', dir: 'rtl', color: '#555' }}>
        מכין את העמוד האישי שלך...
      </div>
    );
  }

  // מערך של סכומי התרומה (מסנן אפשרויות ריקות במידה ויש)
  const donationOptions = [data.option1, data.option2, data.option3].filter(Boolean);
  
  // צבע המותג המותאם אישית (או צבע גיבוי)
  const brandColor = data.suggested_color || '#3b5a9a';

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Heebo', 'Rubik', 'Segoe UI', sans-serif",
      }}
    >
      {/* אזור הלוגו (Header) מבוסס על הפרמטר מהדאטא */}
      {data.logo_url && (
        <div style={{
          width: '100%',
          backgroundColor: 'white',
          padding: '20px 0',
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '40px'
        }}>
          <img 
            src={data.logo_url} 
            alt="לוגו הארגון" 
            style={{ height: '70px', objectFit: 'contain' }} 
          />
        </div>
      )}

      {/* כרטיסיית התוכן המרכזית */}
      <div
        style={{
          backgroundColor: 'white',
          color: '#333',
          padding: '50px 40px',
          borderRadius: '16px',
          maxWidth: '650px',
          width: '90%',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          textAlign: 'right',
          marginBottom: '50px',
          borderTop: `6px solid ${brandColor}` // שימוש בצבע הדינמי כעיטור משמעותי
        }}
      >
        {/* פנייה אישית בשם */}
        {data.name && (
          <h2 style={{ 
            fontSize: '26px', 
            color: brandColor, 
            marginBottom: '10px',
            marginTop: '0'
          }}>
            שלום {data.name},
          </h2>
        )}

        {/* עיצוב גוש הטקסט שייראה יותר כמו ציטוט או מכתב מאשר חומת טקסט */}
        <div
          style={{
            fontSize: '18px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            marginBottom: '40px',
            color: '#444',
            backgroundColor: '#fafbfc',
            padding: '20px 25px',
            borderRadius: '12px',
            borderRight: `4px solid ${brandColor}` // קו אנכי שמוסיף חן לעיצוב
          }}
        >
          {data.personalized_email}
        </div>

        {/* אזור הכפתורים */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
            בחר/י את סכום התרומה:
          </p>
          <div
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              flexDirection: 'row-reverse' // עוזר לסידור נכון במסכים קטנים בעברית
            }}
          >
            {donationOptions.map((amount, index) => (
              <button
                key={index}
                style={{
                  backgroundColor: brandColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '12px 35px',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
              >
                ₪{amount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}