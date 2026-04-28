const BASE_URL = 'https://spaggiari-proxy.lorenzoostolani.workers.dev'

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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers['Z-Auth-Token'] = token

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  })

  const raw = await response.text()

  if (!response.ok) {
    let details: unknown = raw
    let message = `Errore Spaggiari (${response.status})`
    try {
      const parsed = JSON.parse(raw) as { message?: string; error?: string; title?: string }
      details = parsed
      message = parsed.message ?? parsed.error ?? parsed.title ?? message
    } catch {
      if (raw) message = raw
    }
    throw new SpaggiariApiError(response.status, message, details)
  }

  return JSON.parse(raw) as T
}