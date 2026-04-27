import Link from 'next/link';
import { GraduationCap, Settings } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 pb-20">{children}</main>
      <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-4 shadow-lg">
        <Link href="/dashboard/grades" className="flex flex-col items-center">
          <GraduationCap className="text-blue-600" />
          <span className="text-xs">Voti</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center">
          <Settings className="text-gray-500" />
          <span className="text-xs">Impostazioni</span>
        </Link>
      </nav>
    </div>
  );
}