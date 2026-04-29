import { Sidebar } from '@/app/components/layout/Sidebar'
import { TopBar } from '@/app/components/layout/TopBar'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar: desktop only */}
      <Sidebar />
      {/* TopBar: mobile only */}
      <TopBar />
      <Analytics />
      <SpeedInsights />

      <main className="dashboard-main">
        {children}
      </main>

      <style>{`
        .dashboard-main {
          flex: 1;
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
          padding: 72px 16px 32px; /* top clears TopBar on mobile */
          -webkit-overflow-scrolling: touch;
        }
        @media (min-width: 769px) {
          .dashboard-main {
            margin-left: 220px;
            padding: 32px;
          }
        }
      `}</style>
    </div>
  )
}
