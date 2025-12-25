import { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumb?: string[];
}

export function AppLayout({ children, title, breadcrumb }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </aside>

      {/* Main Content Area with left margin to account for fixed sidebar */}
      <div className="ml-[280px] flex-1 flex flex-col min-h-screen">
        <TopBar title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
