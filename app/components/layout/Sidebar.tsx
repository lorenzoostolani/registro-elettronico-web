'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/voti', label: 'Voti', icon: <StarIcon /> },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: '220px',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      zIndex: 40,
    }} className="sidebar-desktop">
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', background: 'var(--red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '15px' }}>Registro</span>
      </div>

      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: active ? 600 : 400,
              color: active ? '#fff' : 'var(--text-2)',
              background: active ? 'var(--red)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}>
              <span style={{ width: '18px', height: '18px', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link href="/impostazioni" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          color: pathname.startsWith('/impostazioni') ? 'var(--text)' : 'var(--text-2)',
          fontSize: '13px', padding: '6px 0', textDecoration: 'none',
          fontWeight: pathname.startsWith('/impostazioni') ? 600 : 400,
        }}>
          <SettingsIcon /> Impostazioni
        </Link>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-2)', fontSize: '13px', padding: '6px 0', width: '100%',
        }}>
          <LogoutIcon /> Esci
        </button>
      </div>

      <style>{`.sidebar-desktop { display: flex; } @media (max-width: 768px) { .sidebar-desktop { display: none !important; } }`}</style>
    </aside>
  )
}

function StarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function SettingsIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> }
function LogoutIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
