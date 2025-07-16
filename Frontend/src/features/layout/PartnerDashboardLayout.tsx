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
              {/* Removed welcome message */}
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
