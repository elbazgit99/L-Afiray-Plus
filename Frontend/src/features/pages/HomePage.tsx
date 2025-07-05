import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '../../components/mode-toggle';
import { Search, Package, Car, Building2, Filter, X } from 'lucide-react';
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
  engine?: string; // Add engine field
}

interface CarModel {
  _id: string;
  name: string;
  producer: { _id: string; name: string; };
  engine?: string; // Add engine field
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredResults, setFilteredResults] = useState<{
    parts: CarPart[];
    models: CarModel[];
    producers: Producer[];
  }>({ parts: [], models: [], producers: [] });

  // Filter states
  const [selectedProducer, setSelectedProducer] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Get unique values for filters
  const uniqueProducers = Array.from(new Set(featuredParts.map(part => part.producer?.name).filter(Boolean)));
  const uniqueEngines = Array.from(new Set(featuredParts.map(part => part.engine).filter((engine): engine is string => Boolean(engine))));
  const uniqueModels = Array.from(new Set(featuredParts.map(part => part.model?.name).filter(Boolean)));

  // Filtered parts based on selected filters
  const filteredParts = featuredParts.filter(part => {
    const producerMatch = !selectedProducer || part.producer?.name === selectedProducer;
    const engineMatch = !selectedEngine || part.engine === selectedEngine;
    const modelMatch = !selectedModel || part.model?.name === selectedModel;
    return producerMatch && engineMatch && modelMatch;
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedProducer('');
    setSelectedEngine('');
    setSelectedModel('');
  };

  // Check if any filters are active
  const hasActiveFilters = selectedProducer || selectedEngine || selectedModel;

  useEffect(() => {
    const fetchPartnerContent = async () => {
      try {
        console.log('Fetching car parts from:', `${API_BASE_URL}/carparts`);
        
        // Fetch featured car parts (limit to 6 for homepage)
        const partsResponse = await axios.get<CarPart[]>(`${API_BASE_URL}/carparts`);
        console.log('Car parts response:', partsResponse.data);
        const slicedParts = partsResponse.data.slice(0, 6);
        console.log('Sliced parts:', slicedParts);
        setFeaturedParts(slicedParts);

        // Fetch car models
        const modelsResponse = await axios.get<CarModel[]>(`${API_BASE_URL}/carmodels`);
        console.log('Car models response:', modelsResponse.data);
        setPopularModels(modelsResponse.data.slice(0, 8));

        // Fetch producers
        const producersResponse = await axios.get<Producer[]>(`${API_BASE_URL}/producers`);
        console.log('Producers response:', producersResponse.data);
        setTopProducers(producersResponse.data.slice(0, 6));

      } catch (error: any) {
        console.error("Failed to fetch partner content:", error);
        console.error("Error details:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error message:", error.message);
        console.error("Full error object:", error);
        toast.error("Failed to load content", { description: "Some content may not be available." });
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerContent();
  }, []);

  // Debug useEffect to monitor featuredParts state
  useEffect(() => {
    console.log('featuredParts state changed:', featuredParts);
  }, [featuredParts]);

  const handleDashboardRedirect = () => {
    if (user?.role === 'MODERATOR') {
      navigate('/moderator-dashboard');
    } else if (user?.role === 'PARTNER') {
      navigate('/partner-dashboard');
    } else if (user?.role === 'BUYER') {
      navigate('/buyer-dashboard');
    }
  };

  const handleBuyClick = (part: CarPart) => {
    if (!isAuthenticated) {
      toast.success("Viewing Details", { 
        description: `${part.name} - ${part.brand} - ${part.price?.toFixed(2)} DH` 
      });
      // You can navigate to a details page or show a modal here
    } else {
      toast.success("Item Added", { description: `"${part.name}" added to your cart.` });
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      // Filter existing data
      const filteredParts = featuredParts.filter(part => 
        part.name.toLowerCase().includes(query) ||
        part.brand.toLowerCase().includes(query) ||
        part.category.toLowerCase().includes(query) ||
        part.producer?.name.toLowerCase().includes(query) ||
        part.model?.name.toLowerCase().includes(query)
      );
      
      const filteredModels = popularModels.filter(model => 
        model.name.toLowerCase().includes(query) ||
        model.producer?.name.toLowerCase().includes(query)
      );
      
      const filteredProducers = topProducers.filter(producer => 
        producer.name.toLowerCase().includes(query)
      );
      
      setFilteredResults({
        parts: filteredParts,
        models: filteredModels,
        producers: filteredProducers
      });
      
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilteredResults({ parts: [], models: [], producers: [] });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      handleSearch();
    } else {
      setShowSuggestions(false);
      setFilteredResults({ parts: [], models: [], producers: [] });
    }
  };

  const handleSuggestionClick = (type: 'part' | 'model' | 'producer', item: any) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    
    // Show toast with item details
    if (type === 'part') {
      toast.success(`Found: ${item.name}`, { 
        description: `${item.brand} - ${item.category} - ${item.price?.toFixed(2)} DH` 
      });
    } else if (type === 'model') {
      toast.success(`Found: ${item.name}`, { 
        description: `Producer: ${item.producer?.name}` 
      });
    } else {
      toast.success(`Found: ${item.name}`, { 
        description: `Producer` 
      });
    }
  };

  const closeSuggestions = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // --- SEARCH SUGGESTIONS LOGIC ---
  // Compute suggestions: show all if input is empty, else filtered
  const suggestions = React.useMemo(() => {
    if (searchQuery.trim() === '') {
      return {
        parts: featuredParts,
        models: popularModels,
        producers: topProducers
      };
    }
    return filteredResults;
  }, [searchQuery, featuredParts, popularModels, topProducers, filteredResults]);

  // Show suggestions when input is focused
  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white px-6 sm:px-12 lg:px-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p>Loading L'Afiray.ma...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white px-6 sm:px-12 lg:px-24">
      {/* Header */}
      <header className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
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
      <section className="bg-black dark:bg-white text-white dark:text-black py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect Auto Parts</h2>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 dark:text-gray-700">Quality parts from trusted partners across Morocco</p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mt-12 mb-8 relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by producer, car model, or car part..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={closeSuggestions}
                  onKeyDown={handleKeyPress}
                  className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 text-lg rounded-lg"
                  autoComplete="off"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleSearch} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg shadow-xl transition-all duration-200 font-bold text-lg border-2 border-blue-600 hover:border-blue-700 transform hover:scale-105 hover:shadow-2xl"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Filter Section - Always Visible */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Parts
                </h4>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Producer Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Car Producer
                  </label>
                  <Select value={selectedProducer} onValueChange={setSelectedProducer}>
                    <SelectTrigger className="w-full bg-white dark:bg-zinc-700 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select producer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700">
                      <SelectItem value="">All Producers</SelectItem>
                      {uniqueProducers.map((producer) => (
                        <SelectItem key={producer} value={producer}>
                          {producer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Engine Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Engine Type
                  </label>
                  <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                    <SelectTrigger className="w-full bg-white dark:bg-zinc-700 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select engine" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700">
                      <SelectItem value="">All Engines</SelectItem>
                      {uniqueEngines.map((engine) => (
                        <SelectItem key={engine} value={engine}>
                          {engine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Car Model Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Car Model
                  </label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-full bg-white dark:bg-zinc-700 text-black dark:text-white border-2 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700">
                      <SelectItem value="">All Models</SelectItem>
                      {uniqueModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {selectedProducer && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                        Producer: {selectedProducer}
                        <button
                          onClick={() => setSelectedProducer('')}
                          className="ml-2 hover:text-green-600 dark:hover:text-green-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedEngine && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                        Engine: {selectedEngine}
                        <button
                          onClick={() => setSelectedEngine('')}
                          className="ml-2 hover:text-blue-600 dark:hover:text-blue-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedModel && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                        Model: {selectedModel}
                        <button
                          onClick={() => setSelectedModel('')}
                          className="ml-2 hover:text-purple-600 dark:hover:text-purple-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Showing {filteredParts.length} of {featuredParts.length} parts
                  </p>
                </div>
              )}
            </div>
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute z-20 mt-2 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto transition-all">
                {/* Car Parts */}
                {suggestions.parts.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Package className="w-4 h-4" /> Car Parts
                    </div>
                    {suggestions.parts.map((part) => (
                      <div
                        key={part._id}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onMouseDown={() => handleSuggestionClick('part', part)}
                      >
                        <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium">{part.name}</span>
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{part.brand}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Car Models */}
                {suggestions.models.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Car className="w-4 h-4" /> Car Models
                    </div>
                    {suggestions.models.map((model) => (
                      <div
                        key={model._id}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onMouseDown={() => handleSuggestionClick('model', model)}
                      >
                        <Car className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium">{model.name}</span>
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{model.producer?.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Producers */}
                {suggestions.producers.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Producers
                    </div>
                    {suggestions.producers.map((producer) => (
                      <div
                        key={producer._id}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onMouseDown={() => handleSuggestionClick('producer', producer)}
                      >
                        <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium">{producer.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* No results */}
                {suggestions.parts.length === 0 && suggestions.models.length === 0 && suggestions.producers.length === 0 && (
                  <div className="px-4 py-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <Button
              onClick={() => navigate('/parts-catalog')}
              className="bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              size="lg"
            >
              Browse All Parts
            </Button>
            <Button
              onClick={() => navigate('/register')}
              variant="outline"
              className="bg-transparent border-2 border-white dark:border-black text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all duration-200 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              size="lg"
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Car Parts Section */}
      <section className="py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              {hasActiveFilters ? 'Filtered Auto Parts' : 'Featured Auto Parts'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {hasActiveFilters 
                ? `Showing ${filteredParts.length} of ${featuredParts.length} parts matching your criteria`
                : 'Discover quality parts from our trusted partners'
              }
            </p>
          </div>
          
          {(() => { console.log('Rendering filtered parts:', filteredParts); return null; })()}
          {filteredParts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.map((part) => (
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
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{part.price?.toFixed(2)} DH</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{part.producer?.name}</span>
                    </div>
                    <Button
                      onClick={() => handleBuyClick(part)}
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
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {hasActiveFilters 
                  ? "No parts match your current filters. Try adjusting your selection." 
                  : "No parts available yet. Check back soon!"
                }
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button
              onClick={() => navigate('/parts-catalog')}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Parts
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Car Models Section */}
      <section className="py-16 bg-white dark:bg-black px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
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
      <section className="py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
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
      <section className="py-16 bg-black dark:bg-white text-white dark:text-black px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-gray-300 dark:text-gray-700">Join thousands of customers who trust L'Afiray.ma for their auto parts needs</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              size="lg"
            >
              Create Account
            </Button>
            <Button
              onClick={() => navigate('/parts-catalog')}
              variant="outline"
              className="bg-transparent border-2 border-white dark:border-black text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all duration-200 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              size="lg"
            >
              Browse Parts
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black dark:bg-white text-white dark:text-black py-8 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">L'Afiray.ma</h4>
            <p className="text-gray-400 dark:text-gray-600 mb-4">Your trusted partner for quality auto parts in Morocco</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400 dark:text-gray-600">
              <span>© 2025 L'Afiray.ma</span>
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
