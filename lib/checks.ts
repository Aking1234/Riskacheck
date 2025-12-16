export function detectBrandMismatch(
  domain: string,
  html: string
): boolean {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch) return false;

  const title = titleMatch[1].toLowerCase();
  const mainWord = title.split(" ")[0];

  return !domain.toLowerCase().includes(mainWord);
}

export function isHttps(url: string): boolean {
  return url.startsWith("https://");
}
