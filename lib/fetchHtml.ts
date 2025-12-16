export async function fetchHtml(url: string): Promise<{
  html: string;
  redirected: boolean;
}> {
  const response = await fetch(url, {
    redirect: "follow",
  });

  const html = await response.text();

  return {
    html,
    redirected: response.redirected,
  };
}
