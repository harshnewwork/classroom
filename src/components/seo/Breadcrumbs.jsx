import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Visual breadcrumb navigation for all secondary pages.
 *
 * @param {Array<{name: string, path?: string}>} items - Array of breadcrumb crumbs after Home
 */
export function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-7xl mx-auto px-6 lg:px-10 py-3.5 text-xs font-mono tracking-wide text-[#7A6A50] flex items-center gap-2 overflow-x-auto"
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#C9A96B] transition-colors whitespace-nowrap text-[#7A6A50]"
      >
        <Home size={12} className="text-[#C9A96B]" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.name} className="flex items-center gap-2 whitespace-nowrap">
            <ChevronRight size={11} className="text-[#DDD0B8]" />
            {isLast || !item.path ? (
              <span className="text-[#C9A96B] font-semibold" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-[#C9A96B] transition-colors text-[#7A6A50]"
              >
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

