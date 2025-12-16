export type RiskLevel = "Low" | "Medium" | "High";

export type RiskResult = {
  score: number;
  level: RiskLevel;
  reasons: string[];
};

export function calculateRisk(input: {
  https: boolean;
  redirected: boolean;
  domainAgeDays: number | null;
  brandMismatch: boolean;
}): RiskResult {
  let score = 0;
  const reasons: string[] = [];

  if (!input.https) {
    score += 30;
    reasons.push("Site does not use HTTPS");
  }

  if (input.redirected) {
    score += 10;
    reasons.push("Site uses redirects");
  }

  if (input.domainAgeDays !== null && input.domainAgeDays < 180) {
    score += 25;
    reasons.push("Domain is very new");
  }

  if (input.brandMismatch) {
    score += 20;
    reasons.push("Possible brand and domain mismatch");
  }

  let level: RiskLevel = "Low";
  if (score >= 60) level = "High";
  else if (score >= 30) level = "Medium";

  return { score, level, reasons };
}
