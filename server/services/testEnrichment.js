import { enrichDonors } from "./enrichmentService.js";
import { buildDonorFeatures } from "./donorFeatureService.js";

async function test() {
  const results = await enrichDonors([
    {
      fullName: "Tohar Amar",
      email: "toharamar02@gmail.com",
      idNumber: "123456789",
      country: "Israel"
    }
  ]);

  const features = results.map((result) =>
    buildDonorFeatures(result)
  );

  console.log(JSON.stringify(features, null, 2));
}

test();