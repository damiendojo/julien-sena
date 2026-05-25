/**
 * Strapi Fetch Wrapper
 * Handles authentication and base URL automatically.
 */
interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
}

export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
}: Props): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1);
  }

  const baseUrl = import.meta.env.PUBLIC_STRAPI_URL || process.env.PUBLIC_STRAPI_URL || 'https://optimistic-warmth-6e7694b576.strapiapp.com';
  const token = import.meta.env.STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;

  const url = new URL(`${baseUrl}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API request failed with status ${res.status}: ${errorBody}`);
  }

  const data = await res.json();

  if (wrappedByKey) {
    return data[wrappedByKey] as T;
  }

  return data as T;
}
