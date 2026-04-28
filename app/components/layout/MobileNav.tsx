'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const items = [
  { href: '/voti', label: 'Voti', icon: <HomeIcon /> },
  { href: '/impostazioni', label: 'Impostazioni', icon: <SettingsIcon /> },
]

export function MobileNav() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)')
    const sync = () => setIsMobile(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  if (!isMobile) return null

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: '64px',
      background: 'rgba(36, 36, 36, 0.96)',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
      contain: 'layout paint style',
    }}>
      {items.map(item => {
        const active = pathname.startsWith(item.href)
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '10px 4px',
            color: active ? 'var(--red)' : 'var(--text-3)',
            textDecoration: 'none',
          }}>
            <span style={{ width: '22px', height: '22px' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: active ? 600 : 400 }}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function HomeIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function SettingsIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> }
