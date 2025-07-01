import React from 'react';

const PartnerOrdersPage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Inventory & Order Tracking</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Manage your stock levels and view incoming orders with status updates.
      </p>
      {/* Future: Implement order list and details */}
    </div>
  );
};

export default PartnerOrdersPage;
