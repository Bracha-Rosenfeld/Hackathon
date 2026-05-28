// server/controllers/aiController.js
const AI_SERVICE_URL = "http://localhost:5001";

export const getDonorCommunicationProfile = async (req, res) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("AI service error:", error.message);
    res.status(503).json({ success: false, message: "AI service is unavailable." });
  }
};
