import { cookies } from 'next/headers'

export interface SessionData {
  token: string
  studentId: string
  ident: string
  profile?: { firstName: string; lastName: string }
}

export async function getServerSession(): Promise<SessionData | null> {
  const store = await cookies()
  const token = store.get('rv_token')?.value
  const studentId = store.get('rv_student_id')?.value
  const ident = store.get('rv_ident')?.value
  const profileRaw = store.get('rv_profile')?.value

  if (!token || !studentId || !ident) return null

  return {
    token,
    studentId,
    ident,
    profile: profileRaw ? JSON.parse(profileRaw) : undefined
  }
}
