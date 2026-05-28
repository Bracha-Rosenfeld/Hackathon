export function normalizeTavilyLinkedinResult(result, fullName) {
  if (!result) return null;

  const text = `${result.title || ""}\n${result.content || ""}`;

  const followersMatch = text.match(/(\d+)\s+followers/i);

  const connectionsMatch = text.match(/(\d+)\s+connections/i);

  return {
    source: "tavily",

    fullName,

    linkedinUrl: result.url || null,

    rawTitle: result.title || null,

    rawContent: result.content || null,

    title: extractTitle(text),

    company: extractCompany(text),

    education: extractEducation(text),

    city: extractCity(text),

    country: text.toLowerCase().includes("israel")
      ? "Israel"
      : null,

    followers: followersMatch
      ? Number(followersMatch[1])
      : null,

    connections: connectionsMatch
      ? Number(connectionsMatch[1])
      : null,

    signals: {
      isStudent: /student|סטודנט/i.test(text),

      isComputerScience: /computer science|מדעי המחשב/i.test(text),

      isDataRole: /data analyst|data|analytics/i.test(text),

      isTechRelated: /software|engineer|developer|computer science|data/i.test(text),

      isPublicSector: /israel police|משטרת ישראל|government/i.test(text)
    }
  };
}

function extractTitle(text) {
  const titlePatterns = [
    /Student Data Analyst/i,
    /Data Analyst/i,
    /Software Engineer/i,
    /Product Manager/i,
    /CEO/i,
    /Founder/i
  ];

  const found = titlePatterns.find((pattern) =>
    pattern.test(text)
  );

  return found
    ? text.match(found)?.[0]
    : null;
}

function extractCompany(text) {
  if (/Israel Police|משטרת ישראל/i.test(text)) {
    return "Israel Police";
  }

  return null;
}

function extractEducation(text) {
  if (/Computer Science student at Lev Academic Center/i.test(text)) {
    return "Computer Science student at Lev Academic Center";
  }

  if (/Computer Science student/i.test(text)) {
    return "Computer Science student";
  }

  return null;
}

function extractCity(text) {
  if (/Jerusalem|ירושלים/i.test(text)) {
    return "Jerusalem";
  }

  if (/Tel Aviv|תל אביב/i.test(text)) {
    return "Tel Aviv";
  }

  return null;
}