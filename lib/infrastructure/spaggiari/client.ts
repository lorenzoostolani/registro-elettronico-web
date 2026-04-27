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

export async function spaggiariFetch<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const { request } = await import('undici')

  const headers: Record<string, string> = {
  'content-type': 'application/json',
  'user-agent': 'CVVS/std/4.2.3',
  'z-dev-apikey': 'Tg1NWEwNGIgIC0K',
  'z-if-none-match': '',
  }
  if (token) headers['z-auth-token'] = token

  const { statusCode, body } = await request(`${BASE_URL}${path}`, {
    method: (init?.method as any) ?? 'GET',
    headers,
    body: init?.body as string | undefined,
  })

  const raw = await body.text()

  if (statusCode < 200 || statusCode >= 300) {
    let details: unknown = raw
    let message = `Errore login Spaggiari (${statusCode})`
    try {
      const parsed = JSON.parse(raw) as { message?: string; error?: string; title?: string }
      details = parsed
      message = parsed.message ?? parsed.error ?? parsed.title ?? message
    } catch {
      if (raw) message = raw
    }
    throw new SpaggiariApiError(statusCode, message, details)
  }

  return JSON.parse(raw) as T
}