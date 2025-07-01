import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProducerFormProps {
  onAddProducer: (name: string) => Promise<void>;
  loading: boolean;
}

const ProducerForm: React.FC<ProducerFormProps> = ({ onAddProducer, loading }) => {
  const [newProducerName, setNewProducerName] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddProducer(newProducerName);
    setNewProducerName(''); // Clear input after submission attempt
  };

  return (
    <section className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-black dark:text-white">
        Add New Car Producer
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="e.g., Volkswagen, Audi"
          value={newProducerName}
          onChange={(e) => setNewProducerName(e.target.value)}
          className="flex-grow shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
          required
          disabled={loading}
        />
        <Button
          type="submit"
          className="bg-black text-white dark:bg-white dark:text-black py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          Add Producer
        </Button>
      </form>
    </section>
  );
};

export default ProducerForm;