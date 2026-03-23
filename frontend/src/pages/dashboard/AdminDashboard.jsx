import DashboardLayout from '../../dashboard/components/DashboardLayout.jsx';
import DashboardPageContent from '../../dashboard/content/DashboardPageContent.jsx';
import { adminMenuGroups } from '../../dashboard/config/menuConfig.js';

function AdminDashboard({ user, onLogout, currentPath, onNavigate }) {
  return (
    <DashboardLayout
      roleLabel="Admin"
      menuGroups={adminMenuGroups}
      currentPath={currentPath}
      onNavigate={onNavigate}
      onLogout={onLogout}
      userName={user?.full_name ?? 'Admin User'}
    >
      <DashboardPageContent role="admin" currentPath={currentPath} onNavigate={onNavigate} />
    </DashboardLayout>
  );
}

export default AdminDashboard;
