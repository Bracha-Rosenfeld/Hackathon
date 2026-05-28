import { enrichDonors } from "./enrichmentService.js";

async function test() {
  const results = await enrichDonors([
    {
      fullName: "Tohar Amar",
      email: "toharamar02@gmail.com",
      country: "Israel"
    }
  ]);

  console.log(JSON.stringify(results, null, 2));
}

test();