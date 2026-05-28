import { searchContact } from "./apolloService.js";
import { searchPDL } from "./pdlService.js";
import { findLinkedinProfileResult } from "./tavilyService.js";
import { normalizeTavilyLinkedinResult } from "./tavilyParserService.js";

function normalizeApollo(apolloData) {
  const contact = apolloData?.contacts?.[0];

  if (!contact) return null;

  return {
    source: "apollo",

    fullName: contact.name || null,
    email: contact.email || null,

    title: contact.title || null,
    company: contact.organization_name || null,

    linkedinUrl: contact.linkedin_url || null,

    city: contact.city || null,
    country: contact.country || null,

    headline: contact.headline || null,

    industry:
      contact.organization?.industry ||
      contact.account?.industry ||
      null,

    companyWebsite:
      contact.organization?.website_url ||
      contact.account?.website_url ||
      null,

    companyFounded:
      contact.organization?.founded_year ||
      contact.account?.founded_year ||
      null,

    companySize:
      contact.organization?.estimated_num_employees ||
      contact.account?.estimated_num_employees ||
      null,

    signals: {
      isFounderOrCEO: /founder|ceo|chief executive/i.test(
        `${contact.title || ""} ${contact.headline || ""}`
      ),

      isTechRelated: /software|data|ai|engineer|developer|technology|tech/i.test(
        `${contact.title || ""} ${contact.headline || ""} ${contact.organization?.industry || ""}`
      ),

      hasVerifiedEmail:
        contact.email_status === "verified" ||
        contact.email_true_status === "Verified"
    }
  };
}

function normalizePDL(pdlData) {
  const person = pdlData?.data;

  if (!person) return null;

  return {
    source: "pdl",

    fullName: person.full_name || null,

    title: person.job_title || null,
    company: person.job_company_name || null,

    linkedinUrl: person.linkedin_url
      ? person.linkedin_url.startsWith("http")
        ? person.linkedin_url
        : `https://${person.linkedin_url}`
      : null,

    industry:
      person.industry ||
      person.job_company_industry ||
      person.job_company_industry_v2 ||
      null,

    companySize: person.job_company_size || null,

    country: person.location_country || null,

    experience: person.experience || [],
    education: person.education || [],
    profiles: person.profiles || [],

    signals: {
      isCLevel: person.job_title_levels?.includes("cxo") || false,

      isExecutive:
        person.job_title_sub_role === "executive" ||
        person.job_title_levels?.includes("cxo") ||
        false,

      isTechRelated: /software|data|ai|engineer|developer|technology|computer/i.test(
        `${person.job_title || ""} ${person.industry || ""} ${person.job_company_industry || ""}`
      ),

      hasEliteEducation: Array.isArray(person.education)
        ? person.education.some((edu) =>
            /stanford|wharton|harvard|mit|technion|hebrew university|tel aviv university/i.test(
              edu?.school?.name || ""
            )
          )
        : false
    }
  };
}

function mergeSignals(...profiles) {
  const signals = {};

  for (const profile of profiles) {
    if (profile?.signals) {
      Object.assign(signals, profile.signals);
    }
  }

  return signals;
}

function mergeProfiles(...profiles) {
  const cleanProfiles = profiles.filter(Boolean);

  const merged = cleanProfiles.reduce((result, profile) => {
    const cleanEntries = Object.entries(profile).filter(
      ([key, value]) =>
        key !== "signals" &&
        value !== null &&
        value !== undefined &&
        value !== ""
    );

    return {
      ...result,
      ...Object.fromEntries(cleanEntries)
    };
  }, {});

  return {
    ...merged,
    signals: mergeSignals(...cleanProfiles)
  };
}

export async function enrichPerson({ fullName, email, country = "Israel" }) {
  let apolloProfile = null;
  let pdlProfile = null;
  let tavilyProfile = null;

  try {
    const apolloData = await searchContact(email);
    apolloProfile = normalizeApollo(apolloData);
  } catch (error) {
    console.log("Apollo failed, continuing...");
  }

  try {
    const pdlData = await searchPDL(email);
    pdlProfile = normalizePDL(pdlData);
  } catch (error) {
    console.log("PDL failed, continuing...");
  }

  const existingLinkedin =
    apolloProfile?.linkedinUrl || pdlProfile?.linkedinUrl;

  if (!existingLinkedin && fullName) {
    try {
      const tavilyResult = await findLinkedinProfileResult(
        fullName,
        country
      );

      tavilyProfile = normalizeTavilyLinkedinResult(
        tavilyResult,
        fullName
      );
    } catch (error) {
      console.log("Tavily failed, continuing...");
    }
  }

  const finalProfile = mergeProfiles(
    apolloProfile,
    pdlProfile,
    tavilyProfile
  );

  const sourcesUsed = [
    apolloProfile ? "apollo" : null,
    pdlProfile ? "pdl" : null,
    tavilyProfile ? "tavily" : null
  ].filter(Boolean);

  return {
    input: {
      fullName,
      email,
      country
    },

    found: Object.keys(finalProfile).length > 0,

    profile: finalProfile,

    sourcesUsed
  };
}

export async function enrichDonors(donors) {
  const results = [];

  for (const donor of donors) {
    const enriched = await enrichPerson(donor);
    console.log(`✅ Finished enriching ${donor.fullName}`);
    results.push(enriched);
  }

  return results;
}