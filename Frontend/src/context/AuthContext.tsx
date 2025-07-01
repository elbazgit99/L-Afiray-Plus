import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// Define the User and AuthContext types based on your backend response
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  companyName?: string;
  companyAddress?: string;
  shippingAddress?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPartner: boolean;
  isBuyer: boolean;
  loadingAuth: boolean;
}

// Create the AuthContext
export const AuthContext =  createContext<AuthContextType | undefined>(undefined);

// Base URL for backend API (adjust if your backend is on a different origin)
const API_BASE_URL = 'http://localhost:5000/api';

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to wrap your application
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  // On component mount, try to load token and user from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        logout();
      }
    }
    setLoadingAuth(false);
  }, []);

  // Axios interceptor for handling token expiration or invalidity
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          if (token) {
            toast.error("Session Expired", { description: "Please log in again." });
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoadingAuth(true);
    try {
      const response = await axios.post<User>(`${API_BASE_URL}/users/login`, { email, password });
      const fullUser: User = response.data; // Backend sends full user object with token

      localStorage.setItem('token', fullUser.token);
      localStorage.setItem('user', JSON.stringify(fullUser));
      setUser(fullUser);
      setToken(fullUser.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${fullUser.token}`;
      toast.success("Login Successful", { description: `Welcome, ${fullUser.name}!` });
      return true;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error("Login Failed", { description: error.response?.data?.message || "Invalid credentials." });
      return false;
    } finally {
      setLoadingAuth(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoadingAuth(true);
    try {
      const response = await axios.post<User>(`${API_BASE_URL}/users/register`, userData);
      const fullUser: User = response.data; // Backend sends full user object with token

      localStorage.setItem('token', fullUser.token);
      localStorage.setItem('user', JSON.stringify(fullUser));
      setUser(fullUser);
      setToken(fullUser.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${fullUser.token}`;
      toast.success("Registration Successful", { description: `Welcome, ${fullUser.name}!` });
      return true;
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data || error.message);
      toast.error("Registration Failed", { description: error.response?.data?.message || "Something went wrong." });
      return false;
    } finally {
      setLoadingAuth(false);
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.info("Logged Out", { description: "You have been logged out." });
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'ADMIN';
  const isPartner = user?.role === 'PARTNER';
  const isBuyer = user?.role === 'BUYER';

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isPartner,
    isBuyer,
    loadingAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
