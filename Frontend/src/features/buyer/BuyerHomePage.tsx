import React from 'react';

const BuyerHomePage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Buyer Dashboard Overview</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Welcome to your personal dashboard. Here you can browse car parts, manage your orders, and update your profile.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
        <h3 className="text-xl font-semibold mb-2">Quick Access:</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li><a href="/buyer-dashboard/parts" className="underline hover:text-black dark:hover:text-white">Browse Parts</a></li>
          <li><a href="/buyer-dashboard/orders" className="underline hover:text-black dark:hover:text-white">View My Orders</a></li>
          <li><a href="/buyer-dashboard/profile" className="underline hover:text-black dark:hover:text-white">Update Profile</a></li>
        </ul>
      </div>
    </div>
  );
};

export default BuyerHomePage;
