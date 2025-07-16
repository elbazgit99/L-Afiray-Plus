import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface Producer {
  _id: string;
  name: string;
}

interface CarModel {
  _id: string;
  name: string;
  producer: string | { _id: string; name: string };
}

interface CarPartFormProps {
  producers: Producer[];
  carModels: CarModel[];
  onAddPart: (partData: {
    name: string;
    description: string;
    imageFile: File | null;
    price: number;
    brand: string;
    brandImageFile: File | null;
    category: string;
    producer: string;
    model: string;
  }) => Promise<void>;
  loading: boolean;
  selectedProducerIdForPart: string;
  setSelectedProducerIdForPart: (id: string) => void;
  selectedModelIdForPart: string;
  setSelectedModelIdForPart: (id: string) => void;
  existingPartNames: string[];
}

const CarPartForm: React.FC<CarPartFormProps> = ({
  producers,
  carModels,
  onAddPart,
  loading,
  selectedProducerIdForPart,
  setSelectedProducerIdForPart,
  selectedModelIdForPart,
  setSelectedModelIdForPart,
  existingPartNames,
}) => {
  const [newPartName, setNewPartName] = useState<string>('');
  const [newPartDescription, setNewPartDescription] = useState<string>('');
  const [newPartPrice, setNewPartPrice] = useState<string>('');
  const [newPartBrand, setNewPartBrand] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [brandImageFile, setBrandImageFile] = useState<File | null>(null);
  const [brandImagePreview, setBrandImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandFileInputRef = useRef<HTMLInputElement>(null);

  const modelsForSelectedProducerForParts = carModels.filter(model => {
    if (!model.producer) return false;
    const producerId = typeof model.producer === 'string' ? model.producer : model.producer._id;
    return producerId === selectedProducerIdForPart;
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image too large', { description: 'Please select an image smaller than 5MB' });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', { description: 'Please select an image file' });
        return;
      }

      setSelectedImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrandImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image too large', { description: 'Please select an image smaller than 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', { description: 'Please select an image file' });
        return;
      }
      setBrandImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBrandImage = () => {
    setBrandImageFile(null);
    setBrandImagePreview(null);
    if (brandFileInputRef.current) {
      brandFileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!selectedProducerIdForPart) {
      toast.error('Please select a car producer.');
      return;
    }
    if (!selectedModelIdForPart) {
      toast.error('Please select a car model.');
      return;
    }
    if (!selectedImageFile) {
      toast.error('Please upload an image for the car part.');
      return;
    }
    if (!newPartName.trim() || newPartName.trim().length < 2) {
      toast.error('Part name must be at least 2 characters long.');
      return;
    }
    if (!newPartPrice || isNaN(Number(newPartPrice)) || Number(newPartPrice) < 0) {
      toast.error('Please enter a valid non-negative price.');
      return;
    }
    if (!newPartBrand.trim()) {
      toast.error('Please enter a brand name.');
      return;
    }
    if (!brandImageFile) {
      toast.error('Please upload a brand image.');
      return;
    }
    const partData = {
      name: newPartName.trim(),
      description: newPartDescription.trim(),
      imageFile: selectedImageFile,
      price: parseFloat(newPartPrice),
      brand: newPartBrand.trim(),
      brandImageFile: brandImageFile,
      category: '',
      producer: selectedProducerIdForPart,
      model: selectedModelIdForPart,
    };
    await onAddPart(partData);
    setNewPartName('');
    setNewPartDescription('');
    setNewPartPrice('');
    setNewPartBrand('');
    setSelectedImageFile(null);
    setImagePreview(null);
    setBrandImageFile(null);
    setBrandImagePreview(null);
  };

  return (
    <section className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-black dark:text-white">
        Add Car Part to Model
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Producer selection for parts */}
        <div>
          <Label htmlFor="producer-select-part" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Select Car Producer:
          </Label>
          <Select
            value={selectedProducerIdForPart}
            onValueChange={(value) => { setSelectedProducerIdForPart(value); setSelectedModelIdForPart(''); }}
            disabled={loading || producers.length === 0}
          >
            <SelectTrigger id="producer-select-part" className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select a producer" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
              {producers.map((producer) => (
                <SelectItem key={producer._id} value={producer._id}>
                  {producer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model selection for parts (dynamic) */}
        <div>
          <Label htmlFor="model-select-part" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Select Car Model:
          </Label>
          <Select
            value={selectedModelIdForPart}
            onValueChange={setSelectedModelIdForPart}
            disabled={loading || modelsForSelectedProducerForParts.length === 0}
          >
            <SelectTrigger id="model-select-part" className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
              {modelsForSelectedProducerForParts.map((model) => (
                <SelectItem key={model._id} value={model._id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Part Name input as select with custom option */}
        <div>
          <Label htmlFor="part-name" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Part Name:
          </Label>
          <Select
            value={newPartName}
            onValueChange={setNewPartName}
            disabled={loading}
          >
            <SelectTrigger id="part-name" className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select or enter a part name" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
              {existingPartNames.map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
              <SelectItem value="__custom__">Other (Enter new name)</SelectItem>
            </SelectContent>
          </Select>
          {newPartName === "__custom__" && (
            <Input
              type="text"
              id="part-name-custom"
              placeholder="Enter new part name"
              value={newPartName === "__custom__" ? "" : newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600 mt-2"
              required
              disabled={loading}
            />
          )}
        </div>
        {/* Part Description input */}
        <div>
          <Label htmlFor="part-description" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Description:
          </Label>
          <Textarea
            id="part-description"
            placeholder="Detailed description of the part..."
            value={newPartDescription}
            onChange={(e) => setNewPartDescription(e.target.value)}
            className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            rows={2}
            disabled={loading}
          ></Textarea>
        </div>
        {/* Part Price input */}
        <div>
          <Label htmlFor="part-price" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Price (DH):
          </Label>
          <Input
            type="number"
            id="part-price"
            placeholder="25.99"
            value={newPartPrice}
            onChange={(e) => setNewPartPrice(e.target.value)}
            className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            required
            min={0}
            step={0.01}
            disabled={loading}
          />
        </div>
        {/* Part Brand input */}
        <div>
          <Label htmlFor="part-brand" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Brand:
          </Label>
          <Input
            type="text"
            id="part-brand"
            placeholder="Bosch, NGK"
            value={newPartBrand}
            onChange={(e) => setNewPartBrand(e.target.value)}
            className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            disabled={loading}
          />
        </div>
        {/* Brand Image Upload */}
        <div>
          <Label htmlFor="brand-image-upload" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Brand Image:
          </Label>
          <div className="space-y-3">
            {!brandImagePreview ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input
                  ref={brandFileInputRef}
                  type="file"
                  id="brand-image-upload"
                  accept="image/*"
                  onChange={handleBrandImageUpload}
                  className="hidden"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => brandFileInputRef.current?.click()}
                  disabled={loading}
                  className="w-full border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Brand Image
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={brandImagePreview}
                  alt="Preview"
                  className="w-full h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeBrandImage}
                  className="absolute top-2 right-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* Part Image Upload */}
        <div>
          <Label htmlFor="part-image-upload" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Part Image:
          </Label>
          <div className="space-y-3">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="part-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="w-full border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-black text-white dark:bg-white dark:text-black py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            loading ||
            producers.length === 0 ||
            modelsForSelectedProducerForParts.length === 0 ||
            !selectedImageFile ||
            !selectedProducerIdForPart ||
            !selectedModelIdForPart ||
            !newPartName.trim() ||
            newPartName.trim().length < 2 ||
            !newPartPrice ||
            isNaN(Number(newPartPrice)) ||
            Number(newPartPrice) < 0 ||
            !newPartBrand.trim() ||
            !brandImageFile
          }
        >
          Add Car Part
        </Button>
      </form>
    </section>
  );
};

export default CarPartForm;
