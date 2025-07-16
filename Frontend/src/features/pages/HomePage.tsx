import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '../../components/mode-toggle';
import { Search, Package, Car, Building2, Filter, X, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { getImageUrl, handleImageError } from '@/lib/imageUtils';
import ChatBot from '../../components/ChatBot';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

// Define interfaces for the data structures
interface CarPart {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageFilename?: string;
  price: number;
  brand: string;
  category: string;
  compatibility?: string;
  producer: { _id: string; name: string; };
  model: { _id: string; name: string; engine?: string; };
  createdAt?: string;
  updatedAt?: string;
  brandImageUrl?: string; // Added for brand image
  brandImageFilename?: string; // Added for brand image
}

interface CarModel {
  _id: string;
  name: string;
  engine?: string;
  producer: { _id: string; name: string; };
}

interface Producer {
  _id: string;
  name: string;
  imageUrl?: string;
  imageFilename?: string;
}

interface Brand {
  _id: string;
  name: string;
  imageUrl?: string;
  imageFilename?: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  // State for partner content
  const [featuredParts, setFeaturedParts] = useState<CarPart[]>([]);
  const [categoriesData, setCategoriesData] = useState<CarPart[]>([]);
  const [popularModels, setPopularModels] = useState<CarModel[]>([]);
  const [topProducers, setTopProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredResults, setFilteredResults] = useState<{
    parts: CarPart[];
    models: CarModel[];
    producers: Producer[];
  }>({ parts: [], models: [], producers: [] });

  // Filter states
  const [selectedProducer, setSelectedProducer] = useState<string>('all');
  const [selectedEngine, setSelectedEngine] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [showAllParts, setShowAllParts] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<CarPart | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Car model details modal states
  const [showModelDetails, setShowModelDetails] = useState(false);
  const [selectedModelDetails, setSelectedModelDetails] = useState<CarModel | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // ChatBot states
  const [showChatBot, setShowChatBot] = useState(false);

  // Privacy Policy modal states
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // State for brands
  const [brands, setBrands] = useState<Brand[]>([]);

  // Get unique values for filters
  const uniqueProducers = Array.from(new Set(featuredParts.map(part => part.producer?.name).filter(Boolean)));
  const uniqueEngines = Array.from(new Set(featuredParts.map(part => part.model?.engine).filter((engine): engine is string => Boolean(engine && engine !== 'Not specified'))));
  
  // Get models based on selected producer (cascading filter)
  const getModelsForSelectedProducer = () => {
    if (selectedProducer === 'all' || !selectedProducer) {
      // If no producer is selected, show all models
      return Array.from(new Set(featuredParts.map(part => part.model?.name).filter(Boolean)));
    } else {
      // If a producer is selected, show only models from that producer
      return Array.from(new Set(
        featuredParts
          .filter(part => part.producer?.name === selectedProducer)
          .map(part => part.model?.name)
          .filter(Boolean)
      ));
    }
  };
  
  const availableModels = getModelsForSelectedProducer();

  // Filtered parts based on selected filters and search query
  const filteredParts = featuredParts.filter(part => {
    // Search query filter
    const searchMatch = !searchQuery.trim() || 
      part.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      part.brand.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      part.category.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      part.producer?.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      part.model?.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    
    // Filter dropdowns
    const producerMatch = !selectedProducer || selectedProducer === 'all' || part.producer?.name === selectedProducer;
    const engineMatch = !selectedEngine || selectedEngine === 'all' || (part.model?.engine && part.model.engine !== 'Not specified' && part.model.engine === selectedEngine);
    const modelMatch = !selectedModel || selectedModel === 'all' || part.model?.name === selectedModel;
    
    return searchMatch && producerMatch && engineMatch && modelMatch;
  });

  // Filtered parts for the current partner (if logged in as partner)
  const partnerParts = user && user.role === 'PARTNER'
    ? filteredParts.filter(part => part.producer && part.producer._id === user._id)
    : filteredParts;

  // Clear all filters
  const clearFilters = () => {
    setSelectedProducer('all');
    setSelectedEngine('all');
    setSelectedModel('all');
    setSearchQuery('');
    setIsSearchActive(false);
    setFilteredResults({ parts: [], models: [], producers: [] });
  };

  // Handle producer change - reset model selection
  const handleProducerChange = (producer: string) => {
    setSelectedProducer(producer);
    // Reset model selection when producer changes
    setSelectedModel('all');
  };

  // Check if any filters are active
  const hasActiveFilters = (selectedProducer && selectedProducer !== 'all') || (selectedEngine && selectedEngine !== 'all') || (selectedModel && selectedModel !== 'all') || searchQuery.trim();

  // Clear search function
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredResults({ parts: [], models: [], producers: [] });
    setIsSearchActive(false);
    setShowSuggestions(false);
  };

  // Debug: Log the filtering results
  console.log('Filtering debug:', {
    totalParts: featuredParts.length,
    filteredParts: filteredParts.length,
    selectedProducer,
    selectedEngine,
    selectedModel,
    hasActiveFilters
  });

  // Debug: Log selected values for filter inputs
  console.log('Selected filter values:', {
    selectedProducer,
    selectedEngine,
    selectedModel
  });

  // Debug: Log engine data
  console.log('Engine data debug:', {
    uniqueEngines,
    samplePartWithEngine: featuredParts.length > 0 ? {
      partName: featuredParts[0].name,
      modelName: featuredParts[0].model?.name,
      modelEngine: featuredParts[0].model?.engine
    } : null
  });

  // Move fetchPartnerContent outside useEffect so it can be called by the Refresh button
  const fetchPartnerContent = async () => {
    setLoading(true);
    try {
      console.log('Fetching featured car parts from:', `${API_BASE_URL}/carparts/featured`);
      
      // Fetch featured car parts for homepage
      console.log('Making API call to:', `${API_BASE_URL}/carparts/featured`);
      const partsResponse = await axios.get<CarPart[]>(`${API_BASE_URL}/carparts/featured`);
      console.log('Featured car parts response:', partsResponse.data);
      console.log('Total featured car parts found:', partsResponse.data.length);
      console.log('Response status:', partsResponse.status);
      
      // Debug: Check the structure of the first car part
      if (partsResponse.data.length > 0) {
        const firstPart = partsResponse.data[0];
        console.log('First featured car part structure:', {
          _id: firstPart._id,
          name: firstPart.name,
          producer: firstPart.producer,
          model: firstPart.model,
          producerType: typeof firstPart.producer,
          modelType: typeof firstPart.model,
          producerName: firstPart.producer?.name,
          modelName: firstPart.model?.name
        });
      }
      
      // Debug: Log each part to see the structure
      if (partsResponse.data.length > 0) {
        console.log('Sample featured car part structure:', partsResponse.data[0]);
        console.log('Sample featured car part imageUrl:', partsResponse.data[0].imageUrl);
        console.log('Sample featured car part imageFilename:', partsResponse.data[0].imageFilename);
        console.log('All featured car parts:', partsResponse.data);
      } else {
        console.log('No featured car parts found in database');
      }
      
      // Set featured parts
      setFeaturedParts(partsResponse.data);
      console.log('featuredParts set with length:', partsResponse.data.length);
      
      // Fetch all car parts for categories section (not just featured)
      const categoriesResponse = await axios.get<CarPart[]>(`${API_BASE_URL}/carparts`);
      setCategoriesData(categoriesResponse.data);

      // Fetch car models (handle missing endpoint gracefully)
      try {
        const modelsResponse = await axios.get<CarModel[]>(`${API_BASE_URL}/models`);
        console.log('Car models response:', modelsResponse.data);
        setPopularModels(modelsResponse.data.slice(0, 8));
      } catch (error) {
        console.log('Car models endpoint not available, using empty array');
        setPopularModels([]);
      }

      // Fetch producers (handle missing endpoint gracefully)
      try {
        const producersResponse = await axios.get<Producer[]>(`${API_BASE_URL}/producers`);
        console.log('Producers response:', producersResponse.data);
        setTopProducers(producersResponse.data.filter(p => p.name && p.name.trim().toLowerCase() !== 'dacia').slice(0, 6));
      } catch (error) {
        console.log('Producers endpoint not available, using empty array');
        setTopProducers([]);
      }

    } catch (error: any) {
      console.error("Failed to fetch partner content:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      console.error("Full error object:", error);
      toast.error('Failed to Load Content', {
        description: 'Some content may not be available. Please try again later.',
        duration: 6000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('HomePage useEffect triggered');
    fetchPartnerContent();
  }, []);

  // Debug useEffect to monitor featuredParts state
  useEffect(() => {
    console.log('featuredParts state changed:', featuredParts);
    console.log('featuredParts length:', featuredParts.length);
    if (featuredParts.length > 0) {
      console.log('First featured part:', featuredParts[0]);
    }
  }, [featuredParts]);

  // Fetch brands on mount
  useEffect(() => {
    axios.get(`${API_BASE_URL}/brands`).then(res => {
      setBrands(res.data);
    }).catch(() => setBrands([]));
  }, []);


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
    setSelectedPart(part);
    setShowPaymentModal(true);
  };

  const handlePaymentInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPart) return;

    // Validate payment data
    if (!paymentData.cardNumber || !paymentData.cardHolder || !paymentData.expiryDate || !paymentData.cvv) {
      toast.error('Payment Error', {
        description: 'Please fill in all payment fields.',
        duration: 4000
      });
      return;
    }

    try {
      // Simulate payment success
      toast.success('Payment Successful!', {
        description: `Your order for ${selectedPart.name} has been processed successfully.`,
        duration: 5000
      });

      // Record the sale in backend
      try {
        await axios.post('http://localhost:5000/api/sales', {
          partId: selectedPart._id,
          buyerId: user?._id,
          partnerId: selectedPart.producer?._id,
          price: selectedPart.price
        });
      } catch (saleError) {
        console.error('Failed to record sale:', saleError);
        toast.error('Sale not recorded', { description: 'Could not record sale in backend.' });
      }

      setShowPaymentModal(false);
      setSelectedPart(null);
      setPaymentData({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
      });
    } catch (error) {
      toast.error('Payment Failed', {
        description: 'There was an error processing your payment. Please try again.',
        duration: 4000
      });
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
      
      setIsSearchActive(true);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(false);
      setFilteredResults({ parts: [], models: [], producers: [] });
      setIsSearchActive(false);
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
      setIsSearchActive(false);
    }
  };

  const handleSuggestionClick = (type: 'part' | 'model' | 'producer', item: any) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
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

  const handleModelCardClick = (model: CarModel) => {
    setSelectedModelDetails(model);
    setShowModelDetails(true);
  };

  // Helper to get image path for a part type
  const getPartImage = (type: string) => {
    // Remove all spaces and dots
    const normalized = type.replace(/[. ]/g, '');
    const fileName = `${normalized}.png`;
    try {
      return new URL(`../../assets/parts/${fileName}`, import.meta.url).href;
    } catch {
      return 'https://placehold.co/80x80/E0E0E0/333333?text=No+Image';
    }
  };
  // Remove the hardcoded partTypeOptions array
  // Dynamically generate partTypeOptions from assets/parts images
  function getPartTypesFromAssets() {
    // List of filenames from assets/parts (update this if new images are added)
    const filenames = [
      'Tires.png',
      'Brakes.png',
      'Filters.png',
      'Electrics.png',
      'Depreciations.png',
      'CoolingSystem.png',
      'ExhustSystem.png',
      'SealingRings.png',
      'Accessories.png',
      'Connections.png',
      'RepairSet.png',
      'Illuminated.png',
      'Bearings.png',
      'AIRsystem.png',
      'Gearbox.png',
      'Planetryjoint.png',
    ];
    // Convert filenames to display names (remove extension, remove dots, split camel case, capitalize)
    return filenames.map(f => {
      const name = f.replace(/\.[^.]+$/, '')
        .replace(/([a-z])([A-Z])/g, '$1 $2') // split camel case
        .replace(/([A-Z]+)/g, ' $1') // split consecutive capitals
        .replace(/\s+/g, ' ') // collapse spaces
        .replace(/^\s+|\s+$/g, '');
      return name.charAt(0).toUpperCase() + name.slice(1);
    });
  }
  const partTypeOptions = getPartTypesFromAssets();

  const [selectedType, setSelectedType] = useState<string>('all');
  const getBrandsForType = (type: string) => {
    return Array.from(new Set(categoriesData.filter((p: CarPart) => p.category === type && p.brand).map((p: CarPart) => p.brand)));
  };
  const filteredTopSales = selectedType === 'all' ? categoriesData.slice(0, 8) : categoriesData.filter((p) => p.category === selectedType).slice(0, 8);

  // Add a filteredPartsByType variable for the selected part type
  const filteredPartsByType = selectedType === 'all'
    ? categoriesData
    : categoriesData.filter((part) => {
        // Normalize both category and selectedType for comparison
        const normalize = (str: string) => str.replace(/[.]/g, ' ').trim().toLowerCase();
        return normalize(part.category) === normalize(selectedType);
      });


  // Debug logging before render
  console.log('HomePage render - loading:', loading, 'featuredParts.length:', featuredParts.length);
  console.log('HomePage component is rendering!');
  console.log('featuredParts data:', featuredParts);

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
              {/* Removed the text 'L'Afiray.ma' and subtitle */}
            </div>
            {/* NAV BUTTONS + MODE TOGGLE */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
              {/* Mode Toggle in Nav */}
              <div className="ml-2">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-purple-100 dark:bg-black text-black dark:text-white py-16 px-6 sm:px-12 lg:px-24 relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-black dark:text-white">Find Your Perfect Auto Parts</h2>
          <p className="text-xl md:text-2xl mb-8 text-black dark:text-white">Quality parts from trusted partners across Morocco</p>
          
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
                  className="w-full bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white px-4 py-3 text-lg rounded-lg"
                  autoComplete="off"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleSearch} 
                variant="outline"
                className="bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-gray-800 dark:hover:text-white transition-colors font-semibold text-lg px-8 py-3 rounded-lg shadow-sm"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute z-20 mt-2 w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm max-h-80 overflow-y-auto transition-all">
                {/* Car Parts */}
                {suggestions.parts.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Package className="w-4 h-4" /> Car Parts
                    </div>
                    {suggestions.parts.map((part) => (
                      <div
                        key={part._id}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onMouseDown={() => handleSuggestionClick('part', part)}
                      >
                        <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium text-black dark:text-white">{part.name}</span>
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
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onMouseDown={() => handleSuggestionClick('model', model)}
                      >
                        <Car className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium text-black dark:text-white">{model.name}</span>
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
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onMouseDown={() => handleSuggestionClick('producer', producer)}
                      >
                        <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium text-black dark:text-white">{producer.name}</span>
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

      {/* Part Type Cards above Top Sales */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 mb-8">
        <h3 className="text-3xl font-bold mb-6 text-black dark:text-white text-center">Category</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {partTypeOptions.map((type) => (
            <div
              key={type}
              className={`flex flex-col items-center cursor-pointer border border-black dark:border-white rounded-xl p-4 bg-white dark:bg-black shadow-sm hover:shadow-lg transition-all w-32 h-40 ${selectedType === type ? 'ring-2 ring-black dark:ring-white' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              <img
                src={getPartImage(type)}
                alt={type}
                className="w-16 h-16 object-contain mb-2"
              />
              <span className="font-semibold text-black dark:text-white text-center text-sm">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Display filtered parts by selected type */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 mb-12">
        <h3 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">
          {selectedType === 'all' ? 'All Car Parts' : `${selectedType} Parts`}
        </h3>
        {selectedType !== 'all' && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => setSelectedType('all')}
              className="bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-2 rounded-lg font-semibold"
            >
              ← Back
            </Button>
          </div>
        )}
        {filteredPartsByType.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center text-gray-500 dark:text-gray-400 italic mb-4">
              No parts found for this category.
            </div>
            <Button
              onClick={() => setSelectedType('all')}
              className="bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-2 rounded-lg font-semibold"
            >
              ← Back to Categories
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPartsByType.map((part) => (
              <Card key={part._id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center shadow-md">
                <img src={part.imageUrl} alt={part.name} className="w-32 h-32 object-cover rounded mb-3 border border-gray-300 dark:border-gray-600" />
                <div className="w-full flex flex-col items-center">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">{part.name}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Brand: {part.brand}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Model: {part.model?.name || 'Unknown'}</div>
                  <div className="text-base font-semibold text-black dark:text-white mb-1">{part.price} DH</div>
                  <Button
                    onClick={() => handleBuyClick(part)}
                    className="mt-2 bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors text-sm font-semibold"
                  >
                    Buy
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Top Producers Section */}
      <section className="py-16 bg-white dark:bg-black px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-black dark:text-white">
              {isSearchActive ? 'Matching Producers' : 'Trusted Producers'}
            </h3>
            <p className="text-black dark:text-white text-lg">
              {isSearchActive 
                ? `Found ${filteredResults.producers.length} producer${filteredResults.producers.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : 'Quality brands you can rely on'
              }
            </p>
          </div>
          
          {(isSearchActive ? filteredResults.producers : topProducers).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {(isSearchActive ? filteredResults.producers : topProducers).map((producer) => (
                <div key={producer._id} className="bg-white dark:bg-black rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600 overflow-hidden">
                    {producer.imageUrl ? (
                      <img
                        src={getImageUrl(producer.imageUrl, producer.imageFilename, '')}
                        alt={producer.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className={`text-2xl font-bold text-black dark:text-white ${producer.imageUrl ? 'hidden' : ''}`}>
                      {producer.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">{producer.name}</h4>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              {isSearchActive ? (
                <p className="text-black dark:text-white text-lg">No producers found for "{searchQuery}".</p>
              ) : (
                <p className="text-black dark:text-white text-lg">No producers available yet.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-100 dark:bg-black text-black dark:text-white px-6 sm:px-12 lg:px-24 relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 text-center relative z-10">
          <h3 className="text-3xl font-bold mb-4 text-black dark:text-white">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-black dark:text-white">Join thousands of customers who trust L'Afiray.ma for their auto parts needs</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-lg px-8 py-4 rounded-lg shadow-sm"
              size="lg"
            >
              Create Account
            </Button>
            <Button
              onClick={() => navigate('/parts-catalog')}
              variant="outline"
              className="bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-gray-800 dark:hover:text-white transition-colors text-lg px-8 py-4 rounded-lg shadow-sm"
              size="lg"
            >
              Browse Parts
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-100 dark:bg-black text-black dark:text-white py-8 px-6 sm:px-12 lg:px-24 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center">
            {/* Removed the text 'L'Afiray.ma' and subtitle */}
            
            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mb-6">
              <a 
                href="#" 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                title="Follow us on X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-sm font-medium">X</span>
              </a>
              
              <a 
                href="#" 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                title="Follow us on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </a>
              
              <a 
                href="#" 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                title="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm font-medium">Instagram</span>
              </a>
              
              <a 
                href="#" 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                title="Follow us on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-black dark:text-white">
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
            <span className="block w-full text-center text-xs text-gray-600 dark:text-gray-500 mt-2">
              L'Afiray.ma is Morocco's trusted online marketplace for car parts. We connect buyers and partners for quality, affordable auto parts with a seamless experience.
            </span>
          </div>
        </div>
      </footer>

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
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Search & Filter</h3>
                <p className="text-black dark:text-white text-sm leading-relaxed">
                  Use the search bar at the top to find specific car parts by name, brand, or description. 
                  Use the filter dropdowns to narrow down results by car producer, engine type, or car model.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-600">
                  <span className="text-3xl font-bold text-black dark:text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Browse Parts</h3>
                <p className="text-black dark:text-white text-sm leading-relaxed">
                  Explore the available auto parts displayed in cards. Each card shows the part name, 
                  description, brand, category, price, and producer information.
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
                <li>• <strong>Dark/Light Mode:</strong> Toggle between themes using the button in the header</li>
                <li>• <strong>Popular Models:</strong> Browse car models to find compatible parts</li>
                <li>• <strong>Social Media:</strong> Follow us for updates and news</li>
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

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 max-w-md shadow-sm">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </DialogTitle>
            <DialogDescription className="text-black dark:text-white">
              Complete your purchase for {selectedPart?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPart && (
            <Card className="bg-black dark:bg-white border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white dark:text-black">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white dark:text-black">Item:</span>
                  <span className="text-white dark:text-black font-medium">{selectedPart.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white dark:text-black">Brand:</span>
                  <span className="text-white dark:text-black">{selectedPart.brand}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white dark:text-black">Category:</span>
                  <span className="text-white dark:text-black">{selectedPart.category}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600 dark:border-gray-300">
                  <span className="text-white dark:text-black">Total:</span>
                  <span className="text-white dark:text-black">{selectedPart.price} DH</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Card Number
              </label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
                className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-600"
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Expiry Date
                </label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => handlePaymentInputChange('expiryDate', e.target.value)}
                  className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-600"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  CVV
                </label>
                <Input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => handlePaymentInputChange('cvv', e.target.value)}
                  className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-600"
                  maxLength={4}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Cardholder Name
              </label>
              <Input
                type="text"
                placeholder="Name and Last Name"
                value={paymentData.cardHolder}
                onChange={(e) => handlePaymentInputChange('cardHolder', e.target.value)}
                className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              className="border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Pay {selectedPart?.price} DH
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Car Model Details Modal */}
      <Dialog open={showModelDetails} onOpenChange={setShowModelDetails}>
        <DialogContent className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 max-w-md shadow-sm">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white flex items-center gap-2">
              <Car className="w-5 h-5" />
              Car Model Details
            </DialogTitle>
            <DialogDescription className="text-black dark:text-white">
              Information about this car model
            </DialogDescription>
          </DialogHeader>
          
          {selectedModelDetails && (
            <div className="space-y-4">
              <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-black dark:text-white">{selectedModelDetails.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black dark:text-white">Producer:</span>
                    <span className="text-sm text-black dark:text-white">{selectedModelDetails.producer?.name}</span>
                  </div>
                  {selectedModelDetails.engine && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-black dark:text-white">Engine Type:</span>
                      <span className="text-sm text-black dark:text-white">{selectedModelDetails.engine}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black dark:text-white">Model ID:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{selectedModelDetails._id}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-black dark:text-white mb-2">Available Parts</h4>
                <p className="text-sm text-black dark:text-white">
                  This car model has compatible parts available in our catalog. 
                  Use the search filters to find specific parts for this model.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowModelDetails(false)}
              className="border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowModelDetails(false);
                navigate('/parts-catalog');
              }}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Browse Parts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ChatBot */}
      <ChatBot 
        isOpen={showChatBot} 
        onToggle={() => setShowChatBot(!showChatBot)} 
      />
      
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
                <strong>Effective Date: February 10, 2025</strong>
              </p>
              <p>
                L'Afiray.ma values your privacy. We collect only the information necessary to provide our services, such as your name, contact details, and order information. We do not sell your data to third parties. Your information is used solely to improve your experience and fulfill your orders.
              </p>
              <p>
                By using our platform, you agree to our collection and use of information as described in this policy. For questions, contact us at lafirayservice@gmail.com.
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
                Thank you for choosing us. For inquiries, partnerships, or support, contact us at lafirayservice@gmail.com.
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
    </div>
  );
};

export default HomePage;