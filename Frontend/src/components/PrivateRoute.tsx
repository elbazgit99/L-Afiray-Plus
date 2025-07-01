import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles: 'ADMIN' | 'PARTNER' | 'BUYER' | ('ADMIN' | 'PARTNER' | 'BUYER')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, loadingAuth } = useAuth();

  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("Authentication Required", { description: "You need to log in to access this page." });
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role as any)) {
    toast.error("Access Denied", { description: `You do not have the required role to access this page. Required: ${allowedRoles.join(', ')}. Your role: ${user.role}.` });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
