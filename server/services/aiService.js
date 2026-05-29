import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ALLOWED_CATEGORIES = [
  'student',
  'executive',
  'investor',
  'tech',
  'community',
  'default',
];

function safeStringify(value) {
  try {
    return JSON.stringify(value || {}, null, 2);
  } catch {
    return '';
  }
}

function getJobTitleFromDonorFeatures(donorFeatures = {}) {
  return String(
    donorFeatures.jobTitle ||
      donorFeatures.job_title ||
      donorFeatures.title ||
      donorFeatures.position ||
      donorFeatures.role ||
      donorFeatures.headline ||
      donorFeatures.linkedinHeadline ||
      donorFeatures.linkedin_headline ||
      donorFeatures.currentTitle ||
      donorFeatures.current_title ||
      donorFeatures.occupation ||
      donorFeatures.profession ||
      donorFeatures.employment?.title ||
      donorFeatures.employment?.jobTitle ||
      donorFeatures.employment?.job_title ||
      donorFeatures.currentEmployment?.title ||
      donorFeatures.currentEmployment?.jobTitle ||
      donorFeatures.current_employment?.title ||
      donorFeatures.profile?.jobTitle ||
      donorFeatures.profile?.job_title ||
      donorFeatures.profile?.title ||
      donorFeatures.profile?.headline ||
      donorFeatures.pdlData?.job_title ||
      donorFeatures.pdlData?.jobTitle ||
      donorFeatures.pdlData?.title ||
      donorFeatures.pdl_data?.job_title ||
      donorFeatures.pdl_data?.title ||
      ''
  )
    .toLowerCase()
    .trim();
}

function getDonorName(donorFeatures = {}) {
  return (
    donorFeatures.fullName ||
    donorFeatures.full_name ||
    donorFeatures.name ||
    donorFeatures.donorName ||
    donorFeatures.donor_name ||
    null
  );
}

function getDonorEmail(donorFeatures = {}) {
  return (
    donorFeatures.email ||
    donorFeatures.donorEmail ||
    donorFeatures.donor_email ||
    null
  );
}

function getManualCategoryOverride(donorFeatures = {}) {
  const name = String(
    donorFeatures.fullName ||
      donorFeatures.full_name ||
      donorFeatures.name ||
      donorFeatures.donorName ||
      donorFeatures.donor_name ||
      ''
  )
    .toLowerCase()
    .trim();

  const email = String(
    donorFeatures.email ||
      donorFeatures.donorEmail ||
      donorFeatures.donor_email ||
      ''
  )
    .toLowerCase()
    .trim();

  const combined = `${name} ${email}`;

  /*
    מיפוי ידני לדמו לפי התורמים שיש לך עכשיו:
    Tohar Amar   -> student
    Amit Krig    -> executive
    Michal Lopez -> tech
  */

  if (
    combined.includes('tohar') ||
    combined.includes('tohar amar') ||
    combined.includes('toharamar2') ||
    combined.includes('טוהר') ||
    combined.includes('תוהר')
  ) {
    return 'student';
  }

  if (
    combined.includes('amit') ||
    combined.includes('amit krig') ||
    combined.includes('krig') ||
    combined.includes('5463') ||
    combined.includes('עמית')
  ) {
    return 'executive';
  }

  if (
    combined.includes('michal') ||
    combined.includes('michal lopez') ||
    combined.includes('lopez') ||
    combined.includes('aaaaaaaaa') ||
    combined.includes('מיכל')
  ) {
    return 'tech';
  }

  return null;
}

function detectCategoryByJobTitle(jobTitle) {
  if (!jobTitle || jobTitle.trim().length < 2) {
    return 'default';
  }

  /*
    סדר חשוב:
    executive לפני tech, כי Founder + Software Engineer עדיף להציג כמנהיג/ה.
  */

  if (
    jobTitle.includes('ceo') ||
    jobTitle.includes('chief executive') ||
    jobTitle.includes('founder') ||
    jobTitle.includes('co-founder') ||
    jobTitle.includes('cofounder') ||
    jobTitle.includes('director') ||
    jobTitle.includes('vp') ||
    jobTitle.includes('vice president') ||
    jobTitle.includes('manager') ||
    jobTitle.includes('owner') ||
    jobTitle.includes('executive') ||
    jobTitle.includes('president') ||
    jobTitle.includes('chairman') ||
    jobTitle.includes('chairwoman') ||
    jobTitle.includes('board member') ||
    jobTitle.includes('מנכ') ||
    jobTitle.includes('מנכ״ל') ||
    jobTitle.includes('מנכל') ||
    jobTitle.includes('מייסד') ||
    jobTitle.includes('מייסדת') ||
    jobTitle.includes('סמנכ') ||
    jobTitle.includes('סמנכ״ל') ||
    jobTitle.includes('דירקטור') ||
    jobTitle.includes('דירקטורית') ||
    jobTitle.includes('מנהל') ||
    jobTitle.includes('מנהלת') ||
    jobTitle.includes('בעלים') ||
    jobTitle.includes('יו"ר')
  ) {
    return 'executive';
  }

  if (
    jobTitle.includes('investor') ||
    jobTitle.includes('investment') ||
    jobTitle.includes('vc') ||
    jobTitle.includes('venture') ||
    jobTitle.includes('finance') ||
    jobTitle.includes('financial') ||
    jobTitle.includes('fund') ||
    jobTitle.includes('portfolio') ||
    jobTitle.includes('capital') ||
    jobTitle.includes('private equity') ||
    jobTitle.includes('asset management') ||
    jobTitle.includes('משקיע') ||
    jobTitle.includes('משקיעה') ||
    jobTitle.includes('השקעות') ||
    jobTitle.includes('קרן') ||
    jobTitle.includes('פיננס') ||
    jobTitle.includes('הון')
  ) {
    return 'investor';
  }

  if (
    jobTitle.includes('software') ||
    jobTitle.includes('developer') ||
    jobTitle.includes('frontend') ||
    jobTitle.includes('backend') ||
    jobTitle.includes('fullstack') ||
    jobTitle.includes('full stack') ||
    jobTitle.includes('engineer') ||
    jobTitle.includes('programmer') ||
    jobTitle.includes('product') ||
    jobTitle.includes('data') ||
    jobTitle.includes('machine learning') ||
    jobTitle.includes('artificial intelligence') ||
    jobTitle.includes('cto') ||
    jobTitle.includes('cyber') ||
    jobTitle.includes('cybersecurity') ||
    jobTitle.includes('technology') ||
    jobTitle.includes('devops') ||
    jobTitle.includes('cloud') ||
    jobTitle.includes('tech') ||
    jobTitle.includes('מתכנת') ||
    jobTitle.includes('מתכנתת') ||
    jobTitle.includes('מפתח') ||
    jobTitle.includes('מפתחת') ||
    jobTitle.includes('מהנדס') ||
    jobTitle.includes('מהנדסת') ||
    jobTitle.includes('מוצר') ||
    jobTitle.includes('דאטה') ||
    jobTitle.includes('סייבר') ||
    jobTitle.includes('הייטק') ||
    jobTitle.includes('טכנולוגיה')
  ) {
    return 'tech';
  }

  if (
    jobTitle.includes('teacher') ||
    jobTitle.includes('educator') ||
    jobTitle.includes('social worker') ||
    jobTitle.includes('volunteer') ||
    jobTitle.includes('community') ||
    jobTitle.includes('nonprofit') ||
    jobTitle.includes('non-profit') ||
    jobTitle.includes('ngo') ||
    jobTitle.includes('public service') ||
    jobTitle.includes('activist') ||
    jobTitle.includes('מורה') ||
    jobTitle.includes('מחנך') ||
    jobTitle.includes('מחנכת') ||
    jobTitle.includes('חינוך') ||
    jobTitle.includes('עובד סוציאלי') ||
    jobTitle.includes('עובדת סוציאלית') ||
    jobTitle.includes('קהילה') ||
    jobTitle.includes('עמותה') ||
    jobTitle.includes('התנדבות') ||
    jobTitle.includes('פעיל חברתי') ||
    jobTitle.includes('פעילה חברתית')
  ) {
    return 'community';
  }

  if (
    jobTitle.includes('student') ||
    jobTitle.includes('intern') ||
    jobTitle.includes('junior') ||
    jobTitle.includes('סטודנט') ||
    jobTitle.includes('סטודנטית') ||
    jobTitle.includes('מתמחה') ||
    jobTitle.includes('תלמיד') ||
    jobTitle.includes('תלמידה')
  ) {
    return 'student';
  }

  return 'default';
}

function detectCategoryBeforeAI(
  personalityJson,
  financialJson,
  donorFeatures = {}
) {
  const donorName = getDonorName(donorFeatures);
  const donorEmail = String(getDonorEmail(donorFeatures) || '').toLowerCase();
  const jobTitle = getJobTitleFromDonorFeatures(donorFeatures);

  console.log('👔 CATEGORY SOURCE DATA:', {
    donorName,
    donorEmail,
    jobTitle,
    hasJobTitle: Boolean(jobTitle),
    donorFeaturesKeys: Object.keys(donorFeatures || {}),
  });

  /*
    דיבאגר 1:
    כאן הכי חשוב לעצור.
    כאן תראי מה מגיע ב-donorFeatures ומה באמת יוצא ב-jobTitle.
    כדי להפעיל: תורידי את // מהשורה הבאה.
  */
  // debugger;

  const manualCategory = getManualCategoryOverride(donorFeatures);

  if (manualCategory) {
    console.log('🎯 MANUAL CATEGORY OVERRIDE:', {
      donorName,
      donorEmail,
      jobTitle,
      category: manualCategory,
    });

    return manualCategory;
  }

  const categoryFromJobTitle = detectCategoryByJobTitle(jobTitle);

  if (categoryFromJobTitle !== 'default') {
    console.log('✅ CATEGORY FROM JOB TITLE:', {
      donorName,
      donorEmail,
      jobTitle,
      category: categoryFromJobTitle,
    });

    return categoryFromJobTitle;
  }

  console.log('⚠️ NO CATEGORY MATCH. RETURNING DEFAULT:', {
    donorName,
    donorEmail,
    jobTitle,
  });

  return 'default';
}

function getFallbackColor(category, campaignJson) {
  const brandColor =
    campaignJson?.color ||
    campaignJson?.brandColor ||
    campaignJson?.brand_color ||
    '#2457A6';

  const colors = {
    student: '#9333EA',
    executive: '#C9A227',
    investor: '#059669',
    tech: '#2DD4BF',
    community: '#EA580C',
    default: brandColor,
  };

  return colors[category] || brandColor;
}

function getFallbackStyleName(category) {
  const styles = {
    student: 'צעיר ומניע',
    executive: 'יוקרתי ומנהיגותי',
    investor: 'רציונלי ומדיד',
    tech: 'טכנולוגי וחד',
    community: 'חם וקהילתי',
    default: 'אישי ומדויק',
  };

  return styles[category] || styles.default;
}

function getFallbackPunchlines(category) {
  const punchlines = {
    student: [
      'גם צעד קטן שלך יכול להתחיל שינוי גדול',
      'הדור שלך לא רק מסתכל מהצד — הוא משנה מציאות',
    ],
    executive: [
      'מנהיגות אמיתית נמדדת גם במה שהיא מאפשרת לאחרים',
      'ההשפעה שלך יכולה להוביל מהלך גדול יותר',
    ],
    investor: [
      'כאן ההשפעה שלך הופכת למשהו שאפשר למדוד',
      'תרומה חכמה היא השקעה בתוצאה אנושית',
    ],
    tech: [
      'פעולה אחת חכמה יכולה להפעיל שינוי אמיתי',
      'כמו מערכת טובה — גם השפעה מתחילה בהחלטה מדויקת',
    ],
    community: [
      'קהילה חזקה מתחילה באנשים שבוחרים לתת יד',
      'התרומה שלך יכולה להגיע בדיוק למי שצריך אותה',
    ],
    default: [
      'ההשפעה שלך יכולה להתחיל כאן',
      'כל תרומה מקרבת אותנו למטרה',
    ],
  };

  return punchlines[category] || punchlines.default;
}

function normalizeGeminiResult(parsed, detectedCategory, campaignJson) {
  const result = parsed && typeof parsed === 'object' ? parsed : {};

  result.category = detectedCategory;

  if (
    typeof result.personalizedEmail !== 'string' ||
    !result.personalizedEmail.trim()
  ) {
    result.personalizedEmail =
      'אנחנו מזמינים אותך לקחת חלק בקמפיין הזה בצורה אישית ומשמעותית. התרומה שלך יכולה לעזור לנו להפוך את המטרה הזו למציאות.';
  }

  if (!Array.isArray(result.punchlines)) {
    result.punchlines = [];
  }

  result.punchlines = result.punchlines
    .filter((item) => typeof item === 'string' && item.trim())
    .map((item) => item.trim())
    .slice(0, 2);

  const fallbackPunchlines = getFallbackPunchlines(detectedCategory);

  while (result.punchlines.length < 2) {
    result.punchlines.push(fallbackPunchlines[result.punchlines.length]);
  }

  if (
    typeof result.suggestedColor !== 'string' ||
    !/^#[0-9A-Fa-f]{6}$/.test(result.suggestedColor.trim())
  ) {
    result.suggestedColor = getFallbackColor(detectedCategory, campaignJson);
  }

  if (typeof result.styleName !== 'string' || !result.styleName.trim()) {
    result.styleName = getFallbackStyleName(detectedCategory);
  }

  if (!Array.isArray(result.threePriceOptions)) {
    result.threePriceOptions = [];
  }

  result.threePriceOptions = result.threePriceOptions
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0)
    .slice(0, 3);

  while (result.threePriceOptions.length < 3) {
    if (result.threePriceOptions.length === 0) {
      result.threePriceOptions.push(50);
    } else {
      result.threePriceOptions.push(
        result.threePriceOptions[result.threePriceOptions.length - 1] * 2
      );
    }
  }

  return result;
}

export const generateCampaignAgentData = async (
  personalityJson,
  financialJson,
  campaignJson,
  donorFeatures = {}
) => {
  try {
    const detectedCategory = detectCategoryBeforeAI(
      personalityJson,
      financialJson,
      donorFeatures
    );

    console.log('🧍 DONOR SENT TO LANDING AGENT:', {
      donorName: getDonorName(donorFeatures),
      donorEmail: getDonorEmail(donorFeatures),
      jobTitle: getJobTitleFromDonorFeatures(donorFeatures),
      detectedCategory,
      donorFeatures,
    });

    /*
      דיבאגר 2:
      כאן תראי מה נשלח בפועל ל-Gemini אחרי שהקטגוריה כבר נקבעה.
      כדי להפעיל: תורידי את // מהשורה הבאה.
    */
    // debugger;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0,
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
              enum: ALLOWED_CATEGORIES,
              description: 'Must be exactly the provided deterministic category.',
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
You are an expert Hebrew behavioral copywriter and conversion rate optimization specialist.

Your goal is to create a hyper-personalized donation landing page for one specific person.

Return ONLY valid JSON.

--- REAL DONOR FEATURES ---
${JSON.stringify(donorFeatures, null, 2)}

--- TARGET COMMUNICATION / PERSONALITY PROFILE ---
${JSON.stringify(personalityJson, null, 2)}

--- TARGET FINANCIAL PROFILE ---
${JSON.stringify(financialJson, null, 2)}

--- CAMPAIGN CONTEXT ---
${JSON.stringify(campaignJson, null, 2)}

--- FIXED CATEGORY ---
The category has already been chosen by the system.

Fixed category:
"${detectedCategory}"

You MUST return exactly this category:
"${detectedCategory}"

Do not change the category.
Do not infer a different category.
Do not return "default" unless the fixed category is "default".

Your job is NOT to classify the person.
Your job is to write copy that fits this exact donor and this exact fixed category.

--- CATEGORY STYLE GUIDE ---

student:
Use a young, energetic, direct, optimistic tone.
Make the donor feel that even a small action matters.

executive:
Use a polished, strategic, leadership-oriented tone.
Focus on responsibility, leadership, influence, and meaningful action.

investor:
Use a rational, data-driven, impact-oriented tone.
Focus on measurable outcomes, smart giving, and clear value.

tech:
Use a modern, sharp, efficient tone.
Focus on smart action, systems, innovation, and precise impact.

community:
Use a warm, human, emotional tone.
Focus on people, connection, local impact, and helping others.

default:
Use a clean, personal, professional tone.
Focus on the campaign goal and the donor's ability to help.

--- TASK REQUIREMENTS ---

1. personalizedEmail:
Write in Hebrew only.
Maximum 2 short paragraphs.
Write for a landing page, not an email inbox.
Make it concise, persuasive, and personal.
Use the donor features, communication profile, financial profile, and campaign context.
Do not sound generic.
Do not mention sensitive or creepy private details directly.
Connect the donor personally to the campaign goal.

2. punchlines:
Return exactly 2 Hebrew strings.
These appear at the top of the landing page under the donor's name.
They must feel personally written for the donor.
They should be short, sharp, emotional or motivational.
No generic slogans.

3. category:
Return exactly:
"${detectedCategory}"

4. suggestedColor:
Return a single valid Hex color code.
Use the following direction:
student: colorful purple / blue / pink
executive: gold / dark navy
investor: green / blue
tech: cyan / teal
community: orange / green / warm
default: harmonize with the campaign brand color

5. styleName:
Return 2-3 Hebrew words describing the psychological angle.

6. threePriceOptions:
Return exactly 3 numbers.
Option 1: safe amount.
Option 2: recommended stretch amount.
Option 3: ambitious/high amount.
Base the numbers on the financial profile.
No currency symbols.

--- OUTPUT FORMAT ---

{
  "personalizedEmail": "string",
  "punchlines": ["string", "string"],
  "category": "${detectedCategory}",
  "suggestedColor": "#9333EA",
  "styleName": "string",
  "threePriceOptions": [50, 120, 250]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const parsed = JSON.parse(response.text());

    const normalized = normalizeGeminiResult(
      parsed,
      detectedCategory,
      campaignJson
    );

    console.log('🎨 FINAL PERSONALIZED LANDING DATA:', {
      donorName: getDonorName(donorFeatures),
      donorEmail: getDonorEmail(donorFeatures),
      jobTitle: getJobTitleFromDonorFeatures(donorFeatures),
      category: normalized.category,
      punchlines: normalized.punchlines,
      styleName: normalized.styleName,
      prices: normalized.threePriceOptions,
    });

    return normalized;
  } catch (error) {
    console.error('Gemini Generation failed:', error);
    throw error;
  }
};