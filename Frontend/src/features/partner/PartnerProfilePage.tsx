import React from 'react';
import { useAuth } from '@/context/AuthContext';

const PartnerProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'PARTNER') {
    return <div className="text-center text-red-500 dark:text-red-400">Please log in as a Partner to view this page.</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">My Partner Profile</h2>
      
      {/* Approval Status Banner */}
      {user.isApproved === false && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Account Pending Approval
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  Your partner account is currently pending approval by our moderation team. 
                  You will receive an email notification once your account is approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {user.isApproved === true && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Account Approved
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  Your partner account has been approved! You can now access all partner features.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Approval Status:</strong> 
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
            user.isApproved 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {user.isApproved ? 'Approved' : 'Pending Approval'}
          </span>
        </p>
        {user.companyName && <p><strong>Company Name:</strong> {user.companyName}</p>}
        {user.companyAddress && <p><strong>Company Address:</strong> {user.companyAddress}</p>}
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
      </div>
      
      {user.isApproved === false && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            What happens next?
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Our moderation team will review your application</li>
                            <li>• You'll receive an email notification once approved</li>
            <li>• Once approved, you can access all partner features</li>
            <li>• You can start adding car models and parts to your inventory</li>
          </ul>
        </div>
      )}

      <p className="mt-6 text-gray-700 dark:text-gray-300">
        You can update your company and contact information here.
      </p>
    </div>
  );
};

export default PartnerProfilePage;
