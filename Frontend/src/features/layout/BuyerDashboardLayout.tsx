import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
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
  User, 
  Package, 
  ShoppingCart, 
  LogOut 
} from 'lucide-react';

const BuyerDashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <h2 className="text-lg font-semibold">Buyer Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/buyer-dashboard/profile">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/buyer-dashboard/parts">
                    <Package className="h-4 w-4" />
                    <span>Browse Car Parts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/buyer-dashboard/orders">
                    <ShoppingCart className="h-4 w-4" />
                    <span>My Orders</span>
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
            <h1 className="text-3xl font-bold">Welcome, {user?.name} (Buyer)</h1>
            <ModeToggle />
          </header>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BuyerDashboardLayout;
