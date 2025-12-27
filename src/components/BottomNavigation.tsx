import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { RootState } from '@/store';
import { UserRole } from '@/types';
import {
  Home,
  Users,
  Calendar,
  Pill,
  FileText,
  Settings,
  Menu,
  Search,
  Zap
} from 'lucide-react';

interface BottomNavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const getRoleNavigation = (role: UserRole): BottomNavItem[] => {
  const baseItems: BottomNavItem[] = [
    {
      name: 'Search',
      path: '#search',
      icon: <Search className="w-5 h-5" />,
    },
    {
      name: 'Quick Actions',
      path: '#quick-actions',
      icon: <Zap className="w-5 h-5" />,
    },
  ];

  switch (role) {
    case 'doctor':
      return [
        {
          name: 'Home',
          path: '/doctor',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: 'Queue',
          path: '/doctor/queue',
          icon: <Users className="w-5 h-5" />,
          badge: 3, // Mock badge for waiting patients
        },
        {
          name: 'Appointments',
          path: '/doctor/appointments',
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          name: 'Prescriptions',
          path: '/doctor/prescriptions',
          icon: <Pill className="w-5 h-5" />,
        },
        ...baseItems,
        {
          name: 'Menu',
          path: '#menu',
          icon: <Menu className="w-5 h-5" />,
        },
      ];

    case 'nurse':
      return [
        {
          name: 'Home',
          path: '/nurse',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: 'Patients',
          path: '/nurse/patients',
          icon: <Users className="w-5 h-5" />,
        },
        {
          name: 'Vitals',
          path: '/nurse/vitals',
          icon: <FileText className="w-5 h-5" />,
        },
        {
          name: 'Medications',
          path: '/nurse/medication-requests',
          icon: <Pill className="w-5 h-5" />,
        },
        ...baseItems,
        {
          name: 'Menu',
          path: '#menu',
          icon: <Menu className="w-5 h-5" />,
        },
      ];

    case 'pharmacist':
      return [
        {
          name: 'Home',
          path: '/pharmacist',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: 'Queue',
          path: '/pharmacist/prescriptions',
          icon: <Pill className="w-5 h-5" />,
          badge: 5, // Mock badge for pending prescriptions
        },
        {
          name: 'Inventory',
          path: '/pharmacist/inventory',
          icon: <FileText className="w-5 h-5" />,
        },
        {
          name: 'Patients',
          path: '/pharmacist/patients',
          icon: <Users className="w-5 h-5" />,
        },
        ...baseItems,
        {
          name: 'Menu',
          path: '#menu',
          icon: <Menu className="w-5 h-5" />,
        },
      ];

    case 'receptionist':
      return [
        {
          name: 'Home',
          path: '/receptionist',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: 'Appointments',
          path: '/receptionist/appointments',
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          name: 'Patients',
          path: '/receptionist/patients',
          icon: <Users className="w-5 h-5" />,
        },
        {
          name: 'Waitlist',
          path: '/receptionist/waitlist',
          icon: <FileText className="w-5 h-5" />,
          badge: 2, // Mock badge for waitlist
        },
        ...baseItems,
        {
          name: 'Menu',
          path: '#menu',
          icon: <Menu className="w-5 h-5" />,
        },
      ];

    case 'lab':
      return [
        {
          name: 'Home',
          path: '/lab',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: 'Orders',
          path: '/lab/orders',
          icon: <FileText className="w-5 h-5" />,
          badge: 7, // Mock badge for pending orders
        },
        {
          name: 'Results',
          path: '/lab/results',
          icon: <Pill className="w-5 h-5" />,
        },
        {
          name: 'Reports',
          path: '/lab/reports',
          icon: <Calendar className="w-5 h-5" />,
        },
        ...baseItems,
        {
          name: 'Menu',
          path: '#menu',
          icon: <Menu className="w-5 h-5" />,
        },
      ];

    case 'admin':
      return [
        {
          name: 'Home',
          path: '/admin',
          icon: <Home className="w-5 h-5" />,
        },
        {
          name: 'Users',
          path: '/admin/users',
          icon: <Users className="w-5 h-5" />,
        },
        {
          name: 'Analytics',
          path: '/admin/analytics',
          icon: <FileText className="w-5 h-5" />,
        },
        {
          name: 'Settings',
          path: '/admin/settings',
          icon: <Settings className="w-5 h-5" />,
        },
        ...baseItems,
        {
          name: 'Menu',
          path: '#menu',
          icon: <Menu className="w-5 h-5" />,
        },
      ];

    default:
      return baseItems;
  }
};

interface BottomNavigationProps {
  onMenuToggle?: () => void;
  onSearchToggle?: () => void;
  onQuickActionsToggle?: () => void;
}

export function BottomNavigation({
  onMenuToggle,
  onSearchToggle,
  onQuickActionsToggle
}: BottomNavigationProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigationItems = user ? getRoleNavigation(user.role) : [];

  // Auto-hide on scroll for better UX
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navigation
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navigation
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Gesture support - swipe up to show, swipe down to hide
  useEffect(() => {
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startY) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      const deltaTime = Date.now() - startTime;

      // Quick swipe gesture (within 300ms and 50px movement)
      if (deltaTime < 300 && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          // Swipe up - show navigation
          setIsVisible(true);
        } else {
          // Swipe down - hide navigation
          setIsVisible(false);
        }
      }

      startY = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleItemClick = (item: BottomNavItem) => {
    if (item.path.startsWith('#')) {
      switch (item.path) {
        case '#menu':
          onMenuToggle?.();
          break;
        case '#search':
          onSearchToggle?.();
          break;
        case '#quick-actions':
          onQuickActionsToggle?.();
          break;
      }
    }
    // Regular navigation is handled by NavLink
  };

  // Don't render on desktop or if no user
  if (!user || window.innerWidth >= 768) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)', // iOS safe area
      }}
    >
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = !item.path.startsWith('#') &&
            location.pathname === item.path ||
            (item.path !== `/${user.role}` && location.pathname.startsWith(item.path));

          const isSpecial = item.path.startsWith('#');

          return (
            <NavLink
              key={item.name}
              to={item.path.startsWith('#') ? '#' : item.path}
              onClick={(e) => {
                if (item.path.startsWith('#')) {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
              className={({ isActive: linkActive }) =>
                `relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1 ${
                  isSpecial || linkActive || isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`
              }
              aria-label={item.name}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-5">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 text-center leading-tight">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Pull indicator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-12 h-1 bg-gray-300 rounded-full opacity-50"></div>
    </div>
  );
}