import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve("../../.env")
});

const PDL_API_KEY = process.env.PDL_API_KEY;

export async function searchPDL(email) {

  try {

    const response = await axios.get(
      "https://api.peopledatalabs.com/v5/person/enrich",
      {
        params: {
          email: email,
          api_key: PDL_API_KEY
        }
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "PDL Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}