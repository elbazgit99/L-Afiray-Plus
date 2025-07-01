import React from 'react';

const PartnerHomePage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Partner Dashboard Overview</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Welcome to your partner dashboard. Here you can manage your car part listings, track orders, and view sales reports.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
        <h3 className="text-xl font-semibold mb-2">Quick Access:</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li><a href="/partner-dashboard/listings" className="underline hover:text-black dark:hover:text-white">Manage Listings</a></li>
          <li><a href="/partner-dashboard/orders" className="underline hover:text-black dark:hover:text-white">Track Orders</a></li>
          <li><a href="/partner-dashboard/sales-reports" className="underline hover:text-black dark:hover:text-white">View Sales Reports</a></li>
          <li><a href="/partner-dashboard/profile" className="underline hover:text-black dark:hover:text-white">My Profile</a></li>
        </ul>
      </div>
    </div>
  );
};

export default PartnerHomePage;
// This component serves as the main dashboard for partners, providing an overview and quick access to key functionalities.