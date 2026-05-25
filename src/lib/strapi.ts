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

  const url = new URL(`${import.meta.env.PUBLIC_STRAPI_URL}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${import.meta.env.STRAPI_API_TOKEN}`,
    },
  });

  const data = await res.json();

  if (wrappedByKey) {
    return data[wrappedByKey] as T;
  }

  return data as T;
}
