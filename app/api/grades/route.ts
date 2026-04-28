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

    if (err.status === 401 || err.status === 403) {
      const res = NextResponse.json({
        error: 'Sessione scaduta, effettua di nuovo il login',
        forceLogout: true,
      }, { status: 401 })

      for (const key of ['rv_token', 'rv_student_id', 'rv_ident', 'rv_profile']) {
        res.cookies.set(key, '', { expires: new Date(0), path: '/' })
      }

      return res
    }

    return NextResponse.json({ 
      error: 'Errore recupero voti',
      details: err.message || 'Unknown error'
    }, { status: err.status || 500 })
  }
}
