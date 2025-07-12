import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ModeToggle } from '@/components/mode-toggle';
import HoverSidebar from '@/components/HoverSidebar';

const PartnerDashboardLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hover Sidebar */}
      <HoverSidebar userRole="PARTNER" />
      
      {/* Main Content - Centered with proper spacing */}
      <main className="flex justify-center pt-16">
        <div className="w-full max-w-6xl px-8 py-8">
          <header className="mb-8 pb-4 border-b border-border">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">Welcome, {user?.name} (Partner)</h1>
              {user?.isApproved === false && (
                <div className="mt-2 flex items-center text-yellow-600 dark:text-yellow-400">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Account Pending Approval</span>
                </div>
              )}
            </div>
          </header>
          <Outlet />
        </div>
      </main>
      
      {/* Fixed Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>
    </div>
  );
};

export default PartnerDashboardLayout;
