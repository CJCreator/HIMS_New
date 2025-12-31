import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Sidebar } from './Sidebar';
import { NotificationCenter } from './NotificationCenter';
import { RealTimeUpdates } from './RealtimeUpdates';
import { Breadcrumb } from './Breadcrumb';
import { SkipNavLink } from './SkipNavLink';
import { Menu, X } from 'lucide-react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <SkipNavLink />
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-lg font-semibold text-gray-900 truncate">AroCord HIMS</h1>
          <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
            <NotificationCenter />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          isMobile 
            ? `fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-out w-sidebar`
            : 'relative'
        }`}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-200"
            onClick={() => setSidebarOpen(false)}
            onTouchStart={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Desktop Header */}
          {!isMobile && (
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationCenter />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page Content */}
          <main id="main-content" className={`${
            isMobile 
              ? 'p-3 pt-4' 
              : 'p-6'
          } max-w-full overflow-x-auto min-h-screen`}>
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>

      <RealTimeUpdates userRole={user.role as any} />
    </div>
  );
};