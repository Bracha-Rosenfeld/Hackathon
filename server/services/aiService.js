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
            punchlines: { 
              type: 'array', 
              items: { type: 'string' },
              description: "Exactly 2 powerful punchlines/headlines in Hebrew."
            },
            category: { 
              type: 'string', 
              enum: ['student', 'executive', 'investor', 'tech', 'community', 'default'],
              description: "The classification of the user based on their profile."
            },
            suggestedColor: { type: 'string' },
            styleName: { type: 'string' },
            threePriceOptions: {
              type: 'array',
              items: { type: 'number' }
            }
          },
          required: ['personalizedEmail', 'punchlines', 'category', 'suggestedColor', 'styleName', 'threePriceOptions'],
        },
      },
    });

    // הפרומפט המעודכן
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
         - Write a concise, highly persuasive personal message (**maximum 2 short paragraphs**) formatted for a landing page.
         - Keep it punchy and direct. Adapt the tone, pacing, and vocabulary STRICTLY to the Personality Profile.
         - Connect their personal motivations directly to the campaign's goal.
         
      2. 'punchlines' (Array of exactly 2 Strings, Strictly in Hebrew):
         - Create exactly 2 high-impact, emotional or motivational headlines/punchlines about the person (to be used as the main landing page titles).
         - Example style if they are a student: "אתה צעיר, מכיר את העולם, בוא תשפיע" or "סטודנטים משנים את המציאות בשטח".
         - They should be short, sharp, catch the eye immediately, and resonate with who they are.

      3. 'category' (String):
         - Classify the target person into EXACTLY one of the following 6 predefined categories based on their profile data:
           * 'student' (if they are in university/college, young, or early career)
           * 'executive' (if they hold leadership, management, or corporate roles)
           * 'investor' (if their profile shows high wealth scoring, investments, or financial focus)
           * 'tech' (if they work in engineering, software, product, or tech industries)
           * 'community' (if they are heavily driven by social impact, activism, or local community work)
           * 'default' (if they don't clearly fit any of the above)

      4. 'suggestedColor' (Hex code):
         - Provide a single Hex color code that harmonizes with the Brand Primary Color, but psychologically appeals to the Target Personality Profile.

      5. 'styleName' (Hebrew):
         - Provide a 2-3 word internal description of the psychological angle used (e.g., "רגשי ומחבק", "רציונלי ממוקד השפעה").

      6. 'threePriceOptions' (Array of 3 Numbers):
         - Generate exactly 3 strategic donation amounts based on the Financial Profile.
         - Option 1: Safe/Anchor, Option 2: Stretch (most recommended), Option 3: Visionary.
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