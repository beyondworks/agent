export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
}

export async function search(
  query: string,
  limit = 10
): Promise<BraveSearchResult[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) throw new Error('BRAVE_SEARCH_API_KEY is required');

  const params = new URLSearchParams({
    q: query,
    count: String(Math.min(limit, 20)),
    search_lang: 'ko',
    country: 'KR',
  });

  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?${params}`,
    {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Brave Search API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const results: BraveSearchResult[] = (data.web?.results ?? []).map(
    (r: { title: string; url: string; description?: string }) => ({
      title: r.title ?? '',
      url: r.url ?? '',
      description: r.description ?? '',
    })
  );

  return results;
}
