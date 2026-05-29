// import { enrichDonors } from "./enrichmentService.js";
// import { buildDonorFeatures } from "./donorFeatureService.js";
// import { processDonorAgentData } from "./donorAnalysisService.js"; 
// import { predictCommunicationProfile } from "./communicationProfileService.js";

// export async function processCampaignDonors(connection, companyId) {
//   //שלב 1: שליפת התורמים מה-DB והעשרת המידע שלהם עם כל הפיצ'רים שצריך
//   console.log("🤖 Fetching donors for company:", companyId);

//   const [donorsRows] = await connection.query(
//     `SELECT 
//         id,
//         full_name,
//         email,
//         tz_number
//      FROM donors
//      WHERE company_id = ?`,
//     [companyId]
//   );

//   console.log(`👥 Found ${donorsRows.length} donors`);

//   if (donorsRows.length === 0) {
//     return [];
//   }

//   const donorsForEnrichment = donorsRows.map((donor) => ({
//     donorId: donor.id,
//     fullName: donor.full_name,
//     email: donor.email,
//     idNumber: donor.tz_number,
//     country: "Israel"
//   }));

//   console.log("🤖 Running enrichment...");

//   const enrichedResults = await enrichDonors(donorsForEnrichment);

//   const donorsFeatures = enrichedResults.map((result) =>
//     buildDonorFeatures(result)
//   );

//   console.log("✅ Enrichment finished");
//   //שלב 2: העברת הגייסון הענק לAI שיחזיר לי עבור כל אחד 2 ניתוחים: פרסונליות ופיננסי
//   console.log("🧠 Processing AI insights for each donor...");

//   const finalDonorsData = [];
  
//   for (const donor of donorsFeatures) {
//   console.log(`⏳ Starting AI analysis for donor: ${donor.fullName}...`);

//   console.log("📤 FEATURES SENT TO MODEL:");
//   console.log(JSON.stringify(donor, null, 2));

//   let communicationProfile = null;
//   let financialProfile = null;

//   try {
//     communicationProfile = await predictCommunicationProfile(donor);

//     console.log(`✅ Communication profile generated for: ${donor.fullName}`);
//   } catch (error) {
//     console.error(
//       `⚠️ Communication profile failed for donor: ${donor.fullName}`,
//       error.message
//     );
//   }

//   try {
//     const aiInsights = await processDonorAgentData(donor);

//     financialProfile = aiInsights.financialJson;

//     console.log(`✅ Financial profile generated for: ${donor.fullName}`);
//   } catch (error) {
//     console.error(
//       `⚠️ Financial profile failed for donor: ${donor.fullName}`,
//       error.message
//     );
//   }

//   finalDonorsData.push({
//     email: donor.email,
//     communicationProfile,
//     financialProfile
//   });
// }

//   console.log("✅ AI Processing finished for all donors.");
  
//   console.log("📊 Final Processed Data (Email + 2 JSONs):");
//   console.log(JSON.stringify(finalDonorsData, null, 2));

//   return finalDonorsData;
// }

import { enrichDonors } from "./enrichmentService.js";
import { buildDonorFeatures } from "./donorFeatureService.js";
import { predictCommunicationProfile } from "./communicationProfileService.js";
import { predictDonationAmounts } from "./donationPredictionService.js";

export async function processCampaignDonors(connection, companyId) {
  // שלב 1: שליפת התורמים מה-DB
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

  // שלב 2: הכנת התורמים להעשרת מידע
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

  // שלב 3: הרצת מודלי AI על כל תורם
  console.log("🧠 Processing AI predictions for each donor...");

  const finalDonorsData = [];

  for (const donor of donorsFeatures) {
    console.log(`⏳ Starting AI analysis for donor: ${donor.fullName}...`);

    console.log("📤 FEATURES SENT TO MODELS:");
    console.log(JSON.stringify(donor, null, 2));

    let communicationProfile = null;
    let donationPrediction = null;
    let financialProfile = null;

    // מודל 1: פרופיל תקשורתי
    try {
      communicationProfile = await predictCommunicationProfile(donor);

      console.log(`✅ Communication profile generated for: ${donor.fullName}`);
    } catch (error) {
      console.error(
        `⚠️ Communication profile failed for donor: ${donor.fullName}`,
        error.message
      );
    }

    // מודל 2: חיזוי סכומי תרומה
    try {
      donationPrediction = await predictDonationAmounts(donor);

      // כדי לשמור על השם הקיים במערכת,
      // אנחנו מכניסים את חיזוי התרומה גם תחת financialProfile
      financialProfile = {
        source: "donation_amount_model_v1",
        safeAmount: donationPrediction.safe_amount,
        stretchAmount: donationPrediction.stretch_amount,
        visionaryAmount: donationPrediction.visionary_amount,
        threePriceOptions: donationPrediction.threePriceOptions
      };

      console.log(`✅ Donation prediction generated for: ${donor.fullName}`);
    } catch (error) {
      console.error(
        `⚠️ Donation prediction failed for donor: ${donor.fullName}`,
        error.message
      );
    }

    finalDonorsData.push({
      email: donor.email,
      fullName: donor.fullName,

      communicationProfile,

      // השדה החדש והברור
      donationPrediction,

      // השדה הישן, כדי לא לשבור קוד קיים
      financialProfile
    });
  }

  console.log("✅ AI Processing finished for all donors.");

  console.log("📊 Final Processed Data:");
  console.log(JSON.stringify(finalDonorsData, null, 2));

  return finalDonorsData;
}