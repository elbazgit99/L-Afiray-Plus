import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ModeToggle } from '@/components/mode-toggle'; // Import ModeToggle
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  Car, 
  Package, 
  BarChart3, 
  User, 
  LogOut
} from 'lucide-react';

const PartnerDashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <h2 className="text-lg font-semibold">Partner Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/partner-dashboard/listings">
                    <Car className="h-4 w-4" />
                    <span>Car Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/partner-dashboard/orders">
                    <Package className="h-4 w-4" />
                    <span>Track Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/partner-dashboard/sales-reports">
                    <BarChart3 className="h-4 w-4" />
                    <span>Sales Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/partner-dashboard/profile">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-4">
            <Button
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-8 pb-4 border-b border-border">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.name} (Partner)</h1>
              {user?.isApproved === false && (
                <div className="mt-2 flex items-center text-yellow-600 dark:text-yellow-400">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Account Pending Approval</span>
                </div>
              )}
            </div>
            <ModeToggle />
          </header>
          <Outlet />
        </main>
      </div>
      
    </SidebarProvider>
  );
};

export default PartnerDashboardLayout;
