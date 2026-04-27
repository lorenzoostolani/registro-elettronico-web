import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/utils/session'

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({
    studentId: session.studentId,
    ident: session.ident,
    firstName: session.profile?.firstName,
    lastName: session.profile?.lastName
  })
}
