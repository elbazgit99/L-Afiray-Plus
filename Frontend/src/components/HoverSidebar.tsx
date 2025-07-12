import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Building2, 
  Package, 
  Shield, 
  BarChart3, 
  LogOut,
  Car,
  ShoppingCart,
  User,
  Menu
} from 'lucide-react';

interface HoverSidebarProps {
  userRole: 'MODERATOR' | 'PARTNER' | 'BUYER';
}

const HoverSidebar: React.FC<HoverSidebarProps> = ({ userRole }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('hover-sidebar');
      const trigger = document.getElementById('sidebar-trigger');
      
      if (sidebar && !sidebar.contains(event.target as Node) && 
          trigger && !trigger.contains(event.target as Node)) {
        setIsOpen(false);
        setIsHovered(false);
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update visibility based on open or hover state
  useEffect(() => {
    setIsVisible(isOpen || isHovered);
  }, [isOpen, isHovered]);

  const getSidebarContent = () => {
    switch (userRole) {
      case 'MODERATOR':
        return (
          <>
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold text-black dark:text-white">Moderator Panel</h2>
            </div>
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                <Link
                  to="/moderator-dashboard/users"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                    location.pathname.includes('/users') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </Link>
                <Link
                  to="/moderator-dashboard/partners"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                    location.pathname.includes('/partners') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Partner Management</span>
                </Link>
                <Link
                  to="/moderator-dashboard/content-moderation"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                    location.pathname.includes('/content-moderation') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  <span>Content Moderation</span>
                </Link>
                <Link
                  to="/moderator-dashboard/analytics"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                    location.pathname.includes('/analytics') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Platform Analytics</span>
                </Link>
              </nav>
            </div>
          </>
        );

      case 'PARTNER':
        return (
          <>
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold text-black dark:text-white">Partner Panel</h2>
            </div>
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                <Link
                  to="/partner-dashboard/listings"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.includes('/listings') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Car className="h-4 w-4" />
                  <span>Car Management</span>
                </Link>
                <Link
                  to="/partner-dashboard/orders"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.includes('/orders') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  <span>Track Orders</span>
                </Link>
                <Link
                  to="/partner-dashboard/sales-reports"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.includes('/sales-reports') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Sales Reports</span>
                </Link>
                <Link
                  to="/partner-dashboard/profile"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.includes('/profile') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </nav>
            </div>
          </>
        );

      case 'BUYER':
        return (
          <>
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold text-black dark:text-white">Buyer Panel</h2>
            </div>
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                <Link
                  to="/buyer-dashboard/profile"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.includes('/profile') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/buyer-dashboard/parts"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.includes('/parts') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  <span>Browse Car Parts</span>
                </Link>
                <Link
                  to="/buyer-dashboard/orders"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.includes('/orders') 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>My Orders</span>
                </Link>
              </nav>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Hover trigger area */}
      <div 
        className="fixed left-0 top-0 w-8 h-full z-30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Menu Button - Always Visible */}
      <Button
        id="sidebar-trigger"
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsOpen(false);
            setIsHovered(false);
            setIsVisible(false);
          }}
        />
      )}
      
      {/* Sidebar */}
      <div
        id="hover-sidebar"
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-300 ease-in-out z-50 ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
          <div className="flex flex-col h-full">
            {getSidebarContent()}
            
            {/* Logout button */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <Button
                onClick={logout}
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
    </>
  );
};

export default HoverSidebar; 