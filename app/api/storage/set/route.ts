import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/utils/session'
import { getStorageByStudentId, PersistedStorage, setStorageByStudentId } from '@/lib/utils/storage'

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = (await request.json()) as PersistedStorage
    const existing = (await getStorageByStudentId(session.studentId)) ?? {}

    const next: PersistedStorage = {
      ...existing,
      ...(body.settings !== undefined ? { settings: body.settings } : {}),
      ...(body.localGrades !== undefined ? { localGrades: body.localGrades } : {}),
    }

    await setStorageByStudentId(session.studentId, next)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API Storage/Set] Failed:', error)
    return NextResponse.json({ error: 'Errore salvataggio storage' }, { status: 500 })
  }
}
