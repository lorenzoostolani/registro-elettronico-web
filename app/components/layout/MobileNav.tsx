'use client'

import Link from 'next/link'
import { Star, SlidersHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const items = [
  { href: '/voti', label: 'Voti', icon: Star },
  { href: '/impostazioni', label: 'Impostazioni', icon: SlidersHorizontal }
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-2 border-t border-borderToken bg-surface md:hidden">
      {items.map((item) => {
        const Icon = item.icon
        const active = pathname.startsWith(item.href)
        return (
          <Link key={item.href} href={item.href} className={clsx('flex flex-col items-center py-2 text-xs', active ? 'text-blueToken' : 'text-text2')}>
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
