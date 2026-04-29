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
      paddingTop: 'env(safe-area-inset-top)',
    }} className="topbar-mobile">

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
          <div style={{
            width: '28px', height: '28px',
            background: 'var(--red)', borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        )}
      </div>

      {/* Center: page title */}
      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>
        {isSettings ? 'Impostazioni' : 'Registro'}
      </span>

      {/* Right: settings icon (hidden on settings page) */}
      <div style={{ width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {!isSettings && (
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
        )}
      </div>

      <style>{`
        .topbar-mobile { display: none; }
        @media (max-width: 768px) { .topbar-mobile { display: flex; } }
      `}</style>
    </header>
  )
}
