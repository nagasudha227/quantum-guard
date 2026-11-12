import React, { useState, useEffect } from 'react';
import { Bell, User, Server } from 'lucide-react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      const res = await api.checkHealth();
      if (isMounted) {
        setBackendStatus(res.status);
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 px-10 flex items-center justify-end gap-5 bg-transparent shrink-0">
      {/* Backend Status Pill */}
      <Link
        to="/settings"
        className="flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono border border-[#292F3B] bg-[#141823] text-[#969DAB] hover:text-[#E8EAF0] transition-colors"
        title="Configured for http://localhost:8000"
      >
        <Server className="w-3 h-3 text-[#8290C9]" />
        <span>{backendStatus === 'online' ? 'FastAPI Connected' : 'Standalone / Demo'}</span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            backendStatus === 'online'
              ? 'bg-[#4E9F76]'
              : 'bg-[#D49A3D]'
          }`}
        />
      </Link>

      {/* Bell Notification */}
      <button
        type="button"
        className="text-[#969DAB] hover:text-[#E8EAF0] transition-colors p-1"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 stroke-[1.8]" />
      </button>

      {/* User Profile Circle */}
      <button
        type="button"
        className="w-7 h-7 rounded-full bg-[#1F2637] border border-[#292F3B] flex items-center justify-center text-[#969DAB] hover:text-[#E8EAF0] transition-colors"
        aria-label="User profile"
      >
        <User className="w-4 h-4 stroke-[1.8]" />
      </button>
    </header>
  );
};
