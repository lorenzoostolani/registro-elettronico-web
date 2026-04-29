import { TopBar } from '@/app/components/layout/TopBar'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <TopBar />
      <Analytics />
      <SpeedInsights />

      <main style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '68px 16px 40px', /* 68px = 52px topbar + 16px gap */
      }}>
        {children}
      </main>
    </div>
  )
}
