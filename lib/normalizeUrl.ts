export function normalizeUrl(input: string): string {
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
