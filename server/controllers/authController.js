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

// פונקציית עדכון נתוני חברה (Update Profile)
// server/controllers/authController.js

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    // שליפת המשתנים בפורמט שהריאקט שולח ב-FormData
    const { aboutText, fundraisingGoal, companyColor } = req.body;
    
    // 1. בדיקה אם הועלה לוגו חדש
    let logoPath = null;
    if (req.files && req.files['logo']) {
      logoPath = `/uploads/${req.files['logo'][0].filename}`;
    }

    // 2. עדכון פרטי החברה בדאטהבייס (אם הועלה לוגו נעדכן גם אותו, אם לא - נשאיר את הקיים)
    if (logoPath) {
      await db.query(
        `UPDATE companies SET about_text = ?, fundraising_goal = ?, company_color = ?, logo_path = ? WHERE id = ?`,
        [aboutText, fundraisingGoal, companyColor, logoPath, id]
      );
    } else {
      await db.query(
        `UPDATE companies SET about_text = ?, fundraising_goal = ?, company_color = ? WHERE id = ?`,
        [aboutText, fundraisingGoal, companyColor, id]
      );
    }

    // 3. בדיקה אם הועלה קובץ תורמים (CSV) חדש לעדכון
    if (req.files && req.files['csvFile']) {
      // אופציונלי: מחיקת התורמים הישנים של החברה הזו לפני שמכניסים את הרשימה החדשה
      await db.query(`DELETE FROM donors WHERE company_id = ?`, [id]);

      const fs = await import('fs/promises');
      const csvBuffer = await fs.readFile(req.files['csvFile'][0].path, 'utf-8');
      const rows = csvBuffer.split('\n');
      
      for (let i = 1; i < rows.length; i++) { 
        if (!rows[i].trim()) continue;
        const [name, email, tz] = rows[i].split(',');
        if (name && email && tz) {
          await db.query(
            `INSERT INTO donors (company_id, full_name, email, tz_number) VALUES (?, ?, ?, ?)`
            , [id, name.trim(), email.trim(), tz.trim()]
          );
        }
      }
    }

    // 4. שליפת נתוני החברה המעודכנים כדי להחזיר לריאקט
    const [rows] = await db.query(`SELECT * FROM companies WHERE id = ?`, [id]);
    
    res.json({ 
      success: true, 
      message: "הפרופיל והקבצים עודכנו בהצלחה!", 
      company: rows[0] 
    });

  } catch (error) {
    console.error("❌ שגיאה בעדכון החברה:", error);
    res.status(500).json({ success: false, message: "שגיאת שרת בעדכון הפרטים." });
  }
};