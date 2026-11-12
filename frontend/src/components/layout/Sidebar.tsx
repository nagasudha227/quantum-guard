import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Layers,
  ShieldCheck,
  ArrowLeftRight,
  FlaskConical,
  BarChart2,
  FileText,
  Settings,
  Shield
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Inventory', path: '/inventory', icon: Layers },
  { name: 'Assessment', path: '/assessment', icon: ShieldCheck },
  { name: 'Migration', path: '/migration', icon: ArrowLeftRight },
  { name: 'Lab', path: '/lab', icon: FlaskConical },
  { name: 'Benchmark', path: '/benchmark', icon: BarChart2 },
  { name: 'Reports', path: '/reports', icon: FileText },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-60 h-screen bg-[#0C0F16] border-r border-[#292F3B]/60 flex flex-col justify-between select-none shrink-0 text-sm">
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 gap-3">
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6 text-white stroke-[2]" />
          </div>
          <span className="font-semibold text-white tracking-tight text-[15px]">
            Quantum Guard
          </span>
        </div>

        {/* Navigation List */}
        <nav className="px-3.5 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#252E46] text-white shadow-sm'
                    : 'text-[#969DAB] hover:text-[#E8EAF0] hover:bg-[#151A26]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 stroke-[1.8] ${
                    active ? 'text-[#8290C9]' : 'text-[#8499B8]'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings Link */}
      <div className="p-3.5 pb-6">
        <Link
          to="/settings"
          className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
            isCurrent('/settings')
              ? 'bg-[#252E46] text-white'
              : 'text-[#969DAB] hover:text-[#E8EAF0] hover:bg-[#151A26]'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0 text-[#8499B8] stroke-[1.8]" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};
