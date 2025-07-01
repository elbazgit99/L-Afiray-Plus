import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import PrivateRoute from '@/components/PrivateRoute';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from "@/components/theme-provider"

// Public Pages
import LoginPage from '@/features/layout/login-form';
import RegisterPage from '@/features/layout/register';
import HomePage from '@/features/pages/HomePage';

// Admin Dashboard Components
import AdminDashboardLayout from '@/features/layout/AdminDashboardLayout';
import AdminHomePage from '@/components/home-dash';
import { TableUsers } from '@/components/table-users';
import UpdateUserForm from '@/components/form-update';
import ContentModerationPage from '@/features/admin/ContentModerationPage';
import PlatformAnalyticsPage from '@/features/admin/PlatformAnalyticsPage';

// Partner Dashboard Components
import PartnerDashboardLayout from '@/features/layout/PartnerDashboardLayout';
import PartnerHomePage from '@/features/partner/PartnerHomePage'
import PartnerOrdersPage from '@/features/partner/PartnerOrdersPage';
import PartnerSalesReportsPage from '@/features/partner/PartnerSalesReportsPage';
import PartnerProfilePage from '@/features/partner/PartnerProfilePage';
import PartnerListingsPage from '@/features/partner/PartnerListingsPage'; // Import the new listings page

// Buyer Dashboard Components
import BuyerDashboardLayout from '@/features/layout/BuyerDashboardLayout';
import BuyerProfilePage from '@/features/buyer/BuyerProfilePage';
import BuyerHomePage from '@/features/buyer/BuyerHomePage';
import CarPartsCatalogPage from '@/features/buyer/CarPartsCatalogPage';
import BuyerOrdersPage from '@/features/buyer/BuyerOrdersPage';
import CheckoutPage from '@/features/buyer/CheckoutPage';

// NoMatch component for 404
const NoMatch: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg">The page you're looking for does not exist.</p>
        <Button onClick={() => window.location.href = '/'} className="mt-6 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity">
          Go to Home
        </Button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/parts-catalog" element={<CarPartsCatalogPage />} />


            {/* Admin Protected Routes */}
            <Route path="/admin-dashboard" element={<PrivateRoute roles="ADMIN"><AdminDashboardLayout /></PrivateRoute>}>
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<TableUsers />} />
              <Route path="users/update/:id" element={<UpdateUserForm />} />
              <Route path="inventory" element={<PartnerListingsPage />} /> {/* Admin can view/manage inventory via PartnerListingsPage */}
              <Route path="content-moderation" element={<ContentModerationPage />} />
              <Route path="analytics" element={<PlatformAnalyticsPage />} />
            </Route>

            {/* Partner Protected Routes */}
            <Route path="/partner-dashboard" element={<PrivateRoute roles="PARTNER"><PartnerDashboardLayout /></PrivateRoute>}>
              <Route index element={<PartnerHomePage />} />
              <Route path="listings" element={<PartnerListingsPage />} /> {/* Render PartnerListingsPage here */}
              <Route path="orders" element={<PartnerOrdersPage />} />
              <Route path="sales-reports" element={<PartnerSalesReportsPage />} />
              <Route path="profile" element={<PartnerProfilePage />} />
            </Route>

            {/* Buyer Protected Routes */}
            <Route path="/buyer-dashboard" element={<PrivateRoute roles="BUYER"><BuyerDashboardLayout /></PrivateRoute>}>
              <Route index element={<BuyerHomePage />} />
              <Route path="profile" element={<BuyerProfilePage />} />
              <Route path="parts" element={<CarPartsCatalogPage />} />
              <Route path="orders" element={<BuyerOrdersPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
            </Route>

            {/* Fallback route for unmatched paths */}
            <Route path="*" element={<NoMatch />} />
          </Routes>
          <Toaster richColors />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
