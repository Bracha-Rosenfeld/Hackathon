function getEmailDomain(email) {
  if (!email || !email.includes("@")) return null;

  return email.split("@")[1].toLowerCase();
}

function getEmailDomainType(email) {
  const domain = getEmailDomain(email);

  if (!domain) return "unknown";

  const freeDomains = [
    "gmail.com",
    "walla.co.il",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com"
  ];

  return freeDomains.includes(domain) ? "free" : "business";
}

function includesAny(text, words) {
  const lowerText = String(text || "").toLowerCase();

  return words.some((word) =>
    lowerText.includes(word.toLowerCase())
  );
}

function clampScore(value, min = 1, max = 10) {
  return Math.max(min, Math.min(max, Number(value.toFixed(2))));
}

export function buildDonorFeatures(enrichedResult) {
  const input = enrichedResult?.input || {};
  const profile = enrichedResult?.profile || {};

  const text = `
    ${profile.title || ""}
    ${profile.headline || ""}
    ${profile.company || ""}
    ${profile.industry || ""}
    ${profile.education || ""}
    ${profile.rawTitle || ""}
    ${profile.rawContent || ""}
  `;

  const emailDomain = getEmailDomain(input.email);
  const emailDomainType = getEmailDomainType(input.email);

  const followers = profile.followers || 0;
  const connections = profile.connections || 0;

  const hasLinkedin = Boolean(profile.linkedinUrl);

  const isStudent =
    Boolean(profile.signals?.isStudent) ||
    includesAny(text, ["student", "סטודנט", "student at"]);

  const isFounder =
    Boolean(profile.signals?.isFounder) ||
    includesAny(text, ["founder", "co-founder", "מייסד"]);

  const isCEO =
    Boolean(profile.signals?.isCEO) ||
    includesAny(text, ["ceo", "chief executive officer", "מנכ"]);

  const isCLevel =
    Boolean(profile.signals?.isCLevel) ||
    includesAny(text, [
      "cxo",
      "cto",
      "cfo",
      "coo",
      "chief",
      "chief executive",
      "chief technology",
      "chief financial"
    ]);

  const isManager =
    includesAny(text, [
      "manager",
      "director",
      "head of",
      "team lead",
      "lead",
      "מנהל",
      "מנהלת"
    ]);

  const isDirector =
    includesAny(text, ["director", "דירקטור"]);

  const isOwner =
    includesAny(text, ["owner", "business owner", "בעלים"]);

  const isTechRelated =
    Boolean(profile.signals?.isTechRelated) ||
    includesAny(text, [
      "software",
      "developer",
      "engineer",
      "data",
      "ai",
      "computer science",
      "technology",
      "tech",
      "cyber",
      "מדעי המחשב",
      "תוכנה"
    ]);

  const isDataRole =
    Boolean(profile.signals?.isDataRole) ||
    includesAny(text, [
      "data",
      "analyst",
      "analytics",
      "bi",
      "business intelligence"
    ]);

  const isFinanceRelated =
    includesAny(text, [
      "finance",
      "investment",
      "bank",
      "capital",
      "fund",
      "financial",
      "השקעות",
      "פיננסים"
    ]);

  const isRealEstateRelated =
    includesAny(text, [
      "real estate",
      "realty",
      "property",
      "construction",
      "נדלן",
      "נדל״ן"
    ]);

  const isMedicalRelated =
    includesAny(text, [
      "doctor",
      "medical",
      "health",
      "hospital",
      "clinic",
      "physician",
      "רופא",
      "רפואה"
    ]);

  const isLegalRelated =
    includesAny(text, [
      "lawyer",
      "legal",
      "attorney",
      "law",
      "עו\"ד",
      "עורך דין",
      "משפטים"
    ]);

  const isPublicSector =
    Boolean(profile.signals?.isPublicSector) ||
    includesAny(text, [
      "israel police",
      "משטרת ישראל",
      "government",
      "ministry",
      "public sector",
      "עירייה",
      "משרד ממשלתי"
    ]);

  const isNonProfitRelated =
    includesAny(text, [
      "nonprofit",
      "non-profit",
      "ngo",
      "charity",
      "foundation",
      "עמותה"
    ]);

  const isComputerScience =
    Boolean(profile.signals?.isComputerScience) ||
    includesAny(text, [
      "computer science",
      "מדעי המחשב"
    ]);

  const hasAcademicEducation =
    Boolean(profile.education) ||
    Boolean(profile.signals?.hasAcademicEducation) ||
    isComputerScience;

  const hasEliteEducation =
    Boolean(profile.signals?.hasEliteEducation);

  const hasCompanyWebsite = Boolean(profile.companyWebsite);
  const hasCompanyLinkedin = Boolean(profile.companyLinkedinUrl);

  const companySizeText = String(profile.companySize || "").toLowerCase();

  const hasLargeCompany =
    companySizeText.includes("1000") ||
    companySizeText.includes("10001") ||
    companySizeText.includes("large");

  const hasStartupSignal =
    includesAny(text, [
      "startup",
      "start-up",
      "venture",
      "founder",
      "co-founder"
    ]);

  const hasStrongProfessionalPresence =
    hasLinkedin && (followers >= 500 || connections >= 500);
  const hasBusinessEmail = emailDomainType === "business";

  const city_tier =
  ["Tel Aviv", "Jerusalem", "Herzliya", "Ramat Gan", "Givatayim", "Ra'anana", "Raanana"].includes(profile.city)
    ? "high"
    : profile.city
      ? "mid"
      : "unknown";

const seniority_level =
  isCEO || isCLevel ? 5 :
    isDirector ? 4 :
      isManager ? 3 :
        isStudent ? 1 :
          2;

let professionalPresence = 1;

if (hasLinkedin) professionalPresence += 2;

if (followers >= 100) professionalPresence += 0.5;
if (followers >= 500) professionalPresence += 1;
if (followers >= 1500) professionalPresence += 1.5;
if (followers >= 3000) professionalPresence += 2;

if (connections >= 100) professionalPresence += 0.5;
if (connections >= 500) professionalPresence += 1;
if (connections >= 1000) professionalPresence += 1.5;

if (profile.title) professionalPresence += 1;
if (profile.company) professionalPresence += 1;
if (profile.headline) professionalPresence += 0.5;

const professional_presence_score = clampScore(professionalPresence);

let dataConfidence = 2;

if (enrichedResult?.found) dataConfidence += 2;
if (hasLinkedin) dataConfidence += 1.5;
if (profile.title) dataConfidence += 1;
if (profile.company) dataConfidence += 1;
if (profile.city) dataConfidence += 0.7;
if (profile.industry) dataConfidence += 0.7;
if (hasBusinessEmail) dataConfidence += 1;
if (profile.signals?.hasVerifiedEmail) dataConfidence += 0.8;

const data_confidence_score = clampScore(dataConfidence);

let wealthProxy = 2;

wealthProxy += seniority_level * 0.75;
wealthProxy += professional_presence_score * 0.25;

if (isCEO) wealthProxy += 2;
if (isFounder) wealthProxy += 1.7;
if (isCLevel) wealthProxy += 1.5;
if (isDirector) wealthProxy += 1;
if (isManager) wealthProxy += 0.6;
if (isOwner) wealthProxy += 1.5;

if (isFinanceRelated) wealthProxy += 1.2;
if (isRealEstateRelated) wealthProxy += 1.2;
if (isMedicalRelated) wealthProxy += 0.7;
if (isLegalRelated) wealthProxy += 0.6;

if (hasLargeCompany) wealthProxy += 1.4;
if (hasBusinessEmail) wealthProxy += 0.7;

if (city_tier === "high") wealthProxy += 0.8;

if (isStudent) wealthProxy -= 1.2;
if (isPublicSector) wealthProxy -= 0.2;

const wealth_proxy_score = clampScore(wealthProxy);

const companySizeBucket =
  hasLargeCompany ? "large" : "unknown";

  return {
    fullName: input.fullName || profile.fullName || null,
    email: input.email || null,
    idNumber: input.idNumber || null,
    country: input.country || profile.country || "Israel",
    city: profile.city || null,

    emailDomain,
    emailDomainType,

    found: Boolean(enrichedResult?.found),
    
    linkedinUrl: profile.linkedinUrl || null,
    title: profile.title || null,
    headline: profile.headline || null,
    company: profile.company || null,
    industry: profile.industry || null,

    companyWebsite: profile.companyWebsite || null,
    companyFounded: profile.companyFounded || null,
    companySize: profile.companySize || null,
    companyLinkedinUrl: profile.companyLinkedinUrl || null,

    education: profile.education || null,

    followers,
    connections,

    hasLinkedin,
    hasBusinessEmail,
    hasVerifiedEmail: Boolean(profile.signals?.hasVerifiedEmail),

    isStudent,
    isFounder,
    isCEO,
    isCLevel,
    isExecutive: isCEO || isCLevel,
    isManager,
    isDirector,
    isOwner,

    isTechRelated,
    isDataRole,
    isFinanceRelated,
    isRealEstateRelated,
    isMedicalRelated,
    isLegalRelated,
    isPublicSector,
    isNonProfitRelated,

    hasAcademicEducation,
    hasEliteEducation,
    isComputerScience,

    hasCompanyWebsite,
    hasCompanyLinkedin,
    hasLargeCompany,
    hasStartupSignal,
    hasStrongProfessionalPresence,

    age_estimate: 0,
    city_tier,
    companySizeBucket,
    seniority_level,
    wealth_proxy_score,
    professional_presence_score,
    data_confidence_score
  };
}