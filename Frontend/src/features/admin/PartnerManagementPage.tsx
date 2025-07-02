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
  approvalCode?: string;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const PartnerManagementPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    companyAddress: '',
    phone: ''
  });

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

  const generateApprovalCode = async (partnerId: string) => {
    setGeneratingCode(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/${partnerId}/approval-code`);
      toast.success('Approval code generated successfully', { description: `Code: ${response.data.approvalCode}` });
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to generate approval code', { description: error.response?.data?.message || 'Network error' });
    } finally {
      setGeneratingCode(false);
    }
  };

  const approvePartner = async (partnerId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${partnerId}/approve`);
      toast.success('Partner approved successfully');
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to approve partner', { description: error.response?.data?.message || 'Network error' });
    }
  };

  const rejectPartner = async (partnerId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${partnerId}/reject`);
      toast.success('Partner rejected');
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to reject partner', { description: error.response?.data?.message || 'Network error' });
    }
  };

  const createPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/users`, {
        ...newPartner,
        role: 'PARTNER'
      });
      toast.success('Partner created successfully');
      setNewPartner({
        name: '',
        email: '',
        password: '',
        companyName: '',
        companyAddress: '',
        phone: ''
      });
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to create partner', { description: error.response?.data?.message || 'Network error' });
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

      {/* Create New Partner Form */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Create New Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createPartner} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-black dark:text-white">Name</Label>
                <Input
                  id="name"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  required
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                  required
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-black dark:text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPartner.password}
                  onChange={(e) => setNewPartner({ ...newPartner, password: e.target.value })}
                  required
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-black dark:text-white">Phone</Label>
                <Input
                  id="phone"
                  value={newPartner.phone}
                  onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="companyName" className="text-black dark:text-white">Company Name</Label>
                <Input
                  id="companyName"
                  value={newPartner.companyName}
                  onChange={(e) => setNewPartner({ ...newPartner, companyName: e.target.value })}
                  required
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="companyAddress" className="text-black dark:text-white">Company Address</Label>
                <Input
                  id="companyAddress"
                  value={newPartner.companyAddress}
                  onChange={(e) => setNewPartner({ ...newPartner, companyAddress: e.target.value })}
                  required
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            <Button type="submit" className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Create Partner
            </Button>
          </form>
        </CardContent>
      </Card>

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
                        {partner.approvalCode && (
                          <span className="ml-2 inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                            Code: {partner.approvalCode}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                                             {!partner.isApproved && (
                         <>
                           <Button
                             onClick={() => generateApprovalCode(partner._id)}
                             disabled={generatingCode}
                             className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                             size="sm"
                           >
                             {generatingCode ? 'Generating...' : 'Generate Code'}
                           </Button>
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