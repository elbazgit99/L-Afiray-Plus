import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext'; // Adjust path if necessary

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



// This custom hook provides access to the authentication context, allowing components to easily access user information and authentication methods.