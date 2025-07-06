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
import { validateImageFile, createImagePreview } from '@/lib/imageUtils';

interface Producer {
  _id: string;
  name: string;
}

interface CarModel {
  _id: string;
  name: string;
  producer: string;
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
    category: string;
    producer: string;
    model: string;
  }) => Promise<void>;
  loading: boolean;
  selectedProducerIdForPart: string;
  setSelectedProducerIdForPart: (id: string) => void;
  selectedModelIdForPart: string;
  setSelectedModelIdForPart: (id: string) => void;
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
}) => {
  const [newPartName, setNewPartName] = useState<string>('');
  const [newPartDescription, setNewPartDescription] = useState<string>('');
  const [newPartPrice, setNewPartPrice] = useState<string>('');
  const [newPartBrand, setNewPartBrand] = useState<string>('');
  const [newPartEngineType, setNewPartEngineType] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelsForSelectedProducerForParts = carModels.filter(model => model.producer === selectedProducerIdForPart);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate the image file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast.error('Invalid Image', { description: validation.error });
        return;
      }

      setSelectedImageFile(file);
      
      try {
        const preview = await createImagePreview(file);
        setImagePreview(preview);
      } catch (error) {
        toast.error('Image Preview Error', { description: 'Failed to create image preview' });
        setSelectedImageFile(null);
      }
    }
  };

  const removeImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const partData = {
      name: newPartName.trim(),
      description: newPartDescription.trim(),
      imageFile: selectedImageFile,
      price: parseFloat(newPartPrice),
      brand: newPartBrand.trim(),
      category: newPartEngineType.trim(),
      producer: selectedProducerIdForPart,
      model: selectedModelIdForPart,
    };
    await onAddPart(partData);
    // Clear form fields after submission
    setNewPartName('');
    setNewPartDescription('');
    setNewPartPrice('');
    setNewPartBrand('');
    setNewPartEngineType('');
    setSelectedImageFile(null);
    setImagePreview(null);
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

        {/* Part Name input */}
        <div>
          <Label htmlFor="part-name" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Part Name:
          </Label>
          <Input
            type="text"
            id="part-name"
            placeholder="e.g., Spark Plug, Air Filter"
            value={newPartName}
            onChange={(e) => setNewPartName(e.target.value)}
            className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            required
            disabled={loading}
          />
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
            placeholder="e.g., 25.99"
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
            placeholder="e.g., Bosch, NGK"
            value={newPartBrand}
            onChange={(e) => setNewPartBrand(e.target.value)}
            className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            disabled={loading}
          />
        </div>
        {/* Part Engine Type input */}
        <div>
          <Label htmlFor="part-engine-type" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Engine Type:
          </Label>
          <Select
            value={newPartEngineType}
            onValueChange={setNewPartEngineType}
            disabled={loading}
          >
            <SelectTrigger id="part-engine-type" className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select engine type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
              <SelectItem value="Petrol">Petrol/Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
            </SelectContent>
          </Select>
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
          disabled={loading || producers.length === 0 || modelsForSelectedProducerForParts.length === 0 || newPartEngineType.trim() === '' || !selectedImageFile}
        >
          Add Car Part
        </Button>
      </form>
    </section>
  );
};

export default CarPartForm;