const BASE_URL = 'https://web.spaggiari.eu/rest/v1'

function baseHeaders(token?: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'User-Agent': 'zorro/1.0',
    'Z-Dev-Apikey': '+zorro+',
    'Z-If-None-Match': '',
    ...(token ? { 'Z-Auth-Token': token } : {})
  }
}

export async function spaggiariFetch<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...baseHeaders(token),
      ...(init?.headers ?? {})
    },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Spaggiari API error: ${response.status}`)
  }

  return response.json() as Promise<T>
}
