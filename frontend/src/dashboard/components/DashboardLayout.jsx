import { useMemo, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { findMenuItemByPath } from '../config/menuConfig.js';

function DashboardLayout({ roleLabel, menuGroups, currentPath, onNavigate, onLogout, userName, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const currentMenu = useMemo(
    () => findMenuItemByPath(menuGroups, currentPath),
    [menuGroups, currentPath]
  );
  const topTitle = currentMenu?.item?.label ?? `${roleLabel} Dashboard`;

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <div className="hidden md:block">
        <Sidebar
          menuGroups={menuGroups}
          currentPath={currentPath}
          onNavigate={onNavigate}
          collapsed={collapsed}
          userName={userName}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
        />
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">
            <Sidebar
              menuGroups={menuGroups}
              currentPath={currentPath}
              onNavigate={onNavigate}
              collapsed={false}
              userName={userName}
              onCloseMobile={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar
          title={topTitle}
          userName={userName}
          onLogout={onLogout}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
