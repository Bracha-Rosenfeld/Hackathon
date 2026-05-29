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

  const seniority_level =
    isCEO || isCLevel ? 5 :
      isDirector ? 4 :
        isManager ? 3 :
          isStudent ? 1 :
            2;

  const wealth_proxy_score =
    hasLargeCompany ? 8 :
      hasBusinessEmail ? 6 :
        3;

  const professional_presence_score =
    hasStrongProfessionalPresence ? 8 :
      hasLinkedin ? 6 :
        2;

  const data_confidence_score =
    enrichedResult?.found ? 7 : 2;

  const city_tier =
    ["Tel Aviv", "Jerusalem"].includes(profile.city)
      ? "high"
      : profile.city
        ? "medium"
        : "unknown";

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