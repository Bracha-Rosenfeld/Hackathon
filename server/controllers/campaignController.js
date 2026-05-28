import { v4 as uuidv4 } from 'uuid';
import { processCampaignDonors } from "../services/campaignProcessingService.js";
import { generateCampaignAgentData } from '../services/aiService.js';
import { db } from "../../db/db.js"; // שימוש בחיבור ה-DB הגלובלי של הפרויקט

// פונקציית עזר להשהיה (Sleep) כדי למנוע חריגה ממגבלות ה-API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
        
        // שליפת פרטי החברה
        const [companyRows] = await db.query(
            `
    SELECT company_name, logo_path
    FROM companies
    WHERE id = ?
  `,
            [companyId]
        );

        if (companyRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'החברה לא נמצאה'
            });
        }

        const companyDataFromDb = companyRows[0];
        const companyNameFromDb = companyDataFromDb.company_name;
        const companyLogoFromDb = companyDataFromDb.logo_path;
        
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
        let isFirstDonor = true; // משתנה כדי שלא נמתין סתם לפני התורם הראשון

        for (const donor of processingResult) {
            if (!donor.personalityProfile || !donor.financialProfile) {
                console.log(`⚠️ מדלג על ${donor.email}: חסרים נתוני AI (Personality/Financial).`);
                continue;
            }

            // קצב ה-API בחינם מוגבל ל-5 בקשות בדקה. 
            // ממתינים 12 שניות בין תורם לתורם (החל מהתורם השני).
            if (!isFirstDonor) {
                console.log(`⏳ ממתין 12 שניות כדי להימנע מחסימת Rate Limit של Gemini...`);
                await delay(12000);
            }
            isFirstDonor = false;

            console.log(`⏳ יוצר קמפיין מותאם עבור: ${donor.email}...`);
            
            // שליפת שם התורם
            const [donorRows] = await db.query(
                `
    SELECT full_name
    FROM donors
    WHERE email = ?
    LIMIT 1
  `,
                [donor.email]
            );

            const donorName =
                donorRows.length > 0
                    ? donorRows[0].full_name
                    : null;
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
  donor_name,
  company_name,
  company_logo,
  personalized_email,
  suggested_color,
  style_name,
  option1,
  option2,
  option3
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
[
  token,
  donor.email,
  donorName,
  companyNameFromDb,
  companyLogoFromDb,
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

                landingLinks.push({ 
                    name: donorName || 'תורם ללא שם', 
                    email: donor.email, 
                    link: landingLink 
                });
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