const {
  processCompanyCampaign
} = require("../services/campaignService");

async function sendEmailsToCompanyDonors(req, res) {

  try {

    const result = await processCompanyCampaign(
      req.params.companyId
    );

    res.json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
}

module.exports = {
  sendEmailsToCompanyDonors
};