'use client'

import Link from 'next/link'
import { Star, SlidersHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const items = [
  { href: '/voti', label: 'Voti', icon: Star },
  { href: '/impostazioni', label: 'Impostazioni', icon: SlidersHorizontal }
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden w-60 shrink-0 border-r border-borderToken bg-surface p-4 md:block">
      <p className="mb-4 text-lg font-bold">Registro Voti</p>
      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx('flex items-center gap-2 rounded-lg px-3 py-2 text-sm', active ? 'bg-surface-2 font-semibold' : 'hover:bg-surface-2')}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
