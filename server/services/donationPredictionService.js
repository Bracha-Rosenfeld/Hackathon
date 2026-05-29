import axios from "axios";

const DONATION_MODEL_URL = "http://127.0.0.1:5001/predict-donation";

function buildDonationModelInput(donor) {
  return {
    emailDomainType: donor.emailDomainType || "unknown",
    city_tier: donor.city_tier || "unknown",

    hasLinkedin: donor.hasLinkedin ? 1 : 0,
    followers: donor.followers || 0,
    connections: donor.connections || 0,

    isStudent: donor.isStudent ? 1 : 0,
    isCEO: donor.isCEO ? 1 : 0,
    isFounder: donor.isFounder ? 1 : 0,
    isOwner: donor.isOwner ? 1 : 0,
    isCLevel: donor.isCLevel ? 1 : 0,
    isExecutive: donor.isExecutive ? 1 : 0,
    isManager: donor.isManager ? 1 : 0,

    isTechRelated: donor.isTechRelated ? 1 : 0,
    isFinanceRelated: donor.isFinanceRelated ? 1 : 0,
    isRealEstateRelated: donor.isRealEstateRelated ? 1 : 0,
    isMedicalRelated: donor.isMedicalRelated ? 1 : 0,
    isPublicSector: donor.isPublicSector ? 1 : 0,

    seniority_level: donor.seniority_level || 0,
    wealth_proxy_score: donor.wealth_proxy_score || 0,
    professional_presence_score: donor.professional_presence_score || 0,
    data_confidence_score: donor.data_confidence_score || 0
  };
}

export async function predictDonationAmounts(donorFeatures) {
  try {
    const modelInput = buildDonationModelInput(donorFeatures);

    console.log("💰 DONATION CAPACITY MODEL INPUT V3:");
    console.log(JSON.stringify(modelInput, null, 2));

    const response = await axios.post(
      DONATION_MODEL_URL,
      modelInput
    );

    if (!response.data.success) {
      throw new Error(
        response.data.error || "Donation capacity model failed"
      );
    }

    console.log("💰 DONATION CAPACITY MODEL RESULT V3:");
    console.log(JSON.stringify(response.data.donationPrediction, null, 2));

    return response.data.donationPrediction;

  } catch (error) {
    console.error(
      "Donation prediction AI error:",
      error.response?.data || error.message
    );

    throw error;
  }
}