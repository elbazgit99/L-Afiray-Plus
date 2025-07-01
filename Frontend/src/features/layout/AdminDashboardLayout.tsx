import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '../../components/ui/button'; // Adjusted path
import { useAuth } from '../../context/AuthContext'; // Adjusted path
import { ModeToggle } from '../../components/mode-toggle'; // Import ModeToggle

const AdminDashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-black p-6 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-black dark:text-white">Admin Panel</h2>
        <nav className="flex-grow space-y-4">
          <Link to="/admin-dashboard" className="block text-black dark:text-white hover:underline text-lg">Dashboard Home</Link>
          <Link to="/admin-dashboard/users" className="block text-black dark:text-white hover:underline text-lg">Manage Users</Link>
          <Link to="/admin-dashboard/inventory" className="block text-black dark:text-white hover:underline text-lg">Manage Inventory</Link> {/* Renamed from 'courses' */}
          <Link to="/admin-dashboard/content-moderation" className="block text-black dark:text-white hover:underline text-lg">Content Moderation</Link> {/* New link */}
          <Link to="/admin-dashboard/analytics" className="block text-black dark:text-white hover:underline text-lg">Platform Analytics</Link> {/* New link */}
          {/* Add more admin specific links here */}
        </nav>
        <Button
          onClick={logout}
          variant="outline"
          className="mt-8 bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
        >
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold">Welcome, Admin {user?.name}!</h1>
          {/* Theme Toggle Component */}
          <ModeToggle />
        </header>
        {/* Outlet for nested routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
