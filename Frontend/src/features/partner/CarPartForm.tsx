import React, { useState } from 'react';
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
    imageUrl: string;
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
  const [newPartCategory, setNewPartCategory] = useState<string>('');
  const [newPartImageUrl, setNewPartImageUrl] = useState<string>('');

  const modelsForSelectedProducerForParts = carModels.filter(model => {
    const producerId = typeof model.producer === 'string' ? model.producer : model.producer._id;
    return producerId === selectedProducerIdForPart;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const partData = {
      name: newPartName.trim(),
      description: newPartDescription.trim(),
      imageUrl: newPartImageUrl.trim(),
      price: parseFloat(newPartPrice),
      brand: newPartBrand.trim(),
      category: newPartCategory.trim(),
      producer: selectedProducerIdForPart,
      model: selectedModelIdForPart,
    };
    await onAddPart(partData);
    setNewPartName('');
    setNewPartDescription('');
    setNewPartPrice('');
    setNewPartBrand('');
    setNewPartCategory('');
    setNewPartImageUrl('');
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
        {/* Part Category input (now a free-text input) */}
        <div>
          <Label htmlFor="part-category" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Category:
          </Label>
          <Input
            type="text"
            id="part-category"
            placeholder="e.g., Filtres, Moteur, Suspension"
            value={newPartCategory}
            onChange={(e) => setNewPartCategory(e.target.value)}
            className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            required
            disabled={loading}
          />
        </div>
        {/* Part Image URL input */}
        <div>
          <Label htmlFor="part-image-url" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Part Image URL:
          </Label>
          <Input
            type="url"
            id="part-image-url"
            placeholder="https://example.com/part-image.jpg"
            value={newPartImageUrl}
            onChange={(e) => setNewPartImageUrl(e.target.value)}
            className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            required
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-black text-white dark:bg-white dark:text-black py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || producers.length === 0 || modelsForSelectedProducerForParts.length === 0 || newPartCategory.trim() === ''}
        >
          Add Car Part
        </Button>
      </form>
    </section>
  );
};

export default CarPartForm;
