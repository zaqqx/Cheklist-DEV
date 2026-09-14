/**
 * Extracts a human-friendly site name from a URL: prefers the page's <title>,
 * falls back to the bare domain name if the page can't be fetched in time.
 */
export async function extractSiteName(siteUrl: string): Promise<string> {
  const hostname = new URL(siteUrl).hostname.replace(/^www\./, "");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(siteUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ChecklistBot/1.0)" },
      redirect: "follow",
    });

    if (!response.ok) {
      return hostname;
    }

    const html = await response.text();
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = match?.[1]?.trim();

    return title && title.length > 0 ? title : hostname;
  } catch {
    return hostname;
  } finally {
    clearTimeout(timeout);
  }
}
