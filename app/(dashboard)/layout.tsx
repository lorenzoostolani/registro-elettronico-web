import { MobileNav } from '@/app/components/layout/MobileNav'
import { Sidebar } from '@/app/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="w-full p-4 pb-20 md:p-8 md:pb-8">{children}</main>
      <MobileNav />
    </div>
  )
}
