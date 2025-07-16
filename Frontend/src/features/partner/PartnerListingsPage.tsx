import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom'; // Keep useLocation if needed for conditional rendering based on path
import { useAuth } from '@/context/AuthContext';

// Import the sub-components
import ProducerForm from '@/features/partner/ProducerForm';
import CarModelForm from '@/features/partner/CarModelForm';
import CarPartForm from '@/features/partner/CarPartForm';
import ApprovalPendingBanner from '@/components/ApprovalPendingBanner';

// Define interfaces for your data structures
interface Producer {
  _id: string;
  name: string;
  imageUrl?: string;
  imageFilename?: string;
  createdBy?: string;
}

interface CarModel {
  _id: string;
  name: string;
  engine?: string;
  producer: string | { _id: string; name: string };
}

interface CarPart {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageFilename?: string;
  price: number;
  brand: string;
  category: string;
  producer: string;
  model: string;
  isFeatured?: boolean; // Added isFeatured field
}

// Brand interface
interface Brand {
  _id: string;
  name: string;
  imageUrl?: string;
  imageFilename?: string;
  createdBy?: string;
}

// Base URL for backend API
const API_BASE_URL = 'http://localhost:5000/api';

const PartnerListingsPage: React.FC = () => {
  const location = useLocation(); // Retain useLocation if this page might be used in different paths (e.g., Moderator)
  const { user, token } = useAuth();

  // State for managing car producers, models, and nested parts
  const [producers, setProducers] = useState<Producer[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [carParts, setCarParts] = useState<CarPart[]>([]);

  // States for form selections (managed here and passed down)
  const [selectedProducerIdForModel, setSelectedProducerIdForModel] = useState<string>('');
  const [selectedProducerIdForPart, setSelectedProducerIdForPart] = useState<string>('');
  const [selectedModelIdForPart, setSelectedModelIdForPart] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [editingPart, setEditingPart] = useState<CarPart | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    model: '',
    imageFile: null as File | null,
    imagePreview: '',
  });

  // State for brands
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandImage, setNewBrandImage] = useState<File | null>(null);
  const [brandImagePreview, setBrandImagePreview] = useState<string | null>(null);

  // Prefill edit form when editingPart changes
  React.useEffect(() => {
    if (editingPart) {
      setEditForm({
        name: editingPart.name || '',
        description: editingPart.description || '',
        price: editingPart.price?.toString() || '',
        brand: editingPart.brand || '',
        model: editingPart.model || '',
        imageFile: null,
        imagePreview: editingPart.imageUrl || '',
      });
    }
  }, [editingPart]);

  const handleEditInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    }
  };

  const handleEditSave = async () => {
    if (!editingPart) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editForm.name.trim());
      formData.append('description', editForm.description.trim());
      formData.append('price', editForm.price);
      formData.append('brand', editForm.brand.trim());
      formData.append('model', editForm.model);
      if (editForm.imageFile) {
        formData.append('imageFile', editForm.imageFile);
      }
      await authAxios.put(`/carparts/${editingPart._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      notify('Success!', 'Car part updated successfully!');
      setEditingPart(null);
      getParts();
    } catch (error: any) {
      notify('Error', error.response?.data?.message || error.message, 'destructive');
    } finally {
      setLoading(false);
    }
  };

  const notify = (title: string, description?: string, variant: 'default' | 'destructive' = 'default') => {
    if (variant === 'destructive') {
      toast.error(title, { description: description, duration: 4000 });
    } else {
      toast.success(title, { description: description, duration: 4000 });
    }
  };

  // Create axios instance with authentication
  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Update authAxios headers when token changes
  useEffect(() => {
    if (token) {
      authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete authAxios.defaults.headers.common['Authorization'];
    }
  }, [token, authAxios]);

  // --- API Fetching Functions (Memoized with useCallback) ---
  const getProducers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authAxios.get<Producer[]>('/producers');
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
      console.log('Fetching car models from:', `${API_BASE_URL}/models`);
      const response = await authAxios.get<CarModel[]>('/models');
      console.log('Car models response:', response.data);
      setCarModels(response.data);
      const modelsForCurrentProducer = response.data.filter(model => {
        if (!model.producer) return false;
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
      console.error('Error fetching car models:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      notify('Error', `Error fetching car models: ${errorMessage}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [selectedProducerIdForPart, selectedModelIdForPart]);

  const getParts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authAxios.get<CarPart[]>('/carparts');
      setCarParts(response.data);
    } catch (error: any) {
      notify('Error', `Error fetching parts: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch data when this component mounts or location changes (if needed for moderator view)
    if (token) {
      getProducers();
      getModels();
      getParts();
    }
  }, [token]);

  useEffect(() => {
    const modelsForCurrentProducer = carModels.filter(model => {
      if (!model.producer) return false;
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

  // Fetch brands
  const getBrands = useCallback(async () => {
    try {
      const response = await authAxios.get<Brand[]>('/brands');
      setBrands(response.data);
    } catch (error) {
      notify('Error', 'Failed to fetch brands', 'destructive');
    }
  }, [authAxios]);

  useEffect(() => {
    getBrands();
  }, [getBrands]);

  // Handle brand image upload
  const handleBrandImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBrandImage(file);
      setBrandImagePreview(URL.createObjectURL(file));
    }
  };

  // Add new brand
  const addBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim() || !newBrandImage) {
      notify('Input Error', 'Please provide a brand name and image.', 'destructive');
      return;
    }
    const formData = new FormData();
    formData.append('name', newBrandName.trim());
    formData.append('imageFile', newBrandImage);
    try {
      await authAxios.post('/brands', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      notify('Success!', 'Brand added successfully!');
      setNewBrandName('');
      setNewBrandImage(null);
      setBrandImagePreview(null);
      getBrands();
    } catch (error: any) {
      notify('Error', error.response?.data?.error || error.message, 'destructive');
    }
  };


  // --- CRUD Handlers (Memoized with useCallback) ---

  const addProducer = useCallback(async (producerData: { name: string; imageFile: File | null }) => {
    if (producerData.name.trim() === '') {
      notify('Input Error', 'Producer name cannot be empty!', 'destructive');
      return;
    }
    setLoading(true);
    try {
      let response;
      if (producerData.imageFile) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', producerData.name.trim());
        formData.append('imageFile', producerData.imageFile);
        
        response = await authAxios.post<Producer>('/producers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // No image, send JSON data
        response = await authAxios.post<Producer>('/producers', { name: producerData.name.trim() });
      }
      
      notify('Success!', `Producer "${response.data.name}" added successfully!`);
      getProducers();
    } catch (error: any) {
      notify('Error', `Error adding producer: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getProducers, notify, authAxios]);

  const addModel = useCallback(async (modelName: string, producerId: string, engine?: string) => {
    if (modelName.trim() === '' || producerId === '') {
      notify('Input Error', 'Please select a producer and enter a car model name.', 'destructive');
      return;
    }
    setLoading(true);
    try {
      const modelData: any = {
        name: modelName.trim(),
        producer: producerId,
      };
      
      // Add engine field if provided
      if (engine && engine.trim() !== '') {
        modelData.engine = engine.trim();
      }
      
      console.log('Sending car model data:', modelData);
      const response = await authAxios.post<CarModel>('/models', modelData);
      notify('Success!', `Model "${response.data.name}" added successfully!`);
      getModels();
    } catch (error: any) {
      console.error('Error adding car model:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      notify('Error', `Error adding model: ${errorMessage}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getModels, notify, authAxios]);

  const addPart = useCallback(async (partData: {
    name: string;
    description: string;
    imageFile: File | null;
    price: number;
    brand: string;
    category: string;
    producer: string;
    model: string;
    isFeatured?: boolean; // Added isFeatured field
  }) => {
    if (partData.name.trim() === '' || !partData.imageFile || partData.model === '' || !partData.price) {
      notify('Input Error', 'Please fill all part fields, upload an image, and select a model.', 'destructive');
      return;
    }
    if (isNaN(partData.price) || partData.price < 0) {
        notify('Input Error', 'Price must be a valid non-negative number.', 'destructive');
        return;
    }

    setLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', partData.name.trim());
      formData.append('description', partData.description.trim());
      formData.append('price', partData.price.toString());
      formData.append('brand', partData.brand.trim());
      formData.append('category', partData.category.trim());
      formData.append('producer', partData.producer);
      formData.append('model', partData.model);
      formData.append('imageFile', partData.imageFile);
      if (partData.isFeatured) {
        formData.append('isFeatured', 'true');
      }

      const response = await authAxios.post<CarPart>('/carparts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      notify('Success!', `Part "${response.data.name}" added successfully!`);
      getParts();
    } catch (error: any) {
      notify('Error', `Error adding part: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getParts, notify, authAxios]);

  const deleteProducer = useCallback(async (producerId: string, producerName: string) => {
    setLoading(true);
    try {
      await authAxios.delete(`/producers/${producerId}`);
      notify('Success!', `Producer "${producerName}" and its models/parts deleted successfully!`);
      getProducers();
      getModels();
      getParts();
    } catch (error: any) {
      notify('Error', `Error deleting producer: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getProducers, getModels, getParts, notify, authAxios]);

  const deleteModel = useCallback(async (modelId: string, modelName: string) => {
    setLoading(true);
    try {
      await authAxios.delete(`/models/${modelId}`);
      notify('Success!', `Model "${modelName}" and its parts deleted successfully!`);
      getModels();
    } catch (error: any) {
      notify('Error', `Error deleting model: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getModels, getParts, notify, authAxios]);

  const deletePart = useCallback(async (partId: string, partName: string) => {
    setLoading(true);
    try {
      await authAxios.delete(`/carparts/${partId}`);
      notify('Success!', `Part "${partName}" deleted successfully!`);
      getParts();
    } catch (error: any) {
      notify('Error', `Error deleting part: ${error.response?.data?.message || error.message}`, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [getParts, notify, authAxios]);

  // Check if partner is approved (only for partner users, not moderators)
  if (user?.role === 'PARTNER' && user?.isApproved === false) {
    return (
      <ApprovalPendingBanner 
        partnerName={user.name} 
        companyName={user.companyName || 'Your Company'} 
      />
    );
  }

  // Compute part names from assets/parts image filenames
  const partImageFilenames = [
    'motor.oil.png',
    'Accessories.png',
    'Connections.png',
    'RepairSet.png',
    'Illuminated.png',
    'Bearings.png',
    'AIRsystem.png',
    'Gearbox.png',
    'Planetry.joint.png',
    'Exhust.System.png',
    'Sealing.Rings.png',
    'Cooling.System.png',
    'Depreciations.png',
    'Electrics.png',
    'Filters.png',
    'Brakes.png',
    'Tires.png',
  ];
  const existingPartNames = partImageFilenames.map(f => f.replace(/\.[^.]+$/, ''));

  return (
    <div className="container mx-auto max-w-4xl bg-white dark:bg-black p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:shadow-3xl">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 leading-tight tracking-tight">
        Partner Car Management
      </h1>

      {loading && (
        <div className="flex items-center justify-center text-black dark:text-white text-lg font-medium space-x-2 animate-pulse">
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
        existingPartNames={existingPartNames}
      />

      {/* Available Car Parts Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Available Car Parts</h2>
        {(() => {
          // Find all producer IDs that belong to the current partner (by createdBy)
          const myProducerIds = producers
            .filter(p => p.createdBy === user?._id)
            .map(p => p._id);
          // Filter car parts by those producer IDs
          const myCarParts = carParts.filter(part => {
            const producerId = typeof part.producer === 'string' ? part.producer : (part.producer as any)?._id || '';
            return myProducerIds.includes(producerId);
          });
          return myCarParts.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 italic">No car parts available yet.<br/>Partners will add parts here once they create them.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCarParts.map(part => (
                <div key={part._id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center shadow-md">
                  <img src={part.imageUrl} alt={part.name} className="w-32 h-32 object-cover rounded mb-3 border border-gray-300 dark:border-gray-600" />
                  <div className="w-full flex flex-col items-center">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-1">{part.name}</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Brand: {part.brand}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Model: {(() => {
                      const model = carModels.find(m => m._id === part.model);
                      return model ? model.name : 'Unknown';
                    })()}</div>
                    <div className="text-base font-semibold text-black dark:text-white mb-1">{part.price} DH</div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => deletePart(part._id, part.name)}
                        className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors text-sm font-semibold"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setEditingPart(part)}
                        className="px-4 py-2 rounded bg-white text-black dark:bg-black dark:text-white border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-sm font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* Edit Car Part Modal (skeleton) */}
      {editingPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Edit Car Part</h3>
            <form onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Name</label>
                <input type="text" value={editForm.name} onChange={e => handleEditInputChange('name', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black text-black dark:text-white" required />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Description</label>
                <textarea value={editForm.description} onChange={e => handleEditInputChange('description', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black text-black dark:text-white" rows={2} required />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Price (DH)</label>
                <input type="number" value={editForm.price} onChange={e => handleEditInputChange('price', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black text-black dark:text-white" min={0} step={0.01} required />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Brand</label>
                <input type="text" value={editForm.brand} onChange={e => handleEditInputChange('brand', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black text-black dark:text-white" required />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Model</label>
                <select value={editForm.model} onChange={e => handleEditInputChange('model', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black text-black dark:text-white" required>
                  <option value="">Select Model</option>
                  {carModels.map(model => (
                    <option key={model._id} value={model._id}>{model.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Image</label>
                {editForm.imagePreview && (
                  <img src={editForm.imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded mb-2 border border-gray-300 dark:border-gray-600" />
                )}
                <input type="file" accept="image/*" onChange={handleEditImageChange} className="w-full" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingPart(null)}
                  className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors text-sm font-semibold"
                  disabled={loading}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PartnerListingsPage;
