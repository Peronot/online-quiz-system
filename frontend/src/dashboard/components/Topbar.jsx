import { useEffect, useState } from 'react';
import { iconMap } from './iconMap.js';

const { Bell, LogOut, Maximize2, Menu, Minimize2, Search, UserCircle2 } = iconMap;

function Topbar({ title, userName, onLogout, onOpenSidebar }) {
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const syncFullscreenState = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (typeof document === 'undefined') return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            <p className="text-xs text-slate-500">Jamhuriya Quize Admin System</p>
          </div>
        </div>

        <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            className="ml-2 w-48 bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <button
            type="button"
            className="relative rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#F2C200]" />
          </button>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 md:flex">
            <UserCircle2 className="h-5 w-5 text-[#1E3A8A]" />
            <span className="text-sm font-medium text-slate-700">{userName}</span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1 rounded-xl bg-[#1E3A8A] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1F8A4C]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
