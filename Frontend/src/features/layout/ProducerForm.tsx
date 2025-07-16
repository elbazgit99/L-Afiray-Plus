import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProducerFormProps {
  onAddProducer: (producerData: { name: string; imageFile: File | null }) => Promise<void>;
  loading: boolean;
}

const ProducerForm: React.FC<ProducerFormProps> = ({ onAddProducer, loading }) => {
  const [newProducerName, setNewProducerName] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProducerName.trim()) {
      toast.error('Please enter a producer name');
      return;
    }
    await onAddProducer({ name: newProducerName.trim(), imageFile: selectedImageFile });
    setNewProducerName('');
    setSelectedImageFile(null);
    setImagePreview(null);
  };

  return (
    <section className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-black dark:text-white">
        Add New Car Producer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="producer-name" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Producer Name:
          </Label>
          <Input
            type="text"
            id="producer-name"
            placeholder="Volkswagen, Audi"
            value={newProducerName}
            onChange={(e) => setNewProducerName(e.target.value)}
            className="w-full shadow-sm bg-white dark:bg-zinc-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="producer-image-upload" className="block text-sm font-medium mb-1 text-black dark:text-white">
            Producer Logo/Image (Optional):
          </Label>
          <div className="space-y-3">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="producer-image-upload"
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
          disabled={loading || !newProducerName.trim()}
        >
          Add Producer
        </Button>
      </form>
    </section>
  );
};

export default ProducerForm;