import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle,
  Clock,
  Trash2,
  User,
  Send,
  TrendingUp
} from 'lucide-react';

interface Partner {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  companyAddress: string;
  phone: string;
  isApproved: boolean;
  createdAt: string;
  profileImage?: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const PartnerManagementPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSalesChart, setShowSalesChart] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${API_BASE_URL}/users/partners`, { headers });
      setPartners(response.data);
    } catch (error: any) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to fetch partners', { description: error.response?.data?.message || 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const approvePartner = async (partnerId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.put(`${API_BASE_URL}/users/${partnerId}/approve`, {}, { headers });
      toast.success('Partner approved successfully', { 
        description: 'Approval email has been sent to the partner' 
      });
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      console.error('Error approving partner:', error);
      toast.error('Failed to approve partner', { description: error.response?.data?.message || 'Network error' });
    }
  };

  const rejectPartner = async (partnerId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.put(`${API_BASE_URL}/users/${partnerId}/reject`, {}, { headers });
      toast.success('Partner rejected', { 
        description: 'Rejection email has been sent to the partner' 
      });
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      console.error('Error rejecting partner:', error);
      toast.error('Failed to reject partner', { description: error.response?.data?.message || 'Network error' });
    }
  };

  const deletePartner = async (partnerId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.delete(`${API_BASE_URL}/users/${partnerId}`, { headers });
      toast.success('Partner deleted successfully');
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting partner:', error);
      toast.error('Failed to delete partner', { description: error.response?.data?.message || 'Network error' });
    }
  };

  const showPartnerSales = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowSalesChart(true);
  };

  const generateMockSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 10000) + 1000
    }));
  };

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search partners by name, company, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-black dark:text-white"
        />
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Partners Grid */}
      {filteredPartners.length === 0 ? (
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchTerm ? 'No partners found matching your search' : 'No partners found'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
          {filteredPartners.map((partner) => (
            <Card key={partner._id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-1 sm:p-2 md:p-3">
                {/* Profile Image */}
                <div className="mb-1 -mt-3">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-2 sm:mb-3 overflow-hidden">
                    {partner.profileImage ? (
                      <img 
                        src={partner.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Building2 className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex justify-center mb-1">
                    {partner.isApproved ? (
                      <span className="flex items-center gap-1 text-black dark:text-white text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded-full">
                        <CheckCircle className="h-2 w-2" />
                        Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-black dark:text-white text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded-full">
                        <Clock className="h-2 w-2" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Company and Partner Info */}
                <div className="mb-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-black dark:text-white mb-0.5">
                    {partner.companyName}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-0.5">
                    Managed by {partner.name}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-0.5 mb-3 text-center">
                  <div className="text-xs text-black dark:text-white truncate">
                    {partner.email}
                  </div>
                  {partner.phone && (
                    <div className="text-xs text-black dark:text-white">
                      {partner.phone}
                    </div>
                  )}
                  <div className="text-xs text-black dark:text-white truncate">
                    {partner.companyAddress}
                  </div>
                  <div className="text-xs text-black dark:text-white">
                    Joined {new Date(partner.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-1">
                  {!partner.isApproved && (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => approvePartner(partner._id)}
                        className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
                        size="sm"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => rejectPartner(partner._id)}
                        className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
                        size="sm"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={() => showPartnerSales(partner)}
                      className="bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors w-6 h-6 p-0"
                      size="sm"
                    >
                      <TrendingUp className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => {
                        // Email functionality can be added here
                        toast.info('Email feature coming soon');
                      }}
                      className="bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors w-6 h-6 p-0"
                      size="sm"
                    >
                      <Mail className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => deletePartner(partner._id)}
                      className="bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors w-6 h-6 p-0"
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sales Chart Modal */}
      {showSalesChart && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black dark:text-white">
                Sales Report - {selectedPartner.companyName}
              </h3>
              <Button
                onClick={() => setShowSalesChart(false)}
                className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                size="sm"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Partner: {selectedPartner.name}</p>
                <p>Email: {selectedPartner.email}</p>
                <p>Company: {selectedPartner.companyName}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Monthly Sales Performance</h4>
                <div className="space-y-2">
                  {generateMockSalesData().map((data, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-black dark:text-white">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-black dark:bg-white h-2 rounded-full" 
                            style={{ width: `${(data.sales / 10000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-black dark:text-white w-16 text-right">
                          {data.sales.toLocaleString()} DH
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>Total Annual Sales: {generateMockSalesData().reduce((sum, data) => sum + data.sales, 0).toLocaleString()} DH</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerManagementPage; 