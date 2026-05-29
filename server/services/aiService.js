import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function detectCategoryBeforeAI(personalityJson, financialJson) {
  const text = JSON.stringify({ personalityJson, financialJson }).toLowerCase();

  if (
    text.includes('student') ||
    text.includes('university') ||
    text.includes('college') ||
    text.includes('intern') ||
    text.includes('junior') ||
    text.includes('סטודנט') ||
    text.includes('אוניברסיטה') ||
    text.includes('מכללה') ||
    text.includes('מתמחה') ||
    text.includes('צעיר')
  ) {
    return 'student';
  }

  if (
    text.includes('ceo') ||
    text.includes('founder') ||
    text.includes('co-founder') ||
    text.includes('director') ||
    text.includes('vp') ||
    text.includes('manager') ||
    text.includes('executive') ||
    text.includes('leadership') ||
    text.includes('מנכ') ||
    text.includes('מייסד') ||
    text.includes('סמנכ') ||
    text.includes('דירקטור') ||
    text.includes('מנהל')
  ) {
    return 'executive';
  }

  if (
    text.includes('investor') ||
    text.includes('investment') ||
    text.includes('vc') ||
    text.includes('angel') ||
    text.includes('fund') ||
    text.includes('finance') ||
    text.includes('wealth') ||
    text.includes('high income') ||
    text.includes('high net worth') ||
    text.includes('משקיע') ||
    text.includes('השקעות') ||
    text.includes('קרן') ||
    text.includes('פיננס')
  ) {
    return 'investor';
  }

  if (
    text.includes('software') ||
    text.includes('developer') ||
    text.includes('engineer') ||
    text.includes('programmer') ||
    text.includes('product') ||
    text.includes('data') ||
    text.includes('ai') ||
    text.includes('machine learning') ||
    text.includes('cto') ||
    text.includes('startup') ||
    text.includes('tech') ||
    text.includes('הייטק') ||
    text.includes('מתכנת') ||
    text.includes('מהנדס') ||
    text.includes('מוצר') ||
    text.includes('דאטה')
  ) {
    return 'tech';
  }

  if (
    text.includes('community') ||
    text.includes('nonprofit') ||
    text.includes('social impact') ||
    text.includes('volunteer') ||
    text.includes('activism') ||
    text.includes('education') ||
    text.includes('teacher') ||
    text.includes('public service') ||
    text.includes('ngo') ||
    text.includes('קהילה') ||
    text.includes('עמותה') ||
    text.includes('התנדבות') ||
    text.includes('חינוך') ||
    text.includes('מורה') ||
    text.includes('חברתי')
  ) {
    return 'community';
  }

  return 'default';
}

export const generateCampaignAgentData = async (
  personalityJson,
  financialJson,
  campaignJson
) => {
  try {
    const detectedCategory = detectCategoryBeforeAI(personalityJson, financialJson);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            personalizedEmail: {
              type: 'string',
            },
            punchlines: {
              type: 'array',
              items: { type: 'string' },
              description: 'Exactly 2 powerful punchlines/headlines in Hebrew.',
            },
            category: {
              type: 'string',
              enum: [
                'student',
                'executive',
                'investor',
                'tech',
                'community',
                'default',
              ],
              description:
                'The classification of the user based on their profile.',
            },
            suggestedColor: {
              type: 'string',
            },
            styleName: {
              type: 'string',
            },
            threePriceOptions: {
              type: 'array',
              items: { type: 'number' },
            },
          },
          required: [
            'personalizedEmail',
            'punchlines',
            'category',
            'suggestedColor',
            'styleName',
            'threePriceOptions',
          ],
        },
      },
    });

    const prompt = `
You are an expert behavioral copywriter and conversion rate optimization specialist.

Your goal is to create a hyper-personalized donation landing page for one specific person.

Return ONLY valid JSON.

--- INPUT DATA ---

1. Target Personality Profile:
${JSON.stringify(personalityJson, null, 2)}

2. Target Financial Profile:
${JSON.stringify(financialJson, null, 2)}

3. Campaign Context:
${JSON.stringify(campaignJson, null, 2)}

4. Category detected by our system before AI:
"${detectedCategory}"

--- VERY IMPORTANT CATEGORY RULES ---

You MUST choose exactly one category:

student
executive
investor
tech
community
default

Do NOT overuse "default".

Use "default" ONLY if there is truly no useful signal about the person.

If there is even a weak signal, choose the closest matching category.

Category decision guide:

student:
Choose this if the person is a student, young, early-career, junior, intern,
university related, college related, learning-oriented, or at the beginning of their career.

executive:
Choose this if the person is a CEO, founder, co-founder, VP, director,
manager, business owner, senior leader, decision maker, or corporate leader.

investor:
Choose this if the person is connected to investing, finance, VC, angel investing,
funds, wealth, high financial capacity, high income, or strong financial influence.

tech:
Choose this if the person works in software, engineering, product, data, AI,
cyber, startup, development, CTO roles, or technology companies.

community:
Choose this if the person is connected to community work, nonprofit, education,
social impact, volunteering, activism, public service, local leadership, or helping people.

default:
Use only when the profile gives no clear professional, financial, social, or life-stage signal.

If our detected category is not "default", strongly prefer using it unless the full profile clearly proves another category is better.

--- TASK REQUIREMENTS ---

1. personalizedEmail:
Write in Hebrew only.
Write a concise, persuasive personal message for a landing page.
Maximum 2 short paragraphs.
Adapt the tone to the personality profile and to the chosen category.
Connect the person's motivations to the campaign goal.

2. punchlines:
Return exactly 2 Hebrew strings.
These are the most important personal lines on the landing page.
They should feel written specifically for this person.
They should be short, sharp, emotional or motivational.

Examples:
For student:
"גם צעד קטן שלך יכול להתחיל שינוי גדול"
"סטודנטים לא רק לומדים מציאות — הם משנים אותה"

For executive:
"ההשפעה שלך יכולה להוביל מהלך גדול יותר"
"מנהיגות אמיתית נמדדת גם במה שהיא מאפשרת לאחרים"

For investor:
"כאן ההשפעה שלך הופכת למשהו שאפשר למדוד"
"תרומה חכמה היא השקעה בתוצאה אנושית"

For tech:
"פעולה אחת חכמה יכולה להפעיל שינוי אמיתי"
"כמו מערכת טובה — גם השפעה מתחילה בהחלטה מדויקת"

For community:
"קהילה חזקה מתחילה באנשים שבוחרים לתת יד"
"התרומה שלך יכולה להגיע בדיוק למי שצריך אותה"

3. category:
Return exactly one of:
student, executive, investor, tech, community, default

4. suggestedColor:
Return a single Hex color code.
For non-default categories, choose a color that fits the category:
student: colorful purple/blue/pink
executive: gold/dark navy
investor: green/blue
tech: cyan/teal
community: orange/green/warm
default: harmonize with the brand color

5. styleName:
Return 2-3 Hebrew words describing the psychological angle.
Examples:
"צעיר ומניע"
"יוקרתי ומנהיגותי"
"רציונלי ומדיד"
"טכנולוגי וחד"
"חם וקהילתי"

6. threePriceOptions:
Return exactly 3 numbers.
Option 1: safe amount.
Option 2: recommended stretch amount.
Option 3: visionary/high amount.
Base the numbers on the financial profile.
No currency symbols.

--- OUTPUT EXAMPLE ---

{
  "personalizedEmail": "string",
  "punchlines": ["string", "string"],
  "category": "student",
  "suggestedColor": "#9333EA",
  "styleName": "צעיר ומניע",
  "threePriceOptions": [50, 120, 250]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const parsed = JSON.parse(response.text());

    if (!parsed.category || parsed.category === 'default') {
      parsed.category = detectedCategory;
    }

    if (!Array.isArray(parsed.punchlines)) {
      parsed.punchlines = [];
    }

    parsed.punchlines = parsed.punchlines.slice(0, 2);

    while (parsed.punchlines.length < 2) {
      parsed.punchlines.push('ההשפעה שלך יכולה להתחיל כאן');
    }

    if (!Array.isArray(parsed.threePriceOptions)) {
      parsed.threePriceOptions = [50, 120, 250];
    }

    parsed.threePriceOptions = parsed.threePriceOptions
      .map(Number)
      .filter((n) => !Number.isNaN(n))
      .slice(0, 3);

    while (parsed.threePriceOptions.length < 3) {
      parsed.threePriceOptions.push(
        parsed.threePriceOptions[parsed.threePriceOptions.length - 1] * 2 || 100
      );
    }

    return parsed;
  } catch (error) {
    console.error('Gemini Generation failed:', error);
    throw error;
  }
};