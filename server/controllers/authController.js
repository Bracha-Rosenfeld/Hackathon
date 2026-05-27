// server/controllers/authController.js
import mysql from 'mysql2/promise';
import 'dotenv/config';

// חיבור למסד הנתונים עבור הקונטרולר
const db = await mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: { rejectUnauthorized: false },
});

// פונקציית הרשמה (Register)
export const register = async (req, res) => {
  try {
    const { companyName, password, aboutText, fundraisingGoal, companyColor } = req.body;
    const logoPath = req.files['logo'] ? `/uploads/${req.files['logo'][0].filename}` : null;
    
    // 1. הכנסת החברה לדאטהבייס
    const [companyResult] = await db.query(
      `INSERT INTO companies (company_name, password, logo_path, about_text, fundraising_goal, company_color) VALUES (?, ?, ?, ?, ?, ?)`
      , [companyName, password, logoPath, aboutText, fundraisingGoal, companyColor]
    );
    
    const companyId = companyResult.insertId;

    // 2. עיבוד קובץ ה-CSV של התורמים במידה והועלה
    if (req.files['csvFile']) {
      // קריאת הקובץ כטקסט
      const fs = await import('fs/promises');
      const csvBuffer = await fs.readFile(req.files['csvFile'][0].path, 'utf-8');
      const rows = csvBuffer.split('\n');
      
      for (let i = 1; i < rows.length; i++) { // מדלגים על כותרות ה-CSV
        if (!rows[i].trim()) continue;
        const [name, email, tz] = rows[i].split(',');
        if (name && email && tz) {
          await db.query(
            `INSERT INTO donors (company_id, full_name, email, tz_number) VALUES (?, ?, ?, ?)`
            , [companyId, name.trim(), email.trim(), tz.trim()]
          );
        }
      }
    }

    res.status(201).json({ success: true, message: "החברה נרשמה בהצלחה!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ההרשמה נכשלה. ייתכן ששם החברה כבר קיים במערכת." });
  }
};

// פונקציית התחברות (Login)
export const login = async (req, res) => {
  const { companyName, password } = req.body;
  try {
    const [rows] = await db.query(`SELECT * FROM companies WHERE company_name = ? AND password = ?`, [companyName, password]);
    if (rows.length > 0) {
      res.json({ success: true, company: rows[0] });
    } else {
      res.status(401).json({ success: false, message: "שם החברה או הסיסמה אינם נכונים." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "שגיאת שרת פנימית תרחש בעת ההתחברות." });
  }
};
