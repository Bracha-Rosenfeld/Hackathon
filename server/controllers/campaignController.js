import mysql from 'mysql2/promise';
import { processCampaignDonors } from "../services/campaignProcessingService.js";
// חיבור ל-DB (מומלץ בעתיד לייבא מקובץ db.js המרכזי שלכן)
const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: { rejectUnauthorized: false },
};

export const createCampaign = async (req, res) => {
  let connection;
  try {
    const { campaignName, campaignGoal, fundingTarget, companyId } = req.body;

    // ולידציה בסיסית שהכול הגיע
    if (!campaignName || !campaignGoal || !fundingTarget || !companyId) {
      return res.status(400).json({ success: false, message: 'כל השדות הם חובה.' });
    }

    connection = await mysql.createConnection(dbConfig);

    // 1. שמירת פרטי הקמפיין בבסיס הנתונים
    const [result] = await connection.query(
      `INSERT INTO campaigns (company_id, campaign_name, campaign_goal, funding_target) 
       VALUES (?, ?, ?, ?)`,
      [companyId, campaignName, campaignGoal, fundingTarget]
    );

    const newCampaignId = result.insertId;
    console.log(`✅ הקמפיין נשמר ב-DB בהצלחה. מזהה קמפיין: ${newCampaignId}`);

    // 2. קריאה זמנית לפונקציית האייגנטים (נבנה אותה בשלב הבא)
    // כאן בעתיד תייבאו ותפעילו את פונקציית האייגנטים שלכן מה-Services
    console.log("🤖 מפעיל עיבוד תורמים...");

    const campaignData = {
      campaignId: newCampaignId,
      campaignName,
      campaignGoal,
      fundingTarget,
      companyId
    };

    const processingResult = await processCampaignDonors(
      connection,
      companyId,
      campaignData
    );

    // החזרת תשובה מוצלחת רק כשהכול מסתיים
    return res.status(201).json({
      success: true,    
      message: 'הקמפיין נוצר והאייגנטים סיימו את עבודתם בהצלחה!',
      campaignId: newCampaignId
    });

  } catch (error) {
    console.error('שגיאה ב-campaignController:', error);
    return res.status(500).json({ success: false, message: 'שגיאת שרת פנימית.' });
  } finally {
    if (connection) await connection.end();
  }
};