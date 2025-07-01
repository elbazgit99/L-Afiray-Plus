import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '../../components/mode-toggle';
import { toast } from 'sonner';

// Define interfaces for the data structures
interface CarPart {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  brand: string;
  category: string;
  producer: { _id: string; name: string; };
  model: { _id: string; name: string; };
}

interface CarModel {
  _id: string;
  name: string;
  producer: { _id: string; name: string; };
}

interface Producer {
  _id: string;
  name: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // State for partner content
  const [featuredParts, setFeaturedParts] = useState<CarPart[]>([]);
  const [popularModels, setPopularModels] = useState<CarModel[]>([]);
  const [topProducers, setTopProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartnerContent = async () => {
      try {
        // Fetch featured car parts (limit to 6 for homepage)
        const partsResponse = await axios.get<CarPart[]>(`${API_BASE_URL}/carparts`);
        setFeaturedParts(partsResponse.data.slice(0, 6));

        // Fetch car models
        const modelsResponse = await axios.get<CarModel[]>(`${API_BASE_URL}/carmodels`);
        setPopularModels(modelsResponse.data.slice(0, 8));

        // Fetch producers
        const producersResponse = await axios.get<Producer[]>(`${API_BASE_URL}/producers`);
        setTopProducers(producersResponse.data.slice(0, 6));

      } catch (error: any) {
        console.error("Failed to fetch partner content:", error);
        toast.error("Failed to load content", { description: "Some content may not be available." });
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerContent();
  }, []);

  const handleDashboardRedirect = () => {
    if (user?.role === 'ADMIN') {
      navigate('/admin-dashboard');
    } else if (user?.role === 'PARTNER') {
      navigate('/partner-dashboard');
    } else if (user?.role === 'BUYER') {
      navigate('/buyer-dashboard');
    }
  };

  const handleBuyClick = (partName: string) => {
    if (!isAuthenticated) {
      toast.info("Login Required", { description: `Please log in to purchase "${partName}".` });
      navigate('/login');
    } else {
      toast.success("Item Added", { description: `"${partName}" added to your cart.` });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p>Loading L'Afiray.ma...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-black dark:text-white">L'Afiray.ma</h1>
              <span className="text-sm text-gray-600 dark:text-gray-400">Your Auto Parts Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user?.name}</span>
                  <Button
                    onClick={handleDashboardRedirect}
                    className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                    size="sm"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    size="sm"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => navigate('/login')}
                    className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    variant="outline"
                    className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect Auto Parts</h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">Quality parts from trusted partners across Morocco</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/parts-catalog')}
              className="bg-white text-blue-600 hover:bg-blue-50 transition-colors text-lg px-8 py-3"
              size="lg"
            >
              Browse All Parts
            </Button>
            <Button
              onClick={() => navigate('/register')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 transition-colors text-lg px-8 py-3"
              size="lg"
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Car Parts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Featured Auto Parts</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Discover quality parts from our trusted partners</p>
          </div>
          
          {featuredParts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredParts.map((part) => (
                <div key={part._id} className="bg-white dark:bg-black rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  <img
                    src={part.imageUrl || 'https://placehold.co/400x250/E0E0E0/333333?text=No+Image'}
                    alt={part.name}
                    className="w-full h-48 object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = 'https://placehold.co/400x250/E0E0E0/333333?text=Image+Error'; 
                    }}
                  />
                  <div className="p-6">
                    <h4 className="text-xl font-semibold mb-2">{part.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{part.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{part.brand}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{part.category}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{part.price?.toFixed(2)} €</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{part.producer?.name}</span>
                    </div>
                    <Button
                      onClick={() => handleBuyClick(part.name)}
                      className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No parts available yet. Check back soon!</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button
              onClick={() => navigate('/parts-catalog')}
              className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
            >
              View All Parts
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Car Models Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Popular Car Models</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Find parts for your specific vehicle</p>
          </div>
          
          {popularModels.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {popularModels.map((model) => (
                <div key={model._id} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 text-center hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                  <h4 className="font-semibold mb-2">{model.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{model.producer?.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No car models available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Top Producers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Trusted Producers</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Quality brands you can rely on</p>
          </div>
          
          {topProducers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {topProducers.map((producer) => (
                <div key={producer._id} className="bg-white dark:bg-black rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {producer.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm">{producer.name}</h4>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No producers available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-gray-300">Join thousands of customers who trust L'Afiray.ma for their auto parts needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="bg-white text-gray-900 hover:bg-gray-100 transition-colors text-lg px-8 py-3"
              size="lg"
            >
              Create Account
            </Button>
            <Button
              onClick={() => navigate('/parts-catalog')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-lg px-8 py-3"
              size="lg"
            >
              Browse Parts
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black dark:bg-white text-white dark:text-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">L'Afiray.ma</h4>
            <p className="text-gray-400 dark:text-gray-600 mb-4">Your trusted partner for quality auto parts in Morocco</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400 dark:text-gray-600">
              <span>© 2024 L'Afiray.ma</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
