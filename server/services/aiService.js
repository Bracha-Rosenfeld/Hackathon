import { GoogleGenerativeAI } from '@google/generative-ai';

// אתחול באמצעות ה-API Key שיושב ב-.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCampaignAgentData = async (personalityJson, financialJson, campaignJson) => {
  try {
    // הגדרת המודל והגדרות ה-JSON הנדרשות
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            personalizedEmail: { type: 'string' },
            suggestedColor: { type: 'string' },
            styleName: { type: 'string' },
            threePriceOptions: {
              type: 'array',
              items: { type: 'number' }
            }
          },
          required: ['personalizedEmail', 'suggestedColor', 'styleName', 'threePriceOptions'],
        },
      },
    });

    const prompt = `
      You are an expert campaign optimization agent. Analyze the provided data to generate a tailored response.

      --- INPUT DATA ---
      1. Target Personality Analysis: ${JSON.stringify(personalityJson)}
      2. Target Financial Analysis: ${JSON.stringify(financialJson)}
      3. Campaign Context: Name is "${campaignJson.name}", Goal/Purpose is "${campaignJson.goal}".

      --- TASK REQUIREMENTS ---
      - Write the 'personalizedEmail' strictly in Hebrew.
      - Match the email's tone to the Personality Analysis.
      - Select a 'suggestedColor' (hex code) that matches the target.
      - Provide a short Hebrew description for 'styleName'.
      - Generate exactly 3 price recommendations inside 'threePriceOptions' based on the Financial Analysis.
    `;

    // קריאה חלקה למודל
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return JSON.parse(response.text());

  } catch (error) {
    console.error("Gemini Generation failed:", error);
    throw error;
  }
};