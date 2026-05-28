import { generateCampaignAgentData } from '../services/aiService.js';
import { db } from "../../db/db.js";
import { v4 as uuidv4 } from 'uuid';

/**
 * קונטרולר האחראי על התאמה אישית של קמפיין (מייל, צבעים וסכומים) על בסיס מודלים
 */
export const personalizeCampaignData = async (req, res) => {
  try {
    const { personalityJson, financialJson, campaignJson } = req.body;

    // ולידציה על הנתונים שהגיעו מהמודלים ומהקמפיין
    if (!personalityJson || !financialJson || !campaignJson) {
      return res.status(400).json({
        success: false,
        message: "Missing required data: personalityJson, financialJson, or campaignJson"
      });
    }

    // קריאה ל-Service שמבצע את האופטימיזציה מול ה-API
    const personalizedData = await generateCampaignAgentData(personalityJson, financialJson, campaignJson);

    // --- התיקון: הקוד הועבר לתוך ה-Scope של הפונקציה ---
    const token = uuidv4();

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
        financialJson.email || "unknown",
        personalizedData.personalizedEmail,
        personalizedData.suggestedColor,
        personalizedData.styleName,
        personalizedData.threePriceOptions[0],
        personalizedData.threePriceOptions[1],
        personalizedData.threePriceOptions[2],
      ]
    );

    const landingLink = `http://localhost:5173/landing/${token}`;
    console.log(`✅ Generated link: http://localhost:5173/landing/${token}`);

    // החזרת המידע המובנה והמותאם אישית לקליינט עם הלינק שנוצר
    return res.status(200).json({
      success: true,
      data: landingLink
    });

  } catch (error) {
    console.error("Error in campaignPersonalizerController:", error);
    return res.status(500).json({
      success: false,
      message: "Campaign personalization failed",
      error: error.message
    });
  }
};