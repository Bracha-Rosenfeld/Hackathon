import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../../.env") });

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

/**
 * מחזיר רק URL של LinkedIn אם נמצאה התאמה מדויקת.
 * השארנו את הפונקציה הזאת כדי שקוד קיים לא יישבר.
 */
export async function findLinkedinUrl(
  fullName,
  country = "Israel",
  email = null
) {
  const result = await findLinkedinProfileResult({
    fullName,
    email,
    country
  });

  return result?.url || null;
}

/**
 * מחפש פרופיל LinkedIn לפי:
 * 1. שם מקורי — עברית או אנגלית
 * 2. שם באנגלית אם קיים
 * 3. תעתוק אוטומטי מעברית לאנגלית
 *
 * החיפוש כולל גם מייל.
 * אבל מחזיר תוצאה רק אם השם המדויק מופיע בתוצאה.
 */
export async function findLinkedinProfileResult({
  fullName,
  englishName = null,
  email = null,
  country = "Israel"
}) {
  try {
    const transliteratedName = isHebrewText(fullName)
      ? transliterateHebrewName(fullName)
      : null;

    const namesToSearch = [
      fullName,
      englishName,
      transliteratedName
    ]
      .filter(Boolean)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const uniqueNamesToSearch = [...new Set(namesToSearch)];

    for (const name of uniqueNamesToSearch) {
      const query = buildLinkedinSearchQuery({
        name,
        email,
        country
      });

      console.log("🔎 Tavily exact LinkedIn search:", query);

      const response = await axios.post(
        "https://api.tavily.com/search",
        {
          query,
          search_depth: "basic",
          max_results: 10
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TAVILY_API_KEY}`
          }
        }
      );

      const results = response.data.results || [];
      // console.log("🔎 RAW RESULTS:");
      // console.log(JSON.stringify(results, null, 2));
      const exactResult = results.find((result) =>
        isExactLinkedinProfileMatch(result, name)
      );

      if (exactResult) {
        console.log("✅ Exact LinkedIn profile found for:", name);
        return exactResult;
      }

      console.log("⚠️ No exact LinkedIn match for:", name);
    }

    return null;
  } catch (error) {
    console.error(
      "Tavily Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}

/**
 * בונה שאילתת חיפוש:
 * "שם" "מייל" Israel LinkedIn site:linkedin.com/in
 */
function buildLinkedinSearchQuery({ name, country }) {
  const parts = [
    name ? `"${name}"` : null,
    country || "Israel",
    "LinkedIn",
    "site:linkedin.com/in"
  ].filter(Boolean);

  return parts.join(" ");
}

/**
 * בודק שהתוצאה היא באמת פרופיל LinkedIn
 * ושהשם המדויק מופיע בכותרת או בתוכן.
 *
 * המייל עוזר לחיפוש,
 * אבל הבדיקה הסופית היא לפי שם מדויק,
 * כדי שלא נחזיר אדם אחר בטעות.
 */
function isExactLinkedinProfileMatch(result, searchedName) {
  const url = String(result.url || "").toLowerCase();
  const title = cleanText(result.title || "");
  const content = cleanText(result.content || "");
  const name = cleanText(searchedName || "");

  if (!url.includes("linkedin.com/in/")) {
    return false;
  }

  if (!name) {
    return false;
  }

  return (
    hasExactName(title, name) ||
    hasExactName(content, name)
  );
}

function cleanText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[״"]/g, "")
    .replace(/[׳']/g, "")
    .replace(/[.,|()[\]{}<>_:;!?/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasExactName(text, name) {
  if (!text || !name) {
    return false;
  }

  const escapedName = escapeRegExp(name);

  const exactNameRegex = new RegExp(
    `(^|\\s)${escapedName}(\\s|$)`,
    "i"
  );

  return exactNameRegex.test(text);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isHebrewText(value) {
  return /[\u0590-\u05FF]/.test(String(value || ""));
}

/**
 * תעתוק בסיסי מעברית לאנגלית.
 * לא מושלם לכל שם, אבל מספיק טוב להתחלה.
 * אם שם יוצא לא טוב — מוסיפים אותו למילון commonNames.
 */
function transliterateHebrewName(hebrewName) {
  const words = String(hebrewName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .map(transliterateHebrewWord)
    .join(" ");
}

function transliterateHebrewWord(word) {
  const commonNames = {
    "טוהר": "Tohar",
    "תוהר": "Tohar",
    "אמר": "Amar",

    "יעל": "Yael",
    "נועה": "Noa",
    "שרה": "Sara",
    "רחל": "Rachel",
    "רבקה": "Rivka",
    "לאה": "Leah",
    "אפרת": "Efrat",
    "אביגיל": "Avigail",
    "שירה": "Shira",
    "חנה": "Chana",
    "אסתר": "Esther",
    "מיכל": "Michal",
    "מרים": "Miriam",
    "תמר": "Tamar",
    "דבורה": "Dvora",
    "דינה": "Dina",

    "משה": "Moshe",
    "יוסף": "Yosef",
    "דוד": "David",
    "אברהם": "Avraham",
    "יצחק": "Yitzchak",
    "יעקב": "Yaakov",
    "שמואל": "Shmuel",
    "שלמה": "Shlomo",
    "אהרן": "Aharon",
    "חיים": "Chaim",
    "יונתן": "Yonatan",
    "נתן": "Natan",
    "ישראל": "Israel",
    "אליהו": "Eliyahu",
    "בנימין": "Binyamin",
    "דניאל": "Daniel",
    "אריאל": "Ariel",
    "איתי": "Itay",

    "כהן": "Cohen",
    "לוי": "Levi",
    "מזרחי": "Mizrahi",
    "פרץ": "Peretz",
    "ביטון": "Biton",
    "דהן": "Dahan",
    "אוחנה": "Ohana",
    "גבאי": "Gabay",
    "חדד": "Hadad",
    "מלכה": "Malka",
    "אזולאי": "Azoulay",
    "אברהמי": "Avrahami",
    "סולובייציק": "Soloveitchik"
  };

  if (commonNames[word]) {
    return commonNames[word];
  }

  const map = {
    "א": "",
    "ב": "b",
    "ג": "g",
    "ד": "d",
    "ה": "h",
    "ו": "o",
    "ז": "z",
    "ח": "ch",
    "ט": "t",
    "י": "i",
    "כ": "ch",
    "ך": "ch",
    "ל": "l",
    "מ": "m",
    "ם": "m",
    "נ": "n",
    "ן": "n",
    "ס": "s",
    "ע": "",
    "פ": "p",
    "ף": "p",
    "צ": "tz",
    "ץ": "tz",
    "ק": "k",
    "ר": "r",
    "ש": "sh",
    "ת": "t"
  };

  const raw = word
    .split("")
    .map((char) => map[char] ?? "")
    .join("");

  if (!raw) {
    return word;
  }

  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

findLinkedinProfileResult({
  fullName: "Tohar Amar",
  country: "Israel"
})
  .then((res) => {
    console.log("✅ TAVILY RESULT:");
    console.log(JSON.stringify(res, null, 2));
  })
  .catch((err) => {
    console.log("❌ TAVILY ERROR:");
    console.log(err.response?.data || err.message);
  });