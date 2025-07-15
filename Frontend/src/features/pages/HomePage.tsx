import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '../../components/mode-toggle';
import { Search } from 'lucide-react';
import ChatBot from '../../components/ChatBot';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatBot, setShowChatBot] = useState(false);

  const handleDashboardRedirect = () => {
    if (user?.role === 'MODERATOR') {
      navigate('/moderator-dashboard');
    } else if (user?.role === 'PARTNER') {
      navigate('/partner-dashboard');
    } else if (user?.role === 'BUYER') {
      navigate('/buyer-dashboard');
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/parts-catalog');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <span className="block">
                <img
                  src={logoLight}
                  alt="Lafiray.ma Logo Light"
                  className="w-44 h-16 block dark:hidden"
                />
                <img
                  src={logoDark}
                  alt="Lafiray.ma Logo Dark"
                  className="w-44 h-16 hidden dark:block"
                />
              </span>
            </div>
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user?.name}</span>
                  <Button
                    onClick={handleDashboardRedirect}
                    className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    size="sm"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    size="sm"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => navigate('/login')}
                    className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    variant="outline"
                    className="border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    size="sm"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-black dark:bg-black text-white dark:text-white py-16 px-6 sm:px-12 lg:px-24 relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white dark:text-white">Find Your Perfect Auto Parts</h2>
          <p className="text-xl md:text-2xl mb-8 text-white dark:text-white">Quality parts from trusted partners across Morocco</p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mt-12 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by producer, car model, or car part..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white px-4 py-3 text-lg rounded-lg"
                  autoComplete="off"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleSearch} 
                variant="outline"
                className="bg-transparent border border-white dark:border-white text-white dark:text-white hover:bg-white hover:text-black dark:hover:bg-gray-800 dark:hover:text-white transition-colors font-semibold text-lg px-8 py-3 rounded-lg shadow-sm"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <Button
              onClick={() => navigate('/parts-catalog')}
              className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-lg px-8 py-4 rounded-lg shadow-sm"
              size="lg"
            >
              Browse All Parts
            </Button>
            <Button
              onClick={() => navigate('/register')}
              variant="outline"
              className="bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-lg px-8 py-4 rounded-lg shadow-sm"
              size="lg"
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black dark:bg-black text-white dark:text-white py-8 px-6 sm:px-12 lg:px-24 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center">
            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mb-6">
              <a 
                href="#" 
                className="flex items-center space-x-2 text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                title="Follow us on X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-sm font-medium">X</span>
              </a>
              
              <a 
                href="#" 
                className="flex items-center space-x-2 text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                title="Follow us on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </a>
              
              <a 
                href="#" 
                className="flex items-center space-x-2 text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                title="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm font-medium">Instagram</span>
              </a>
              
              <a 
                href="#" 
                className="flex items-center space-x-2 text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                title="Follow us on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-white dark:text-white">
              <span>© 2025 L'Afiray.ma</span>
              <span>•</span>
              <span>All rights reserved</span>
            </div>
            <span className="block w-full text-center text-xs text-gray-300 dark:text-gray-500 mt-2">
              L'Afiray.ma is Morocco's trusted online marketplace for car parts. We connect buyers and partners for quality, affordable auto parts with a seamless experience.
            </span>
          </div>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot 
        isOpen={showChatBot} 
        onToggle={() => setShowChatBot(!showChatBot)} 
      />
      
      {/* Fixed Mode Toggle */}
      <div className="fixed top-20 right-4 z-50">
        <ModeToggle />
      </div>
    </div>
  );
};

export default HomePage;