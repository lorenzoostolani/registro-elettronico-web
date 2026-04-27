import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  for (const key of ['rv_token', 'rv_student_id', 'rv_ident', 'rv_profile']) {
    res.cookies.set(key, '', { expires: new Date(0), path: '/' })
  }
  return res
}
