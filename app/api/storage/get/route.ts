import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/utils/session'
import { getStorageByStudentId } from '@/lib/utils/storage'

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await getStorageByStudentId(session.studentId)

    return NextResponse.json({
      settings: data?.settings ?? null,
      localGrades: data?.localGrades ?? null,
    })
  } catch (error) {
    console.error('[API Storage/Get] Failed:', error)
    return NextResponse.json({ error: 'Errore recupero storage' }, { status: 500 })
  }
}
