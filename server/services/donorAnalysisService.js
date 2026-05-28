import { GoogleGenAI, Type } from "@google/genai";

// אתחול ה-SDK עם מפתח ה-API מה-.env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * פונקציה ייחודית המעבדת נתוני אייג'נט ומפיקה מבנה אישיותי ופיננסי
 * @param {Object} rawAgentData 
 * @returns {Promise<Object>}
 */
export const processDonorAgentData = async (rawAgentData) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // המודל החינמי המהיר
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze this raw data profile: ${JSON.stringify(rawAgentData)}` }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalityJson: {
              type: Type.OBJECT,
              properties: {
                trait: { type: Type.STRING },
                communicationStyle: { type: Type.STRING },
                motivations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["trait", "communicationStyle", "motivations"]
            },
            financialJson: {
              type: Type.OBJECT,
              properties: {
                estimatedIncomeLevel: { type: Type.STRING },
                avgPastDonation: { type: Type.NUMBER },
                financialStabilityScore: { type: Type.NUMBER }
              },
              required: ["estimatedIncomeLevel", "avgPastDonation", "financialStabilityScore"]
            }
          },
          required: ["personalityJson", "financialJson"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error inside donorAnalysisService:", error);
    throw new Error("AI Processing failed");
  }
};