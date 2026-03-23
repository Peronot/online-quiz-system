import DashboardLayout from '../../dashboard/components/DashboardLayout.jsx';
import DashboardPageContent from '../../dashboard/content/DashboardPageContent.jsx';
import { teacherMenuGroups } from '../../dashboard/config/menuConfig.js';

function TeacherDashboard({ user, onLogout, currentPath, onNavigate }) {
  return (
    <DashboardLayout
      roleLabel="Teacher"
      menuGroups={teacherMenuGroups}
      currentPath={currentPath}
      onNavigate={onNavigate}
      onLogout={onLogout}
      userName={user?.full_name ?? 'Teacher User'}
    >
      <DashboardPageContent role="teacher" currentPath={currentPath} onNavigate={onNavigate} />
    </DashboardLayout>
  );
}

export default TeacherDashboard;
