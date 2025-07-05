import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Partner {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  companyAddress: string;
  phone: string;
  isApproved: boolean;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const PartnerManagementPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/partners`);
      setPartners(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch partners', { description: error.response?.data?.message || 'Network error' });
    } finally {
      setLoading(false);
    }
  };



  const approvePartner = async (partnerId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${partnerId}/approve`);
      toast.success('Partner approved successfully', { 
        description: 'Approval email has been sent to the partner' 
      });
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to approve partner', { description: error.response?.data?.message || 'Network error' });
    }
  };

  const rejectPartner = async (partnerId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${partnerId}/reject`);
      toast.success('Partner rejected', { 
        description: 'Rejection email has been sent to the partner' 
      });
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to reject partner', { description: error.response?.data?.message || 'Network error' });
    }
  };



  const deletePartner = async (partnerId: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/users/${partnerId}`);
      toast.success('Partner deleted successfully');
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to delete partner', { description: error.response?.data?.message || 'Network error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p>Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Partner Management</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Partners: {partners.length}
        </div>
      </div>



      {/* Partners List */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Partner List</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">No partners found</p>
          ) : (
            <div className="space-y-4">
              {partners.map((partner) => (
                <div key={partner._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black dark:text-white">{partner.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{partner.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {partner.companyName} • {partner.companyAddress}
                      </p>
                      {partner.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">Phone: {partner.phone}</p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Joined: {new Date(partner.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          partner.isApproved 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {partner.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>

                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                                                                 {!partner.isApproved && (
                      <>
                        <Button
                             onClick={() => approvePartner(partner._id)}
                             className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                             size="sm"
                           >
                             Accept
                           </Button>
                           <Button
                             onClick={() => rejectPartner(partner._id)}
                             className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                             size="sm"
                           >
                             Reject
                           </Button>
                         </>
                       )}
                       <Button
                         onClick={() => deletePartner(partner._id)}
                         className="bg-black text-white dark:bg-white dark:text-black hover:bg-red-600 hover:text-white transition-colors"
                         size="sm"
                       >
                         Delete
                       </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerManagementPage; 