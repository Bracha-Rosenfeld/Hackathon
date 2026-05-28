import { v4 as uuidv4 } from 'uuid';
import { processCampaignDonors } from "../services/campaignProcessingService.js";
import { generateCampaignAgentData } from '../services/aiService.js';
import { db } from "../../db/db.js"; // שימוש בחיבור ה-DB הגלובלי של הפרויקט

export const createCampaign = async (req, res) => {
  try {
    const { campaignName, campaignGoal, fundingTarget, companyId } = req.body;

    // ולידציה בסיסית שהכול הגיע
    if (!campaignName || !campaignGoal || !fundingTarget || !companyId) {
      return res.status(400).json({ success: false, message: 'כל השדות הם חובה.' });
    }

    // 1. שמירת פרטי הקמפיין בבסיס הנתונים באמצעות db הגלובלי
    const [result] = await db.query(
      `INSERT INTO campaigns (company_id, campaign_name, campaign_goal, funding_target) 
       VALUES (?, ?, ?, ?)`,
      [companyId, campaignName, campaignGoal, fundingTarget]
    );

    const newCampaignId = result.insertId;
    console.log(`✅ הקמפיין נשמר ב-DB בהצלחה. מזהה קמפיין: ${newCampaignId}`);

    // 2. קריאה לפונקציית האייגנטים לקבלת נתוני אישיות ופיננסים
    console.log("🤖 מפעיל עיבוד תורמים (שלב 1: העשרה וניתוח)...");

    const campaignData = {
      campaignId: newCampaignId,
      campaignName,
      campaignGoal,
      fundingTarget,
      companyId
    };
    
    // מעבירים את חיבור ה-db לפונקציה
    const processingResult = await processCampaignDonors(
      db,
      companyId,
      campaignData
    );

    // 3. קריאה לפונקצית האופטימיזציה ויצירת דפי הנחיתה לכל תורם
    console.log("🎨 מפעיל יצירת דפי נחיתה מותאמים אישית (שלב 2)...");
    
    const landingLinks = []; 

    for (const donor of processingResult) {
      if (!donor.personalityProfile || !donor.financialProfile) {
        console.log(`⚠️ מדלג על ${donor.email}: חסרים נתוני AI (Personality/Financial).`);
        continue; 
      }

      console.log(`⏳ יוצר קמפיין מותאם עבור: ${donor.email}...`);

      try {
        // שליחה למודל האופטימיזציה
        const personalizedData = await generateCampaignAgentData(
          donor.personalityProfile, 
          donor.financialProfile, 
          campaignData
        );

        const token = uuidv4();

        // שמירה בבסיס הנתונים (שימוש ב-db הקיים)
        await db.query(
          `
          INSERT INTO personalized_landings
          (
            token,
            donor_email,
            personalized_email,
            suggested_color,
            style_name,
            option1,
            option2,
            option3
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            token,
            donor.email,
            personalizedData.personalizedEmail,
            personalizedData.suggestedColor,
            personalizedData.styleName,
            personalizedData.threePriceOptions[0],
            personalizedData.threePriceOptions[1],
            personalizedData.threePriceOptions[2],
          ]
        );

        const landingLink = `http://localhost:5173/landing/${token}`;
        console.log(`✅ לינק נוצר בהצלחה עבור ${donor.email}: ${landingLink}`);
        
        landingLinks.push({ email: donor.email, link: landingLink });

      } catch (innerError) {
        console.error(`❌ שגיאה ביצירת דף מותאם עבור ${donor.email}:`, innerError.message);
      }
    }

    // 4. החזרת תשובה מוצלחת ללקוח
    return res.status(201).json({
      success: true,    
      message: 'הקמפיין נוצר והאייגנטים סיימו את עבודתם בהצלחה!',
      campaignId: newCampaignId,
      generatedLinks: landingLinks
    });

  } catch (error) {
    console.error('שגיאה ב-campaignController:', error);
    return res.status(500).json({ success: false, message: 'שגיאת שרת פנימית.' });
  }
};