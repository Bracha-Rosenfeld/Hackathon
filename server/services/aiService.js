// import { GoogleGenerativeAI } from '@google/generative-ai';

// // אתחול באמצעות ה-API Key שיושב ב-.env
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const generateCampaignAgentData = async (personalityJson, financialJson, campaignJson) => {
//   try {
//     // הגדרת המודל והגדרות ה-JSON הנדרשות
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-2.5-flash',
//       generationConfig: {
//         responseMimeType: 'application/json',
//         responseSchema: {
//           type: 'object',
//           properties: {
//             personalizedEmail: { type: 'string' },
//             suggestedColor: { type: 'string' },
//             styleName: { type: 'string' },
//             threePriceOptions: {
//               type: 'array',
//               items: { type: 'number' }
//             }
//           },
//           required: ['personalizedEmail', 'suggestedColor', 'styleName', 'threePriceOptions'],
//         },
//       },
//     });

//     const prompt = `
//       You are an expert campaign optimization agent. Analyze the provided data to generate a tailored response.

//       --- INPUT DATA ---
//       1. Target Personality Analysis: ${JSON.stringify(personalityJson)}
//       2. Target Financial Analysis: ${JSON.stringify(financialJson)}
//       3. Campaign Context: Name is "${campaignJson.name}", Goal/Purpose is "${campaignJson.goal}","${campaignJson.color}".

//       --- TASK REQUIREMENTS ---
//       - Write the 'personalizedEmail' strictly in Hebrew.
//       - Match the email's tone to the Personality Analysis in a way that will get him to donate the ultimate amount.
//       - Select a 'suggestedColorTheme' (hex code) that matches the target personality and financial profile but is considering the color of the company's branding.
//       - Provide a short Hebrew description for 'styleName'.
//       - Generate exactly 3 price recommendations inside 'threePriceOptions' based on the Financial Analysis.
//     `;
    
//     // קריאה חלקה למודל
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
    
//     return JSON.parse(response.text());

//   } catch (error) {
//     console.error("Gemini Generation failed:", error);
//     throw error;
//   }
// };

import { GoogleGenerativeAI } from '@google/generative-ai';

// אתחול באמצעות ה-API Key שיושב ב-.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCampaignAgentData = async (personalityJson, financialJson, campaignJson) => {
  try {
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

    // הפרומפט המדויק והחדש
    const prompt = `
      You are an expert behavioral copywriter and conversion rate optimization (CRO) specialist. 
      Your goal is to create a hyper-personalized landing page experience that maximizes donation conversions by making the user feel deeply understood.

      --- INPUT DATA ---
      1. Target Personality Profile: ${JSON.stringify(personalityJson)}
      2. Target Financial Profile: ${JSON.stringify(financialJson)}
      3. Campaign Context: 
         - Name: "${campaignJson.name}"
         - Goal/Purpose: "${campaignJson.goal}"
         - Brand Primary Color: "${campaignJson.color}"

      --- TASK REQUIREMENTS ---
      1. 'personalizedEmail' (Strictly in Hebrew):
         - Write a highly persuasive, personal message (approx. 3-4 paragraphs) formatted for a landing page.
         - Adapt the tone, pacing, and vocabulary STRICTLY to the Personality Profile (e.g., use emotional language for empathetic profiles, or data-driven impact metrics for analytical profiles).
         - Connect their personal motivations directly to the campaign's goal.
         - End with a compelling, smooth transition to the donation buttons.
         
      2. 'suggestedColorTheme' (Hex code):
         - Provide a single Hex color code.
         - It must harmonize with the Brand Primary Color, but be specifically chosen to psychologically appeal to the Target Personality Profile (e.g., softer hues for emotional profiles, bold/contrasting for assertive profiles).

      3. 'styleName' (Hebrew):
         - Provide a 2-3 word internal description of the psychological angle used (e.g., "רגשי ומחבק", "רציונלי ממוקד השפעה", "דינמי ומהיר").

      4. 'threePriceOptions' (Array of 3 Numbers):
         - Generate exactly 3 strategic donation amounts based on the Financial Profile.
         - Option 1: The 'Safe/Anchor' choice (a comfortable amount for them).
         - Option 2: The 'Stretch' goal (slightly higher than their average, optimized as the most recommended choice).
         - Option 3: The 'Visionary' choice (a larger amount for maximum impact).
         - Return ONLY numbers, no currency symbols.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return JSON.parse(response.text());

  } catch (error) {
    console.error("Gemini Generation failed:", error);
    throw error;
  }
};