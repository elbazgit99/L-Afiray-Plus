import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';   
import { Label } from '@/components/ui/label';
import { ArrowLeft} from 'lucide-react';  
import ForgotPassword from '@/components/ForgotPassword';

// IMPORTANT: Replace the content of this component with the actual code
// correctly map to the state and functions below.

const Login: React.FC = () => {
  const { login, loadingAuth, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    console.log('Login form useEffect - isAuthenticated:', isAuthenticated, 'user:', user);
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard for role:', user.role);
      // moderator dashboard
              if (user.role === 'MODERATOR') {
            console.log('Redirecting to moderator dashboard');
            navigate('/moderator-dashboard', { replace: true });
        // partner dashboard
      } else if (user.role === 'PARTNER') {
        console.log('Redirecting to partner dashboard');
        navigate('/partner-dashboard', { replace: true });
        // buyer dashboard
      } else if (user.role === 'BUYER') {
        console.log('Redirecting to buyer dashboard');
        navigate('/buyer-dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with:', { email, password });
    try {
      const result = await login(email, password);
      console.log('Login result:', result);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    // Optionally show a success message or redirect
  };

  // If already authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  // Show forgot password component
  if (showForgotPassword) {
    return (
      <ForgotPassword 
        onBack={() => setShowForgotPassword(false)}
        onSuccess={handleForgotPasswordSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 px-6 sm:px-12 lg:px-24">
      <div className="p-8 rounded-lg shadow-md bg-white dark:bg-black border border-gray-200 dark:border-gray-700 w-full max-w-sm relative">
        {/* Back to Home Button */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 p-2 h-auto w-auto text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="sr-only">Back to Home</span>
        </Button>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-black dark:text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>
          
          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          
          <Button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity" disabled={loadingAuth}>
            {loadingAuth ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account? <a href="/register" className="text-black dark:text-white underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
