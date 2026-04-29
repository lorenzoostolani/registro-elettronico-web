import { request } from 'undici'

export interface PersistedStorage {
  settings?: unknown
  localGrades?: unknown
}

interface UpstashResult<T> {
  result: T
}

function getConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new Error('Upstash Redis environment variables are missing')
  }

  return { url: url.replace(/\/$/, ''), token }
}

async function upstashCommand<T>(...command: unknown[]): Promise<T> {
  const { url, token } = getConfig()
  const res = await request(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })

  if (res.statusCode >= 400) {
    throw new Error(`Upstash request failed with ${res.statusCode}`)
  }

  const payload = (await res.body.json()) as UpstashResult<T> & { error?: string }
  if (payload.error) {
    throw new Error(payload.error)
  }

  return payload.result
}

export async function getStorageByStudentId(studentId: string): Promise<PersistedStorage | null> {
  const raw = await upstashCommand<string | null>('GET', getStorageKey(studentId))
  return raw ? (JSON.parse(raw) as PersistedStorage) : null
}

export async function setStorageByStudentId(studentId: string, value: PersistedStorage) {
  await upstashCommand('SET', getStorageKey(studentId), JSON.stringify(value))
}

export function getStorageKey(studentId: string) {
  return `rv_storage:${studentId}`
}
