import React from 'react';

const BuyerOrdersPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <p className="text-center text-gray-700 dark:text-gray-300">
        You can view your past and current orders here.
      </p>
      {/* Future: Implement display of buyer's orders */}
    </div>
  );
};

export default BuyerOrdersPage;
