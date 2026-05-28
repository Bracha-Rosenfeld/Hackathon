import { processDonorAgentData } from "../services/donorAnalysisService.js";

/**
 * קונטרולר ייעודי לטיפול בבקשות ניתוח תורמים מהאייג'נט
 */
export const handleDonorAnalysisRequest = async (req, res) => {
  try {
    const inputData = req.body;

    // בדיקה בסיסית שהתקבל מידע ב-body
    if (!inputData || Object.keys(inputData).length === 0) {
      return res.status(400).json({ error: "No agent data provided in the request body" });
    }

    // הפעלה של הסרוויס החדש
    const coordinatedResult = await processDonorAgentData(inputData);

    // החזרת הג'ייסון המתואם בדיוק בפורמט שביקשת
    return res.status(200).json(coordinatedResult);

  } catch (error) {
    console.error("Error inside donorAnalysisController:", error);
    return res.status(500).json({ error: "Internal Server Error during donor profiling" });
  }
};