import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom'; // Keep useLocation if needed for conditional rendering based on path

// Import the sub-components
import ProducerForm from '@/features/partner/ProducerForm';
import CarModelForm from '@/features/partner/CarModelForm';
import CarPartForm from '@/features/partner/CarPartForm';
import ProducerList from '@/features/partner/ProducerList';

// Define interfaces for your data structures
interface Producer {
  _id: string;
  name: string;
}

interface CarModel {
  _id: string;
  name: string;
  producer: string | { _id: string; name: string };
}

interface CarPart {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  brand: string;
  category: string;
  producer: string;
  model: string;
}

// Base URL for backend API
const API_BASE_URL = 'http://localhost:5000/api';

const PartnerListingsPage: React.FC = () => {
  const location = useLocation(); // Retain useLocation if this page might be used in different paths (e.g., Admin)

  // State for managing car producers, models, and nested parts
  const [producers, setProducers] = useState<Producer[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [carParts, setCarParts] = useState<CarPart[]>([]);

  // States for form selections (managed here and passed down)
  const [selectedProducerIdForModel, setSelectedProducerIdForModel] = useState<string>('');
  const [selectedProducerIdForPart, setSelectedProducerIdForPart] = useState<string>('');
  const [selectedModelIdForPart, setSelectedModelIdForPart] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const notify = (title: string, description?: string, variant: 'default' | 'destructive' = 'default') => {
    if (variant === 'destructive') {
      toast.error(title, { description: description, duration: 4000 });
    } else {
      toast.success(title, { description: description, duration: 4000 });
    }
  };

  // --- API Fetching Functions (Memoized with useCallback) ---
  const getProducers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<Producer[]>(`${API_BASE_URL}/producers`);
      setProducers(response.data);
      if (response.data.length > 0) {
        if (!selectedProducerIdForModel || !response.data.some(p => p._id === selectedProducerIdForModel)) {
          setSelectedProducerIdForModel(response.data[0]._id);
        }
        if (!selectedProducerIdForPart || !response.data.some(p => p._id === selectedProducerIdForPart)) {
          setSelectedProducerIdForPart(response.data[0]._id);
        }
      } else {
        setSelectedProducerIdForModel('');
        setSelectedProducerIdForPart('');
      }
    } catch (error: any) {
      notify('Error', `Error fetching producers: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [selectedProducerIdForModel, selectedProducerIdForPart]);

  const getModels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<CarModel[]>(`${API_BASE_URL}/models`);
      setCarModels(response.data);
      const modelsForCurrentProducer = response.data.filter(model => {
        const producerId = typeof model.producer === 'string' ? model.producer : model.producer._id;
        return producerId === selectedProducerIdForPart;
      });
      if (modelsForCurrentProducer.length > 0) {
        if (!selectedModelIdForPart || !modelsForCurrentProducer.some(m => m._id === selectedModelIdForPart)) {
          setSelectedModelIdForPart(modelsForCurrentProducer[0]._id);
        }
      } else {
        setSelectedModelIdForPart('');
      }
    } catch (error: any) {
      notify('Error', `Error fetching models: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [selectedProducerIdForPart, selectedModelIdForPart]);

  const getParts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<CarPart[]>(`${API_BASE_URL}/carparts`);
      setCarParts(response.data);
    } catch (error: any) {
      notify('Error', `Error fetching parts: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch data when this component mounts or location changes (if needed for admin view)
    getProducers();
    getModels();
    getParts();
  }, [getProducers, getModels, getParts]);

  useEffect(() => {
    const modelsForCurrentProducer = carModels.filter(model => {
      const producerId = typeof model.producer === 'string' ? model.producer : model.producer._id;
      return producerId === selectedProducerIdForPart;
    });
    if (modelsForCurrentProducer.length > 0) {
      if (!selectedModelIdForPart || !modelsForCurrentProducer.some(m => m._id === selectedModelIdForPart)) {
        setSelectedModelIdForPart(modelsForCurrentProducer[0]._id);
      }
    } else {
      setSelectedModelIdForPart('');
    }
  }, [selectedProducerIdForPart, carModels]);


  // --- CRUD Handlers (Memoized with useCallback) ---

  const addProducer = useCallback(async (name: string) => {
    if (name.trim() === '') {
      notify('Input Error', 'Producer name cannot be empty!', 'destructive');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post<Producer>(`${API_BASE_URL}/producers`, { name: name.trim() });
      notify('Success!', `Producer "${response.data.name}" added successfully!`);
      getProducers();
    } catch (error: any) {
      notify('Error', `Error adding producer: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getProducers, notify]);

  const addModel = useCallback(async (modelName: string, producerId: string) => {
    if (modelName.trim() === '' || producerId === '') {
      notify('Input Error', 'Please select a producer and enter a car model name.', 'destructive');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post<CarModel>(`${API_BASE_URL}/models`, {
        name: modelName.trim(),
        producer: producerId,
      });
      notify('Success!', `Model "${response.data.name}" added successfully!`);
      getModels();
    } catch (error: any) {
      notify('Error', `Error adding model: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getModels, notify]);

  const addPart = useCallback(async (partData: {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    brand: string;
    category: string;
    producer: string;
    model: string;
  }) => {
    if (partData.name.trim() === '' || partData.imageUrl.trim() === '' || partData.model === '' || !partData.price || partData.category.trim() === '') {
      notify('Input Error', 'Please fill all part fields and select a model.', 'destructive');
      return;
    }
    if (isNaN(partData.price) || partData.price < 0) {
        notify('Input Error', 'Price must be a valid non-negative number.', 'destructive');
        return;
    }

    setLoading(true);
    try {
      const response = await axios.post<CarPart>(`${API_BASE_URL}/carparts`, partData);
      notify('Success!', `Part "${response.data.name}" added successfully!`);
      getParts();
    } catch (error: any) {
      notify('Error', `Error adding part: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getParts, notify]);

  const deleteProducer = useCallback(async (producerId: string, producerName: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/producers/${producerId}`);
      notify('Success!', `Producer "${producerName}" and its models/parts deleted successfully!`);
      getProducers();
      getModels();
      getParts();
    } catch (error: any) {
      notify('Error', `Error deleting producer: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getProducers, getModels, getParts, notify]);

  const deleteModel = useCallback(async (modelId: string, modelName: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/models/${modelId}`);
      notify('Success!', `Model "${modelName}" and its parts deleted successfully!`);
      getModels();
    } catch (error: any) {
      notify('Error', `Error deleting model: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getModels, getParts, notify]);

  const deletePart = useCallback(async (partId: string, partName: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/carparts/${partId}`);
      notify('Success!', `Part "${partName}" deleted successfully!`);
      getParts();
    } catch (error: any) {
      notify('Error', `Error deleting part: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getParts, notify]);

  return (
    <div className="container mx-auto max-w-4xl bg-white dark:bg-black p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:shadow-3xl">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 leading-tight tracking-tight">
        Partner Car Management
      </h1>

      {loading && (
        <div className="flex items-center justify-center text-blue-600 text-lg font-medium space-x-2 animate-pulse">
          <span>Loading... Please wait.</span>
        </div>
      )}

      <ProducerForm onAddProducer={addProducer} loading={loading} />

      <CarModelForm
        producers={producers}
        onAddModel={addModel}
        loading={loading}
        selectedProducerIdForModel={selectedProducerIdForModel}
        setSelectedProducerIdForModel={setSelectedProducerIdForModel}
      />

      <CarPartForm
        producers={producers}
        carModels={carModels}
        onAddPart={addPart}
        loading={loading}
        selectedProducerIdForPart={selectedProducerIdForPart}
        setSelectedProducerIdForPart={setSelectedProducerIdForPart}
        selectedModelIdForPart={selectedModelIdForPart}
        setSelectedModelIdForPart={setSelectedModelIdForPart}
      />

      <ProducerList
        producers={producers}
        carModels={carModels}
        carParts={carParts}
        onDeleteProducer={deleteProducer}
        onDeleteModel={deleteModel}
        onDeletePart={deletePart}
        loading={loading}
      />
    </div>
  );
};

export default PartnerListingsPage;
