import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex items-center space-x-2 text-sm text-neutral-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = item.path && !isLast;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 text-neutral-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {isClickable ? (
                <button
                  onClick={() => navigate(item.path!)}
                  className="flex items-center hover:text-primary-600 transition-colors"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ) : (
                <span
                  className={`flex items-center ${isLast ? 'text-neutral-900 font-medium' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}