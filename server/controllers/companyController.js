// server/controllers/companyController.js
import mysql from 'mysql2/promise';
import 'dotenv/config';

const db = await mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: { rejectUnauthorized: false },
});

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { aboutText, fundraisingGoal, companyColor } = req.body;
    
    let logoPath = null;
    if (req.files && req.files['logo']) {
      logoPath = `/uploads/${req.files['logo'][0].filename}`;
    }

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

    if (req.files && req.files['csvFile']) {
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

    const [rows] = await db.query(`SELECT * FROM companies WHERE id = ?`, [id]);
    res.json({ success: true, message: "הפרופיל עודכן בהצלחה!", company: rows[0] });

  } catch (error) {
    console.error("❌ שגיאה בעדכון החברה:", error);
    res.status(500).json({ success: false, message: "שגיאת שרת בעדכון הפרטים." });
  }
};