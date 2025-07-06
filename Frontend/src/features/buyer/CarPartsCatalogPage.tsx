import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getImageUrl, handleImageError } from '@/lib/imageUtils';
import { Search, Filter, X } from 'lucide-react';

// Define interfaces for your data structures
interface CarPart {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageFilename?: string;
  price: number;
  brand: string;
  category: string;
  producer: { _id: string; name: string; }; // Populated producer
  model: { _id: string; name: string; }; // Populated model
}

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend server's address

const CarPartsCatalogPage: React.FC = () => {
  const [carParts, setCarParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProducer, setSelectedProducer] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Get unique values for filters
  const uniqueCategories = Array.from(new Set(carParts.map(part => part.category).filter(Boolean)));
  const uniqueProducers = Array.from(new Set(carParts.map(part => part.producer?.name).filter(Boolean)));
  const uniqueBrands = Array.from(new Set(carParts.map(part => part.brand).filter(Boolean)));

  // Filtered parts based on selected filters
  const filteredParts = carParts.filter(part => {
    const searchMatch = !searchQuery || 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.producer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.model?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryMatch = selectedCategory === 'all' || part.category === selectedCategory;
    const producerMatch = selectedProducer === 'all' || part.producer?.name === selectedProducer;
    const brandMatch = selectedBrand === 'all' || part.brand === selectedBrand;

    let priceMatch = true;
    if (priceRange !== 'all') {
      const price = part.price;
      switch (priceRange) {
        case '0-100':
          priceMatch = price >= 0 && price <= 100;
          break;
        case '100-500':
          priceMatch = price > 100 && price <= 500;
          break;
        case '500-1000':
          priceMatch = price > 500 && price <= 1000;
          break;
        case '1000+':
          priceMatch = price > 1000;
          break;
      }
    }

    return searchMatch && categoryMatch && producerMatch && brandMatch && priceMatch;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedProducer('all');
    setSelectedBrand('all');
    setPriceRange('all');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || 
    selectedCategory !== 'all' || 
    selectedProducer !== 'all' || 
    selectedBrand !== 'all' || 
    priceRange !== 'all';

  useEffect(() => {
    const fetchCarParts = async () => {
      setLoading(true);
      setError(null);
      try {
        // This endpoint is now public, so no auth header is strictly needed for GET
        const response = await axios.get<CarPart[]>(`${API_BASE_URL}/carparts`);
        setCarParts(response.data);
      } catch (err: any) {
        console.error("Failed to fetch car parts:", err);
        setError(err.response?.data?.message || "Failed to load car parts.");
        toast.error("Failed to load car parts", { description: err.response?.data?.message || "Please try again later." });
      } finally {
        setLoading(false);
      }
    };

    fetchCarParts();
  }, []);

  const handleBuyClick = (partName: string) => {
    if (!isAuthenticated) {
      toast.info("Login Required", { description: `Please log in to purchase "${partName}".` });
      navigate('/login');
    } else {
      // Logic to add to cart or proceed to checkout
      toast.success("Item Added", { description: `"${partName}" added to your cart (placeholder action).` });
      // In a real application, you would add the item to a cart state/context
      // and potentially redirect to a checkout page or show a cart modal.
      console.log(`User is authenticated. Proceeding to buy ${partName}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
        <p>Loading car parts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-red-500 dark:text-red-400">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (carParts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Browse Car Parts</h2>
        <p className="text-center text-gray-700 dark:text-gray-300">
          No car parts are available at the moment. Please check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <div className="mb-4 flex justify-start sticky top-0 z-20 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 py-2" style={{ borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}>
        <Button
          onClick={() => navigate('/')}
          className="bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          variant="outline"
        >
          ← Back Home
        </Button>
      </div>
      
      <h2 className="text-3xl font-bold mb-6 text-center">Available Car Parts</h2>
      
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search parts, brands, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
          />
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="bg-transparent border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Filter Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredParts.length} of {carParts.length} parts
          {hasActiveFilters && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              (filtered)
            </span>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white dark:bg-zinc-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Producer Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">Producer</label>
              <Select value={selectedProducer} onValueChange={setSelectedProducer}>
                <SelectTrigger className="bg-white dark:bg-zinc-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                  <SelectValue placeholder="All Producers" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                  <SelectItem value="all">All Producers</SelectItem>
                  {uniqueProducers.map((producer) => (
                    <SelectItem key={producer} value={producer}>
                      {producer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">Brand</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="bg-white dark:bg-zinc-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                  <SelectItem value="all">All Brands</SelectItem>
                  {uniqueBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">Price Range</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-white dark:bg-zinc-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-100">0 - 100 DH</SelectItem>
                  <SelectItem value="100-500">100 - 500 DH</SelectItem>
                  <SelectItem value="500-1000">500 - 1000 DH</SelectItem>
                  <SelectItem value="1000+">1000+ DH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredParts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">No parts found matching your filters.</p>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredParts.map((part, index) => (
            <div key={part._id} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 p-2 flex flex-col h-80 w-full">
              <img
                src={getImageUrl(part.imageUrl, part.imageFilename, 'https://placehold.co/300x200/E0E0E0/333333?text=No+Image')}
                alt={part.name}
                className="w-full h-32 object-cover rounded-md mb-2"
                onError={handleImageError}
              />
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-1 line-clamp-2">{part.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-xs mb-2 flex-grow line-clamp-2">{part.description || 'No description provided.'}</p>
                <div className="space-y-1 mb-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Brand:</span> {part.brand || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Category:</span> {part.category || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Producer:</span> {part.producer?.name || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Model:</span> {part.model?.name || 'N/A'}
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
                    {part.price?.toFixed(2)} DH
                  </div>
                  <Button
                    onClick={() => handleBuyClick(part.name)}
                    className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity py-2 text-sm"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarPartsCatalogPage;
