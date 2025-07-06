import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '../../components/ui/button'; // Adjusted path
import { useAuth } from '../../context/AuthContext'; // Adjusted path
import { ModeToggle } from '../../components/mode-toggle'; // Import ModeToggle
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
  Users, 
  Building2, 
  Package, 
  Shield, 
  BarChart3, 
  LogOut 
} from 'lucide-react';

const ModeratorDashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <h2 className="text-lg font-semibold">Moderator Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/moderator-dashboard/users">
                    <Users className="h-4 w-4" />
                    <span>Manage Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/moderator-dashboard/partners">
                    <Building2 className="h-4 w-4" />
                    <span>Partner Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/moderator-dashboard/content-moderation">
                    <Shield className="h-4 w-4" />
                    <span>Content Moderation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/moderator-dashboard/analytics">
                    <BarChart3 className="h-4 w-4" />
                    <span>Platform Analytics</span>
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
            <h1 className="text-3xl font-bold">Welcome, Moderator {user?.name}</h1>
            <ModeToggle />
          </header>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ModeratorDashboardLayout;
