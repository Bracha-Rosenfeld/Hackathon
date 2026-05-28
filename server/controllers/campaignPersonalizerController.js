import { generateCampaignAgentData } from '../services/aiService.js';

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

    // החזרת המידע המובנה והמותאם אישית לקליינט
    return res.status(200).json({
      success: true,
      data: personalizedData
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