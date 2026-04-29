'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const isSettings = pathname.startsWith('/impostazioni')

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '52px',
      background: 'rgba(24,24,24,0.96)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 50,
    }}>

      {/* Left: back arrow on settings, logo on other pages */}
      <div style={{ width: '36px', display: 'flex', alignItems: 'center' }}>
        {isSettings ? (
          <button
            onClick={() => router.back()}
            aria-label="Torna indietro"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text)', padding: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          ) : (
          <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="22" fill="#E03030"/>
            <path d="M28 32 Q40 28 50 32 L50 72 Q40 68 28 72 Z" fill="white" opacity="0.95"/>
            <path d="M50 32 Q62 28 72 32 L72 72 Q62 68 50 72 Z" fill="white" opacity="0.75"/>
            <rect x="48.5" y="28" width="3" height="46" rx="1.5" fill="white" opacity="0.5"/>
            <line x1="32" y1="44" x2="46" y2="42" stroke="#E03030" strokeWidth="3.5" strokeLinecap="round" opacity="0.6"/>
            <line x1="32" y1="54" x2="46" y2="52" stroke="#E03030" strokeWidth="3.5" strokeLinecap="round" opacity="0.6"/>
            <line x1="32" y1="64" x2="46" y2="62" stroke="#E03030" strokeWidth="3.5" strokeLinecap="round" opacity="0.6"/>
          </svg>
        )}
      </div>

      {/* Center: page title */}
      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>
        {isSettings ? 'Impostazioni' : 'Registro'}
      </span>

      {/* Right: settings icon (hidden on settings page) */}
      <div style={{ width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {!isSettings ? (
          <Link
            href="/impostazioni"
            aria-label="Impostazioni"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px',
              borderRadius: '10px',
              color: 'var(--text-2)',
              textDecoration: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </Link>
        ) : null}
      </div>
    </header>
  )
}
