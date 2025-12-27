import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, MoreHorizontal, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { GlobalSearch } from './GlobalSearch';

interface BreadcrumbItem {
  path: string;
  label: string;
  href: string;
  isActive: boolean;
  children?: BreadcrumbItem[];
}

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    children?: { [key: string]: string };
    searchable?: boolean;
  };
}

const breadcrumbConfig: BreadcrumbConfig = {
  admin: {
    label: 'Administration',
    children: {
      users: 'User Management',
      beds: 'Bed Management',
      analytics: 'Analytics Dashboard',
      'appointment-analytics': 'Appointment Analytics',
      demographics: 'Patient Demographics',
      reminders: 'System Reminders',
      feedback: 'User Feedback',
      'api-docs': 'API Documentation',
      settings: 'System Settings',
    },
  },
  doctor: {
    label: 'Doctor Portal',
    children: {
      dashboard: 'Dashboard',
      queue: 'Patient Queue',
      consultation: 'Consultation',
      appointments: 'Appointments',
      prescriptions: 'Prescriptions',
      performance: 'Performance',
      profile: 'Profile',
    },
  },
  nurse: {
    label: 'Nursing Station',
    children: {
      dashboard: 'Dashboard',
      patients: 'Patient Care',
      vitals: 'Vital Signs',
      medications: 'Medications',
      reports: 'Reports',
    },
  },
  pharmacist: {
    label: 'Pharmacy',
    children: {
      dashboard: 'Dashboard',
      prescriptions: 'Prescriptions',
      inventory: 'Inventory',
      orders: 'Orders',
      reports: 'Reports',
    },
  },
  receptionist: {
    label: 'Reception',
    children: {
      dashboard: 'Dashboard',
      patients: 'Patient Registration',
      appointments: 'Appointment Booking',
      billing: 'Billing',
      reports: 'Reports',
    },
  },
  lab: {
    label: 'Laboratory',
    children: {
      dashboard: 'Dashboard',
      orders: 'Test Orders',
      results: 'Results',
      equipment: 'Equipment',
      reports: 'Reports',
    },
  },
  patients: {
    label: 'Patient Portal',
    searchable: true,
  },
};

export function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const paths = location.pathname.split('/').filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [];
  let currentPath = '';

  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    const isLast = index === paths.length - 1;
    const config = breadcrumbConfig[path];

    if (config) {
      const item: BreadcrumbItem = {
        path,
        label: config.label,
        href: currentPath,
        isActive: isLast,
      };

      // Add children if available and not the last item
      if (config.children && !isLast) {
        const nextPath = paths[index + 1];
        if (nextPath && config.children[nextPath]) {
          item.children = Object.entries(config.children).map(([key, label]) => ({
            path: key,
            label,
            href: `${currentPath}/${key}`,
            isActive: key === nextPath,
          }));
        }
      }

      breadcrumbItems.push(item);
    } else {
      // Fallback for unmapped paths
      breadcrumbItems.push({
        path,
        label: path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' '),
        href: currentPath,
        isActive: isLast,
      });
    }
  });

  const handleSearchToggle = () => {
    setShowGlobalSearch(!showGlobalSearch);
  };

  const handleBreadcrumbClick = (href: string, hasChildren: boolean) => {
    if (!hasChildren) {
      navigate(href);
    }
  };

  return (
    <nav
      className="flex items-center justify-between gap-4 px-4 py-3 bg-white border-b border-neutral-200"
      aria-label="Breadcrumb navigation"
    >
      <div className="flex items-center gap-2 text-sm overflow-x-auto">
        {/* Home link */}
        <Link
          to="/"
          className="flex items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors p-1 rounded hover:bg-neutral-50"
          aria-label="Go to home"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* Breadcrumb items */}
        {breadcrumbItems.map((item, index) => (
          <div key={item.path} className="flex items-center gap-2 flex-shrink-0">
            <ChevronRight className="w-4 h-4 text-neutral-400" />

            {item.children && item.children.length > 0 ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === item.path ? null : item.path)}
                  className="flex items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors p-1 rounded hover:bg-neutral-50"
                  aria-expanded={dropdownOpen === item.path}
                  aria-haspopup="menu"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </button>

                {dropdownOpen === item.path && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg z-50 min-w-48">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.href}
                        className={`block px-3 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                          child.isActive ? 'text-primary-600 bg-primary-50' : 'text-neutral-700'
                        }`}
                        onClick={() => setDropdownOpen(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleBreadcrumbClick(item.href, !!item.children)}
                className={`p-1 rounded transition-colors ${
                  item.isActive
                    ? 'text-primary-600 bg-primary-50 font-medium'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
                disabled={item.isActive}
              >
                {item.label}
              </button>
            )}
          </div>
        ))}

        {/* Collapsed items indicator for mobile */}
        {breadcrumbItems.length > 3 && (
          <div className="flex items-center gap-2 sm:hidden">
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <MoreHorizontal className="w-4 h-4 text-neutral-400" />
          </div>
        )}
      </div>

      {/* Search functionality */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleSearchToggle}
          className={`p-2 rounded-md transition-colors ${
            showGlobalSearch
              ? 'bg-primary-100 text-primary-600'
              : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
          }`}
          aria-label="Open global search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
      />
    </nav>
  );
}
