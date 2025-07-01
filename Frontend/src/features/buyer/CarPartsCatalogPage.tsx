import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

// Define interfaces for your data structures
interface CarPart {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCarParts = async () => {
      setLoading(true);
      setError(null);
      try {
        // This endpoint is now public, so no auth header is strictly needed for GET
        const response = await axios.get<CarPart[]>(`${API_BASE_URL}/carparts`);
        setCarParts(response.data);
        toast.success("Car parts loaded successfully!");
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
      <h2 className="text-3xl font-bold mb-6 text-center">Available Car Parts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {carParts.map((part) => (
          <div key={part._id} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
            <img
              src={part.imageUrl || 'https://placehold.co/300x200/E0E0E0/333333?text=No+Image'}
              alt={part.name}
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/300x200/E0E0E0/333333?text=Image+Error'; }}
            />
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{part.name}</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 flex-grow">{part.description || 'No description provided.'}</p>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium">Brand:</span> {part.brand || 'N/A'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium">Category:</span> {part.category || 'N/A'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium">Producer:</span> {part.producer?.name || 'N/A'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span className="font-medium">Car Model:</span> {part.model?.name || 'N/A'}
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
              {part.price?.toFixed(2)} €
            </div>
            <Button
              onClick={() => handleBuyClick(part.name)}
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity mt-auto"
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarPartsCatalogPage;
