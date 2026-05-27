import { useEffect, useState } from 'react';

export default function DonorPage() {
    const [donorData, setDonorData] = useState(null);

    useEffect(() => {
        // 1. קריאת הפרמטרים מתוך הכתובת של הדפדפן
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('d'); // 'd' יכיל את המידע המוצפן

        if (dataParam) {
            try {
                // 2. פענוח הנתונים מ-Base64 חזרה לאובייקט ריאקט
                const decodedData = JSON.parse(decodeURIComponent(atob(dataParam).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))); setDonorData(decodedData);
            } catch (e) {
                console.error("שגיאה בפענוח הקישור", e);
            }
        }
    }, []);

    if (!donorData) {
        return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '24px' }}>טוען דף תרומה מאובטח...</div>;
    }

    return (
        <div style={{ maxWidth: '500px', margin: '60px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textRight: 'right', direction: 'rtl' }}>

            {/* לוגו או שם הארגון הדינמי */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#4c2885', margin: 0 }}>{donorData.orgName}</h2>
                <p style={{ color: '#718096', marginTop: '5px' }}>תודה על שותפותך, {donorData.donorName}!</p>
            </div>

            <p style={{ fontSize: '18px', color: '#2d3748', lineHeight: '1.6', marginBottom: '30px' }}>
                התרומה שלך תסייע לנו להמשיך לפעול ולקדם את המטרות שלנו. בחר את סכום התרומה הנוח לך:
            </p>

            {/* כפתורי התרומה המותאמים אישית (Ask String) שה-AI קבע */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <button style={btnStyle}>₪{donorData.amounts.low}</button>
                <button style={{ ...btnStyle, backgroundColor: '#ed8936', color: 'white', transform: 'scale(1.05)' }}>
                    ₪{donorData.amounts.medium} <span style={{ display: 'block', fontSize: '11px', fontWeight: 'normal' }}>מומלץ</span>
                </button>
                <button style={btnStyle}>₪{donorData.amounts.high}</button>
            </div>

            {/* כפתור תרומה כללית של Peach */}
            <button style={{ width: '100%', padding: '16px', backgroundColor: '#4c2885', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                המשך לתשלום מאובטח ב-Peach
            </button>
        </div>
    );
}

const btnStyle = {
    padding: '20px 10px',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: '#f7fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#2d3748',
    transition: 'all 0.2s'
};