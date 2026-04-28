import { NextResponse } from 'next/server'
import { fetchGrades } from '@/lib/infrastructure/spaggiari/repository'
import { getServerSession } from '@/lib/utils/session'

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const grades = await fetchGrades(session.token, session.studentId)
    return NextResponse.json({ grades })
  } catch (error) {
    const err = error as Error & { status?: number; details?: unknown };
    console.error('[API Grades] Fetch failed:', err.status, err.message, err.details || err);
    return NextResponse.json({ 
      error: 'Errore recupero voti',
      details: err.message || 'Unknown error'
    }, { status: err.status || 500 })
  }
}
