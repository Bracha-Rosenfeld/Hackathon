import { enrichDonors } from "./enrichmentService.js";
import { buildDonorFeatures } from "./donorFeatureService.js";

// פונקציה עתידית - כרגע רק placeholder
async function runNextAgentStep(donorsFeatures, campaignData) {
  console.log("➡️ Here we will send donorsFeatures to the next function/model later");

  // כרגע מחזירים כמו שזה
  return donorsFeatures;
}

export async function processCampaignDonors(connection, companyId, campaignData) {
  console.log("🤖 Fetching donors for company:", companyId);

  const [donorsRows] = await connection.query(
    `SELECT 
        id,
        full_name,
        email,
        tz_number
     FROM donors
     WHERE company_id = ?`,
    [companyId]
  );

  console.log(`👥 Found ${donorsRows.length} donors`);

  if (donorsRows.length === 0) {
    return {
      donorsCount: 0,
      enrichedDonors: [],
      processedDonors: []
    };
  }

  const donorsForEnrichment = donorsRows.map((donor) => ({
    donorId: donor.id,
    fullName: donor.full_name,
    email: donor.email,
    idNumber: donor.tz_number,
    country: "Israel"
  }));

  console.log("🤖 Running enrichment...");

  const enrichedResults = await enrichDonors(donorsForEnrichment);

  const donorsFeatures = enrichedResults.map((result) =>
    buildDonorFeatures(result)
  );

  console.log("✅ Enrichment finished");

  // כאן את שומרת את המידע על כל עובד במערך
  const enrichedEmployeesArray = donorsFeatures;

  // כאן מעבירים לפונקציה הבאה שכרגע עוד לא באמת כתובה
  const processedDonors = await runNextAgentStep(
    enrichedEmployeesArray,
    campaignData
  );

  return {
    donorsCount: donorsRows.length,
    enrichedDonors: enrichedEmployeesArray,
    processedDonors
  };
}