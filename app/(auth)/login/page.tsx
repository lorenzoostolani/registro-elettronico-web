'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/app/components/ui/Card'
import { ErrorState } from '@/app/components/ui/ErrorState'

interface ParentChoice {
  cid: string
  ident: string
  name: string
  school: string
}

export default function LoginPage() {
  const router = useRouter()
  const [uid, setUid] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [choices, setChoices] = useState<ParentChoice[]>([])
  const [loading, setLoading] = useState(false)

  const login = async (ident?: string) => {
    setLoading(true)
    setError(null)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, pass, ident })
    })
    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      setError(data.error ?? 'Errore login')
      return
    }

    if (data.choices) {
      setChoices(data.choices)
      return
    }

    router.replace('/voti')
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center p-4">
      <Card className="w-full">
        <h1 className="mb-1 text-2xl font-bold">Accedi</h1>
        <p className="mb-4 text-sm text-text2">Inserisci credenziali Classeviva</p>
        {error ? <ErrorState message={error} /> : null}

        <div className="mt-4 space-y-3">
          <input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="S0000000X" className="w-full rounded-lg border border-borderToken px-3 py-2" />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-borderToken px-3 py-2"
          />
          <button onClick={() => login()} disabled={loading} className="w-full rounded-lg bg-blueToken px-4 py-2 font-semibold text-white disabled:opacity-50">
            {loading ? 'Attendi...' : 'Login'}
          </button>
        </div>

        {choices.length > 0 ? (
          <div className="mt-5 space-y-2">
            <p className="text-sm font-semibold">Seleziona studente</p>
            {choices.map((choice) => (
              <button key={choice.cid} onClick={() => login(choice.ident)} className="w-full rounded-lg border border-borderToken p-2 text-left hover:bg-surface-2">
                <p className="font-medium">{choice.name}</p>
                <p className="text-xs text-text2">{choice.school}</p>
              </button>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  )
}
