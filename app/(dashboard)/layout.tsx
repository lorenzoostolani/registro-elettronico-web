import { MobileNav } from '@/app/components/layout/MobileNav'
import { Sidebar } from '@/app/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar: visible only on md+ via CSS inside the component */}
      <Sidebar />

      {/*
        Main content:
        - On desktop (md+): left margin 220px to clear the sidebar, no bottom padding for mobile nav
        - On mobile: no left margin, bottom padding to clear the bottom nav
      */}
      <main className="dashboard-main">
        {children}
      </main>

      {/* Bottom nav: visible only on mobile via CSS inside the component */}
      <MobileNav />

      <style>{`
        .dashboard-main {
          flex: 1;
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
          padding: 24px 16px 90px; /* bottom clears mobile nav */
          -webkit-overflow-scrolling: touch;
        }
        @media (min-width: 769px) { /* matches sidebar hide breakpoint */
          .dashboard-main {
            margin-left: 220px;
            padding: 32px;
          }
        }
      `}</style>
    </div>
  )
}
