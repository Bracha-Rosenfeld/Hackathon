import { enrichDonors } from "./enrichmentService.js";
import { buildDonorFeatures } from "./donorFeatureService.js";
import { processDonorAgentData } from "./donorAnalysisService.js"; 

export async function processCampaignDonors(connection, companyId) {
  //שלב 1: שליפת התורמים מה-DB והעשרת המידע שלהם עם כל הפיצ'רים שצריך
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
    country: "Israel"
  }));

  console.log("🤖 Running enrichment...");

  const enrichedResults = await enrichDonors(donorsForEnrichment);

  const donorsFeatures = enrichedResults.map((result) =>
    buildDonorFeatures(result)
  );

  console.log("✅ Enrichment finished");
  //שלב 2: העברת הגייסון הענק לAI שיחזיר לי עבור כל אחד 2 ניתוחים: פרסונליות ופיננסי
  console.log("🧠 Processing AI insights for each donor...");

  const finalDonorsData = [];
  
  for (const donor of donorsFeatures) {
    console.log(`⏳ Starting AI analysis for donor: ${donor.fullName}...`); 
    
    try {
      const aiInsights = await processDonorAgentData(donor);
      
      console.log(`✅ Successfully generated AI insights for: ${donor.fullName}`); 
      
      finalDonorsData.push({
        email: donor.email,
        personalityProfile: aiInsights.personalityJson,
        financialProfile: aiInsights.financialJson
      });
    } catch (error) {
      console.error(`⚠️ Failed to process AI insights for donor: ${donor.fullName}`, error.message);
      
      finalDonorsData.push({ 
        email: donor.email, 
        personalityProfile: null, 
        financialProfile: null 
      });
    }
  }

  console.log("✅ AI Processing finished for all donors.");
  
  console.log("📊 Final Processed Data (Email + 2 JSONs):");
  console.log(JSON.stringify(finalDonorsData, null, 2));

  return finalDonorsData;
}