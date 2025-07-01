import React from 'react';
import { Button } from '@/components/ui/button';

interface Producer {
  _id: string;
  name: string;
}

interface CarModel {
  _id: string;
  name: string;
  producer: string;
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

interface ProducerListProps {
  producers: Producer[];
  carModels: CarModel[];
  carParts: CarPart[];
  onDeleteProducer: (id: string, name: string) => Promise<void>;
  onDeleteModel: (id: string, name: string) => Promise<void>;
  onDeletePart: (id: string, name: string) => Promise<void>;
  loading: boolean;
}

const ProducerList: React.FC<ProducerListProps> = ({
  producers,
  carModels,
  carParts,
  onDeleteProducer,
  onDeleteModel,
  onDeletePart,
  loading,
}) => {

  const filterModelsByProducer = (producerId: string): CarModel[] => {
    return carModels.filter(model => model.producer === producerId);
  };

  const filterPartsByModel = (modelId: string): CarPart[] => {
    return carParts.filter(part => part.model === modelId);
  };

  return (
    <section className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-black dark:text-white">
        Existing Car Producers, Models & Parts
      </h2>
      {producers.length === 0 && !loading ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-4 italic">No car producers created yet. Start by adding one above!</p>
      ) : (
        <div className="space-y-8">
          {producers.map((producer) => (
            <div key={producer._id} className="bg-white dark:bg-black p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2 sm:mb-0">{producer.name}</h3>
                <Button
                  variant="destructive"
                  onClick={() => onDeleteProducer(producer._id, producer.name)}
                  className="py-2 px-4 rounded-lg font-medium shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white"
                  title="Delete Producer and all its Models/Parts"
                  disabled={loading}
                >
                  Delete Producer
                </Button>
              </div>
              {filterModelsByProducer(producer._id).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic ml-4 py-2">No models for this producer.</p>
              ) : (
                <div className="space-y-5 ml-0 sm:ml-4 mt-4">
                  {filterModelsByProducer(producer._id).map((model) => (
                    <div key={model._id} className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-black dark:text-white mb-1 sm:mb-0">{model.name}</h4>
                        <Button
                          variant="destructive"
                          onClick={() => onDeleteModel(model._id, model.name)}
                          className="py-1.5 px-3 rounded-md text-xs font-medium shadow-sm transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white"
                          title="Delete Model and all its Parts"
                          disabled={loading}
                        >
                          Delete Model
                        </Button>
                      </div>
                      {filterPartsByModel(model._id).length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-xs italic ml-2 py-1">No parts for this model.</p>
                      ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 sm:ml-2 mt-3">
                          {filterPartsByModel(model._id).map((part) => (
                            <li key={part._id} className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 bg-white dark:bg-black p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm relative group">
                              <img
                                src={part.imageUrl || 'https://placehold.co/80x80/E0E0E0/333333?text=Part'}
                                alt={part.name}
                                className="w-16 h-16 object-cover rounded-md flex-shrink-0 border border-gray-300 dark:border-gray-600 shadow-inner"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/80x80/E0E0E0/333333?text=Err'; }}
                              />
                              <div className="flex-grow text-center sm:text-left">
                                <span className="text-black dark:text-white text-base font-semibold block">{part.name}</span>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block truncate" title={part.description}>{part.description || 'No description'}</span>
                                <span className="text-gray-600 dark:text-gray-400 text-xs block">Brand: <span className="font-medium">{part.brand || 'N/A'}</span></span>
                                <span className="text-gray-600 dark:text-gray-400 text-xs block">Category: <span className="font-medium">{part.category || 'N/A'}</span></span>
                                <span className="text-black dark:text-white text-lg font-bold block mt-1">{part.price?.toFixed(2) || '0.00'} €</span>
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => onDeletePart(part._id, part.name)}
                                className="absolute top-2 right-2 rounded-full text-xs disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 bg-red-600 hover:bg-red-700 text-white"
                                title="Delete Part"
                                disabled={loading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.275-2.314.593A3.374 3.374 0 0 0 3 9.75v.75c0 1.546.842 2.862 2.067 3.625A4.524 4.524 0 0 0 6.75 17.25H9.5v-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v2.25h2.75a4.524 4.524 0 0 0 1.683-.472A3.653 3.653 0 0 0 18 10.5V9.75c0-1.332-.582-2.5-1.571-3.375A4.957 4.957 0 0 0 15 4.193V3.75A2.75 2.75 0 0 0 12.25 1h-3.5ZM10 4c.828 0 1.5.672 1.5 1.5V6a.75.75 0 0 1-1.5 0V5.5c0-.828-.672-1.5-1.5-1.5Zm-3.5 6.75a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm4.5 0a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm4.5 0a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Z" clipRule="evenodd" />
                                </svg>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProducerList;