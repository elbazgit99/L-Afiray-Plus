import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '../../components/mode-toggle';
import { Search, X } from 'lucide-react';
import ChatBot from '../../components/ChatBot';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // ChatBot states
  const [showChatBot, setShowChatBot] = useState(false);

  // Privacy Policy modal states
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

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
      navigate(`/parts-catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
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
          <div className="max-w-4xl mx-auto mt-12 mb-8 relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by producer, car model, or car part..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  className="w-full bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white px-4 py-3 text-lg rounded-lg"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
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

      {/* ChatBot */}
      <ChatBot 
        isOpen={showChatBot} 
        onToggle={() => setShowChatBot(!showChatBot)} 
      />
      
      {/* Fixed Mode Toggle */}
      <div className="fixed top-20 right-4 z-50">
        <ModeToggle />
      </div>

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
              <button
                onClick={() => setShowPrivacyPolicy(true)}
                className="hover:underline cursor-pointer bg-transparent border-0 p-0 m-0 text-inherit"
                style={{ background: 'none' }}
              >
                © 2025 L'Afiray.ma
              </button>
              <span>•</span>
              <button 
                onClick={() => setShowInstructions(true)}
                className="hover:underline cursor-pointer"
              >
                How to Use
              </button>
              <span>•</span>
              <button
                onClick={() => setShowAboutModal(true)}
                className="hover:underline cursor-pointer bg-transparent border-0 p-0 m-0 text-inherit"
                style={{ background: 'none' }}
              >
                About Us
              </button>
              <span>•</span>
              <button
                onClick={() => setShowTermsModal(true)}
                className="hover:underline cursor-pointer bg-transparent border-0 p-0 m-0 text-inherit"
                style={{ background: 'none' }}
              >
                Terms of Service
              </button>
            </div>
            <span className="block w-full text-center text-xs text-gray-300 dark:text-gray-500 mt-2">
              L'Afiray.ma is Morocco's trusted online marketplace for car parts. We connect buyers and partners for quality, affordable auto parts with a seamless experience.
            </span>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/50 dark:bg-white/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-black dark:text-white">Privacy Policy</h2>
              <button 
                onClick={() => setShowPrivacyPolicy(false)}
                className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-black dark:text-white text-sm space-y-4">
              <p>
                <strong>Effective Date: January 1, 2025</strong>
              </p>
              <p>
                L'Afiray.ma values your privacy. We collect only the information necessary to provide our services, such as your name, contact details, and order information. We do not sell your data to third parties. Your information is used solely to improve your experience and fulfill your orders.
              </p>
              <p>
                By using our platform, you agree to our collection and use of information as described in this policy. For questions, contact us at privacy@lafiray.ma.
              </p>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowPrivacyPolicy(false)}
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-white/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-black dark:text-white">Terms of Service</h2>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-black dark:text-white text-sm space-y-4">
              <p>
                <strong>Welcome to L'Afiray.ma!</strong>
              </p>
              <p>
                By using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for lawful purposes only.</li>
                <li>Do not misuse, hack, or disrupt the service.</li>
                <li>All content and trademarks are property of L'Afiray.ma or its partners.</li>
                <li>We reserve the right to suspend or terminate accounts for violations.</li>
                <li>We may update these terms at any time. Continued use means acceptance of changes.</li>
              </ul>
              <p>
                For questions, contact us at support@lafiray.ma.
              </p>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowTermsModal(false)}
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-white/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-black dark:text-white">About Us</h2>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-black dark:text-white text-sm space-y-4">
              <p>
                <strong>Welcome to L'Afiray.ma!</strong>
              </p>
              <p>
                L'Afiray.ma is Morocco's trusted online marketplace for car parts. Our mission is to connect buyers and partners, making it easy to find quality, affordable auto parts with a seamless experience.
              </p>
              <p>
                We work with a network of reliable partners to ensure a wide selection of parts for all makes and models. Whether you're a car owner, mechanic, or business, L'Afiray.ma is your one-stop shop for auto parts in Morocco.
              </p>
              <p>
                Thank you for choosing us. For inquiries, partnerships, or support, contact us at info@lafiray.ma.
              </p>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowAboutModal(false)}
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 dark:bg-white/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-black dark:text-white">How to Use L'Afiray.ma</h2>
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-600">
                  <span className="text-3xl font-bold text-black dark:text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Search & Find</h3>
                <p className="text-black dark:text-white text-sm leading-relaxed">
                  Use the search bar to find specific car parts by name, brand, or description. 
                  Our system will help you find exactly what you need.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-600">
                  <span className="text-3xl font-bold text-black dark:text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Browse Catalog</h3>
                <p className="text-black dark:text-white text-sm leading-relaxed">
                  Click "Browse All Parts" to explore our complete catalog of auto parts 
                  from trusted partners across Morocco.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-600">
                  <span className="text-3xl font-bold text-black dark:text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Get Started</h3>
                <p className="text-black dark:text-white text-sm leading-relaxed">
                  Click "Register" to create an account and start shopping, or "Become a Partner" 
                  if you want to sell your own auto parts on the platform.
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Additional Features:</h3>
              <ul className="space-y-2 text-black dark:text-white text-sm">
                <li>• <strong>Dark/Light Mode:</strong> Toggle between themes using the button in the top right</li>
                <li>• <strong>Chat Support:</strong> Get help with our built-in chat assistant</li>
                <li>• <strong>Social Media:</strong> Follow us for updates and news</li>
                <li>• <strong>Account Dashboard:</strong> Access your personalized dashboard after login</li>
              </ul>
            </div>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowInstructions(false)}
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;