import { enrichDonors } from "./enrichmentService.js";
import { buildDonorFeatures } from "./donorFeatureService.js";
import { processDonorAgentData } from "./donorAnalysisService.js";
import { predictCommunicationProfile } from "./communicationProfileService.js";

export async function processCampaignDonors(connection, companyId) {
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
    return [];
  }

  const donorsForEnrichment = donorsRows.map((donor) => ({
    donorId: donor.id,
    fullName: donor.full_name,
    email: donor.email,
    idNumber: donor.tz_number,
    country: "Israel",
  }));

  console.log("🤖 Running enrichment...");

  const enrichedResults = await enrichDonors(donorsForEnrichment);

  const donorsFeatures = enrichedResults.map((result) =>
    buildDonorFeatures(result)
  );

  console.log("✅ Enrichment finished");

  console.log("🧠 Processing AI insights for each donor...");

  const finalDonorsData = [];

  for (const donor of donorsFeatures) {
    console.log(`⏳ Starting AI analysis for donor: ${donor.fullName}...`);

    console.log("📤 FEATURES SENT TO MODEL:");
    console.log(JSON.stringify(donor, null, 2));

    let communicationProfile = null;
    let financialProfile = null;

    try {
      communicationProfile = await predictCommunicationProfile(donor);

      console.log(`✅ Communication profile generated for: ${donor.fullName}`);
    } catch (error) {
      console.error(
        `⚠️ Communication profile failed for donor: ${donor.fullName}`,
        error.message
      );
    }

    try {
      const aiInsights = await processDonorAgentData(donor);

      financialProfile = aiInsights.financialJson;

      console.log(`✅ Financial profile generated for: ${donor.fullName}`);
    } catch (error) {
      console.error(
        `⚠️ Financial profile failed for donor: ${donor.fullName}`,
        error.message
      );
    }

    finalDonorsData.push({
      email: donor.email,
      fullName: donor.fullName,

      // מה שהיה עד עכשיו
      communicationProfile,
      financialProfile,

      // חדש: כל הדאטה המקורי/מועשר לפני יצירת דף הנחיתה
      donorFeatures: donor,
    });
  }

  console.log("✅ AI Processing finished for all donors.");

  console.log("📊 Final Processed Data:");
  console.log(JSON.stringify(finalDonorsData, null, 2));

  return finalDonorsData;
}