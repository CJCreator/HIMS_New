import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface TopBarProps {
  title: string;
  breadcrumb?: string[];
}

export function TopBar({ title, breadcrumb }: TopBarProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
      <div>
        {breadcrumb && (
          <nav className="text-body-sm text-neutral-500 mb-1">
            {breadcrumb.join(' / ')}
          </nav>
        )}
        <h1 className="text-h3 text-neutral-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button 
          className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          🔔
        </button>
        <button 
          className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
            <span className="text-neutral-600 text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}