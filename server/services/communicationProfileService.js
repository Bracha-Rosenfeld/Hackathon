import axios from "axios";

const AI_MODEL_URL = "http://127.0.0.1:5001/predict";

function buildModelInput(donor) {
  return {
    emailDomainType: donor.emailDomainType || "unknown",

    hasLinkedin: donor.hasLinkedin ? 1 : 0,
    followers: donor.followers || 0,
    connections: donor.connections || 0,

    isStudent: donor.isStudent ? 1 : 0,
    isCEO: donor.isCEO ? 1 : 0,
    isCLevel: donor.isCLevel ? 1 : 0,
    isExecutive: donor.isExecutive ? 1 : 0,
    isManager: donor.isManager ? 1 : 0,
    isDirector: donor.isDirector ? 1 : 0,

    isTechRelated: donor.isTechRelated ? 1 : 0,
    isDataRole: donor.isDataRole ? 1 : 0,
    isPublicSector: donor.isPublicSector ? 1 : 0,
    isComputerScience: donor.isComputerScience ? 1 : 0,

    hasAcademicEducation: donor.hasAcademicEducation ? 1 : 0,
    hasStrongProfessionalPresence: donor.hasStrongProfessionalPresence ? 1 : 0,

    seniority_level: donor.seniority_level || 0,
    professional_presence_score: donor.professional_presence_score || 0,
    data_confidence_score: donor.data_confidence_score || 0
  };
}

export async function predictCommunicationProfile(donorFeatures) {
  try {

    const modelInput = buildModelInput(donorFeatures);

    console.log("📤 CLEAN MODEL INPUT:");
    console.log(JSON.stringify(modelInput, null, 2));

    const response = await axios.post(
      AI_MODEL_URL,
      modelInput
    );

    if (!response.data.success) {
      throw new Error(
        response.data.error || "AI model failed"
      );
    }

    return response.data.communication_profile;

  } catch (error) {

    console.error(
      "Communication profile AI error:",
      error.response?.data || error.message
    );

    throw error;
  }
}