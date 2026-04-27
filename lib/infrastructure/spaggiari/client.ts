const BASE_URL = 'https://web.spaggiari.eu/rest/v1'

export class SpaggiariApiError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'SpaggiariApiError'
    this.status = status
    this.details = details
  }
}

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
    const raw = await response.text()
    let details: unknown = raw
    let message = `Spaggiari API error (${response.status})`

    try {
      const parsed = JSON.parse(raw) as { message?: string; error?: string; title?: string }
      details = parsed
      message = parsed.message ?? parsed.error ?? parsed.title ?? message
    } catch {
      if (raw) {
        message = raw
      }
    }

    throw new SpaggiariApiError(response.status, message, details)
  }

  return response.json() as Promise<T>
}
