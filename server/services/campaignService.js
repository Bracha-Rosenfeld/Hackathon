import { db } from "../db/db.js";
import { isMissingRequiredData } from "./userValidationService.js";
import { fetchMissingUserData } from "./userDataService.js";
import { analyzeUserForDonation } from "./donationAIService.js";

export async function processCompanyCampaign(companyId) {
  const [users] = await db.query(
    `SELECT u.*
     FROM users u
     JOIN user_companies uc
       ON u.id = uc.user_id
     JOIN companies c
       ON uc.company_id = c.id
     WHERE c.company_id = ?`,
    [companyId]
  );

  for (const user of users) {
    const hasMissingData = isMissingRequiredData(user);

    if (hasMissingData) {
      await fetchMissingUserData(user);
      continue;
    }

    await analyzeUserForDonation(user);
  }

  return {
    success: true,
    total: users.length
  };
}