import { Grade } from '@/lib/domain/grades/entities'
import { spaggiariFetch } from './client'

export interface LoginRequest {
  uid: string
  pass: string
  ident?: string
}

export interface ParentChoice {
  cid: string
  ident: string
  name: string
  school: string
}

export interface LoginSuccessResponse {
  ident: string
  firstName: string
  lastName: string
  token: string
  release: string
  expire: string
}

export interface LoginChoiceResponse {
  choices: ParentChoice[]
  requestedAction: string
}

export type LoginResponse = LoginSuccessResponse | LoginChoiceResponse

export async function loginToSpaggiari(payload: LoginRequest): Promise<LoginResponse> {
  return spaggiariFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function fetchGrades(token: string, studentId: string): Promise<Grade[]> {
  const data = await spaggiariFetch<{ grades: Grade[] }>(`/students/${studentId}/grades`, { method: 'GET' }, token)
  return data.grades
}
