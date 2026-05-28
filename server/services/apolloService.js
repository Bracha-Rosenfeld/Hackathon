import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve("../../.env")
});

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

export async function searchContact(email) {

  try {

    const response = await axios.post(
      "https://api.apollo.io/api/v1/contacts/search",
      {
        q_keywords: email
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "X-Api-Key": APOLLO_API_KEY
        }
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "Apollo Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}