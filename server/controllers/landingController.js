import {db} from "../../db/db.js";
export const getLandingData = async (req, res) => {
  try {
    const { token } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM personalized_landings
      WHERE token = ?
    `,
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Landing page not found',
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
    });
  }
};