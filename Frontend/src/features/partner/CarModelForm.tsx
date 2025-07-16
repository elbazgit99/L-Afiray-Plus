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
import { toast } from 'sonner';

interface Producer {
  _id: string;
  name: string;
}

interface CarModelFormProps {
  producers: Producer[];
  onAddModel: (modelName: string, producerId: string, engine: string) => Promise<void>;
  loading: boolean;
  selectedProducerIdForModel: string;
  setSelectedProducerIdForModel: (id: string) => void;
}

const CarModelForm: React.FC<CarModelFormProps> = ({
  producers,
  onAddModel,
  loading,
  selectedProducerIdForModel,
  setSelectedProducerIdForModel,
}) => {
  const [newCarModelName, setNewCarModelName] = useState<string>('');
  const [engineType, setEngineType] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!selectedProducerIdForModel) {
      toast.error('Please select a producer');
      return;
    }
    
    if (!newCarModelName.trim()) {
      toast.error('Please enter a car model name');
      return;
    }
    
    try {
      await onAddModel(newCarModelName, selectedProducerIdForModel, engineType);
      setNewCarModelName('');
      setEngineType('');
      toast.success('Car model added successfully!');
    } catch (error) {
      console.error('Error in CarModelForm:', error);
      toast.error('Failed to add car model.');
      // Error handling is done in the parent component
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-black dark:text-white">
        Add Car Model to Producer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="producer-select-model" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Select Car Producer:
          </Label>
          <Select
            value={selectedProducerIdForModel}
            onValueChange={setSelectedProducerIdForModel}
            disabled={loading || producers.length === 0}
          >
            <SelectTrigger id="producer-select-model" className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600">
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
        <div>
          <Label htmlFor="car-model-name" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Car Model Name:
          </Label>
          <Input
            type="text"
            id="car-model-name"
            placeholder="Golf, A4, Cybertruck"
            value={newCarModelName}
            onChange={(e) => setNewCarModelName(e.target.value)}
            className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="engine-type" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Engine Type:
          </Label>
          <Select
            value={engineType}
            onValueChange={setEngineType}
            disabled={loading}
          >
            <SelectTrigger id="engine-type" className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select engine type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
              <SelectItem value="Petrol">Petrol/Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="w-full bg-black text-white dark:bg-white dark:text-black py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || producers.length === 0 || engineType.trim() === ''}
        >
          Add Car Model
        </Button>
      </form>
    </section>
  );
};

export default CarModelForm;
