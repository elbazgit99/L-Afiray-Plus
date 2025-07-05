import React from 'react';

const DashHomePage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Moderator Dashboard Overview</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Welcome to the moderator panel. Use the sidebar to navigate and manage different aspects of the application,
        including users, producers, models, and parts.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
        <h3 className="text-xl font-semibold mb-2">Quick Stats:</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li>Total Users: <span className="font-bold">...</span> (Fetch from API)</li>
          <li>Total Partners: <span className="font-bold">...</span> (Fetch from API)</li>
          <li>Total Car Producers: <span className="font-bold">...</span> (Fetch from API)</li>
        </ul>
      </div>
    </div>
  );
};

export default DashHomePage;
