import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ModeToggle } from '@/components/mode-toggle'; // Import ModeToggle

const PartnerDashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
      {/* Sidebar for Partner Dashboard */}
      <aside className="w-64 bg-white dark:bg-black p-6 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-black dark:text-white">Partner Panel</h2>
        <nav className="flex-grow space-y-4">
          <Link to="/partner-dashboard" className="block text-black dark:text-white hover:underline text-lg">Dashboard Home</Link>
          <Link to="/partner-dashboard/listings" className="block text-black dark:text-white hover:underline text-lg">Car Management</Link>
          <Link to="/partner-dashboard/orders" className="block text-black dark:text-white hover:underline text-lg">Track Orders</Link>
          <Link to="/partner-dashboard/sales-reports" className="block text-black dark:text-white hover:underline text-lg">Sales Reports</Link>
          <Link to="/partner-dashboard/profile" className="block text-black dark:text-white hover:underline text-lg">My Profile</Link>
        </nav>
        <Button
          onClick={logout}
          variant="outline"
          className="mt-8 bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
        >
          Logout
        </Button>
      </aside>

      {/* Main Content Area for Partner */}
      <main className="flex-1 p-8 px-6 sm:px-12 lg:px-24">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold">Welcome, {user?.name} (Partner)!</h1>
          {/* Theme Toggle Component */}
          <ModeToggle />
        </header>
        {/* Outlet for nested routes - this is where child routes will render */}
        <Outlet />
      </main>
    </div>
  );
};

export default PartnerDashboardLayout;
