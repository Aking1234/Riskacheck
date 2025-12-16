export async function getDomainAgeDays(
  domain: string
): Promise<number | null> {
  try {
    const response = await fetch(`https://api.whois.vu/?q=${domain}`);
    const text = await response.text();

    const match = text.match(/Creation Date:\s*(.+)/i);
    if (!match) return null;

    const createdDate = new Date(match[1]);
    const now = new Date();

    const diffMs = now.getTime() - createdDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}
