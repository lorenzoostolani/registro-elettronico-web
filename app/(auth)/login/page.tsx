'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

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
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [parentChoices, setParentChoices] = useState<ParentChoice[] | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, pass }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Credenziali non valide'); return }
      if (data.type === 'parent_selection') { setParentChoices(data.choices); return }
      router.push('/voti')
    } catch { setError('Errore di rete') }
    finally { setLoading(false) }
  }

  async function handleParentSelect(ident: string) {
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, pass, ident }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Errore selezione'); return }
      router.push('/voti')
    } catch { setError('Errore di rete') }
    finally { setLoading(false) }
  }

  if (parentChoices) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>Seleziona profilo</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
            Scegli il profilo con cui accedere
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {parentChoices.map(c => (
              <button key={c.ident} onClick={() => handleParentSelect(c.ident)} disabled={loading} style={s.profileBtn}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '2px' }}>{c.school}</div>
              </button>
            ))}
          </div>
          {error && <p style={s.error}>{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--red)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        </div>
        <h1 style={s.title}>Registro Elettronico</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '28px', textAlign: 'center' }}>
          Accedi con le credenziali Classeviva
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={s.field}>
            <label style={s.label}>Codice utente</label>
            <input type="text" value={uid} onChange={e => setUid(e.target.value)}
              placeholder="es. S0000000X" autoComplete="username" autoFocus required style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={{ ...s.input, paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-2)', display: 'flex', alignItems: 'center', padding: '2px',
                }}
                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Accesso...
              </span>
            ) : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg)' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '40px 32px', width: '100%', maxWidth: '380px' },
  title: { textAlign: 'center', marginBottom: '6px', fontSize: '1.3rem', fontWeight: 700 },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 500, color: 'var(--text-2)' },
  input: { padding: '11px 14px', border: '1px solid var(--border-strong)', borderRadius: '10px', fontSize: '15px', background: 'var(--surface-2)', color: 'var(--text)', outline: 'none', width: '100%' },
  btn: { padding: '12px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' },
  error: { color: 'var(--red)', fontSize: '13px', background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: '8px', padding: '8px 12px', margin: 0 },
  profileBtn: { padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', width: '100%' },
}
