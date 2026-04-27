import { NextRequest, NextResponse } from 'next/server'
import { extractStudentId } from '@/lib/domain/grades/entities'
import { loginToSpaggiari } from '@/lib/infrastructure/spaggiari/repository'
import { apiError } from '@/lib/utils/api-response'

function isSpaggiariError(error: unknown): error is { status: number; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status?: unknown }).status === 'number' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await loginToSpaggiari({ uid: body.uid, pass: body.pass, ident: body.ident })

    if ('choices' in response) {
      return NextResponse.json(response)
    }

    const studentId = extractStudentId(response.ident)
    const res = NextResponse.json({ ok: true, profile: { firstName: response.firstName, lastName: response.lastName } })
    const secure = process.env.NODE_ENV === 'production'
    const expires = new Date(Date.now() + 4 * 60 * 60 * 1000)

    res.cookies.set('rv_token', response.token, { httpOnly: true, sameSite: 'lax', secure, expires, path: '/' })
    res.cookies.set('rv_student_id', studentId, { httpOnly: true, sameSite: 'lax', secure, expires, path: '/' })
    res.cookies.set('rv_ident', response.ident, { httpOnly: true, sameSite: 'lax', secure, expires, path: '/' })
    res.cookies.set('rv_profile', JSON.stringify({ firstName: response.firstName, lastName: response.lastName }), {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      expires,
      path: '/'
    })

    return res
  } catch (error) {
    if (isSpaggiariError(error)) {
      if (error.status === 401) {
        return apiError('Credenziali non valide', 401)
      }

      return apiError(`Errore login Spaggiari (${error.status}): ${error.message}`, error.status)
    }

    return apiError('Errore imprevisto durante il login', 500)
  }
}
