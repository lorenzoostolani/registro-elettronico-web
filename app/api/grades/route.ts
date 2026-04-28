import { NextResponse } from 'next/server'
import { fetchGrades } from '@/lib/infrastructure/spaggiari/repository'
import { getServerSession } from '@/lib/utils/session'

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const grades = await fetchGrades(session.token, session.studentId)
    return NextResponse.json({ grades })
  } catch (error: any) {
    console.error('[API Grades] Fetch failed:', error.status, error.message, error.details || error);
    return NextResponse.json({ 
      error: 'Errore recupero voti',
      details: error.message || 'Unknown error'
    }, { status: error.status || 500 })
  }
}
