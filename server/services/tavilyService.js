import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../../.env") });

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

export async function findLinkedinUrl(
  fullName,
  country = "Israel"
) {

  try {

    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        query:
          `${fullName} Israel LinkedIn site:linkedin.com/in`,

        search_depth: "basic",

        max_results: 10
      },
      {
        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${TAVILY_API_KEY}`
        }
      }
    );

    const results = response.data.results || [];

    const normalizedName =
      fullName
        .toLowerCase()
        .replace(/\s+/g, "-");

    const linkedinResult = results.find((r) => {

      const url =
        r.url?.toLowerCase() || "";

      const title =
        r.title?.toLowerCase() || "";

      const content =
        r.content?.toLowerCase() || "";

      return (

        url.includes("linkedin.com/in/")

        &&

        (
          url.includes(normalizedName)

          ||

          title.includes(
            fullName.toLowerCase()
          )

          ||

          content.includes(
            fullName.toLowerCase()
          )
        )

        &&

        (
          content.includes("israel")

          ||

          content.includes("jerusalem")

          ||

          content.includes("tel aviv")

          ||

          url.includes("il.linkedin.com")
        )
      );
    });

    return linkedinResult?.url || null;

  } catch (error) {

    console.error(
      "Tavily Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}
export async function findLinkedinProfileResult(fullName, country = "Israel") {
  try {
    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        query: `${fullName} Israel LinkedIn site:linkedin.com/in`,
        search_depth: "basic",
        max_results: 10
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TAVILY_API_KEY}`
        }
      }
    );

    const results = response.data.results || [];

    const normalizedName = fullName
      .toLowerCase()
      .replace(/\s+/g, "-");

    const linkedinResult = results.find((r) => {
      const url = r.url?.toLowerCase() || "";
      const title = r.title?.toLowerCase() || "";
      const content = r.content?.toLowerCase() || "";

      return (
        url.includes("linkedin.com/in/") &&
        (
          url.includes(normalizedName) ||
          title.includes(fullName.toLowerCase()) ||
          content.includes(fullName.toLowerCase())
        ) &&
        (
          content.includes("israel") ||
          content.includes("jerusalem") ||
          content.includes("tel aviv") ||
          url.includes("il.linkedin.com")
        )
      );
    });

    return linkedinResult || null;

  } catch (error) {
    console.error(
      "Tavily Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}