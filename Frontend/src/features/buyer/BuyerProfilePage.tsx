import React from 'react';
import { useAuth } from '@/context/AuthContext';

const BuyerProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-center text-red-500 dark:text-red-400">Please log in to view your profile.</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="space-y-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.shippingAddress && <p><strong>Shipping Address:</strong> {user.shippingAddress}</p>}
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
      </div>
      <p className="mt-6 text-gray-700 dark:text-gray-300">
        You can update your profile information in the future.
      </p>
    </div>
  );
};

export default BuyerProfilePage;
