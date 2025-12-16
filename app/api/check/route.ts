import { NextResponse } from "next/server";

type RiskLevel = "Low" | "Medium" | "High";

type CheckResult = {
  score: number;
  level: RiskLevel;
  reasons: string[];
};

function normalizeUrl(input: string): string {
  let url = input.trim();

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    throw new Error("Invalid URL");
  }
}

function calculateRisk(checks: {
  https: boolean;
  redirects: boolean;
  domainAgeDays: number | null;
  brandMismatch: boolean;
}): CheckResult {
  let score = 0;
  const reasons: string[] = [];

  if (!checks.https) {
    score += 30;
    reasons.push("Site does not use HTTPS");
  }

  if (checks.redirects) {
    score += 10;
    reasons.push("Site uses redirects");
  }

  if (checks.domainAgeDays !== null && checks.domainAgeDays < 180) {
    score += 25;
    reasons.push("Domain is very new");
  }

  if (checks.brandMismatch) {
    score += 20;
    reasons.push("Possible brand/domain mismatch");
  }

  let level: RiskLevel = "Low";
  if (score >= 60) level = "High";
  else if (score >= 30) level = "Medium";

  return { score, level, reasons };
}

async function getDomainAgeDays(domain: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.whois.vu/?q=${domain}`);
    const text = await res.text();

    const match = text.match(/Creation Date:\s*(.+)/i);
    if (!match) return null;

    const created = new Date(match[1]);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const target = normalizeUrl(body.url);

    const response = await fetch(target, { redirect: "follow" });
    const html = await response.text();

    const https = target.startsWith("https://");
    const redirects = response.redirected;

    const domain = new URL(target).hostname;
    const domainAgeDays = await getDomainAgeDays(domain);

    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].toLowerCase() : "";

    const brandMismatch =
      title !== "" && !domain.toLowerCase().includes(title.split(" ")[0]);

    const result = calculateRisk({
      https,
      redirects,
      domainAgeDays,
      brandMismatch,
    });

    return NextResponse.json({
      url: target,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to check site" },
      { status: 400 }
    );
  }
}
