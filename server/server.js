// server/server.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// ייבוא הפונקציות מהקונטרולרים
import { login, register } from './controllers/authController.js';
import { updateCompany } from './controllers/companyController.js'; 
import { createCampaign } from './controllers/campaignController.js';
// הייבוא החדש של קונטרולר ההתאמה האישית!
import { personalizeCampaignData } from './controllers/campaignPersonalizerController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// פתיחת גישה לתמונות הלוגו שהועלו
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// הגדרת Multer לשמירת קבצים בתיקיית uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- הראוטים (Routes) של האפליקציה ---

// ראוט הרשמה - מקבל גם קבצים (לוגו ו-CSV) ומפנה לפונקציה בקונטרולר
app.post('/api/auth/register', upload.fields([{ name: 'logo' }, { name: 'csvFile' }]), register);

// ראוט התחברות
app.post('/api/auth/login', login);

// ראוט עדכון פרטי חברה
app.put('/api/company/:id', upload.fields([{ name: 'logo' }, { name: 'csvFile' }]), updateCompany);

// ראוט יצירת קמפיין רגיל
app.post('/api/campaigns/create', createCampaign);

// הראוט החדש להתאמה אישית ואופטימיזציה של קמפיין מול ה-AI!
app.post('/api/campaign-personalizer/personalize', personalizeCampaignData);

// הרצת השרת
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 השרת רץ בצורה מסודרת על פורט ${PORT}`));