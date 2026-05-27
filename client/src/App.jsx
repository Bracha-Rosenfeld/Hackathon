import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Register from './components/Register';
import PageConfig from './components/PageConfig';
import DonorList from './components/DonorList';
import DonorPage from './components/DonorPage';
import './styles/Dashboard.css';

export default function App() {
  const [isDonorView, setIsDonorView] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  const [isSending, setIsSending] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);

  const [orgData, setOrgData] = useState({
    companyName: 'עמותת לחיות בכבוד',
    adminName: 'ישראל ישראלי',
    email: 'admin@respect.org.il'
  });

  const [pageConfig, setPageConfig] = useState({
    title: 'שותפים לשינוי - תרומה דיגיטלית',
    heroText: 'התרומה שלך עוזרת לנו להמשיך לפעול למען עתיד טוב יותר.',
    themeColor: '#ed8936'
  });

  // הסטייט ההתחלתי מכיל רק נתוני מינימום! (בלי עיר, תפקיד וסכומים)
  const [donors, setDonors] = useState([
    { id: '1', name: 'אבי כהן', email: 'avi@intel.com', tz: '054321987', aiEnriched: false },
    { id: '2', name: 'מיכל לוי', email: 'michal@gmail.com', tz: '312456789', aiEnriched: false },
  ]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
      setIsDonorView(true);
    }
  }, []);

  // פונקציה א': הוספת תורם חדש לרשימה עם נתוני מינימום
  const handleAddDonor = (newDonorData) => {
    const newDonor = {
      id: (donors.length + 1).toString(),
      name: newDonorData.name,
      email: newDonorData.email,
      tz: newDonorData.tz,
      aiEnriched: false // עדיין לא עבר העשרת AI
    };
    setDonors([...donors, newDonor]);
  };

  // פונקציה ב': עדכון פרטי תורם קיימים ברשימה
  const handleUpdateDonor = (id, updatedFields) => {
    setDonors(donors.map(d => d.id === id ? { ...d, ...updatedFields } : d));
  };

  // פונקציה ג': הפעלת ה-AI, העשרת נתונים ושליחה (הזרקת נתונים לדאטאבייס)
  const handleSendEmails = () => {
    setIsSending(true);
    
    setTimeout(() => {
      // סימולציה: מנוע ה-AI לוקח את המייל ותעודת הזהות ומנחש/שולף את שאר הנתונים
      const enrichedDonors = donors.map(donor => {
        let city = 'תל אביב';
        let role = 'עובד הייטק';
        let low = 200, medium = 500, high = 1000;

        if (donor.email.includes('gmail')) {
          city = 'חיפה';
          role = 'שכיר/ה במגזר הציבורי';
          low = 50; medium = 150; high = 300;
        }

        return {
          ...donor,
          aiEnriched: true, // סומן כיוצא לדרך!
          city, // נתון שנכנס לדאטאבייס רק כעת
          role, // נתון שנכנס לדאטאבייס רק כעת
          askString: { low, medium, high },
          generatedUrl: `${window.location.origin}?id=${donor.id}`
        };
      });

      setDonors(enrichedDonors);
      setIsSending(false);
      setEmailsSent(true);
    }, 1500);
  };

  if (isDonorView) {
    return <DonorPage />;
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} companyName={orgData.companyName} />
      <div className="main-content">
        {activeTab === 'register' && <Register orgData={orgData} setOrgData={setOrgData} onNext={() => setActiveTab('page-config')} />}
        {activeTab === 'page-config' && <PageConfig pageConfig={pageConfig} setPageConfig={setPageConfig} onNext={() => setActiveTab('donors')} />}
        {activeTab === 'donors' && (
          <DonorList 
            donors={donors} 
            onSendEmails={handleSendEmails} 
            isSending={isSending} 
            emailsSent={emailsSent} 
            onAddDonor={handleAddDonor}
            onUpdateDonor={handleUpdateDonor}
          />
        )}
      </div>
    </div>
  );
}