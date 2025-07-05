import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'BUYER' | 'PARTNER' | 'MODERATOR';
  isApproved?: boolean;
  companyName?: string;
  companyAddress?: string;
  phone?: string;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'buyers' | 'partners' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch users', { description: error.response?.data?.message || 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to delete user', { description: error.response?.data?.message || 'Network error' });
    }
  };

  const approveUser = async (userId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${userId}/approve`);
      toast.success('User approved successfully');
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to approve user', { description: error.response?.data?.message || 'Network error' });
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${userId}/reject`);
      toast.success('User rejected');
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to reject user', { description: error.response?.data?.message || 'Network error' });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'buyers') return user.role === 'BUYER' && matchesSearch;
    if (activeTab === 'partners') return user.role === 'PARTNER' && matchesSearch;
    return matchesSearch;
  });

  const buyers = users.filter(user => user.role === 'BUYER');
  const partners = users.filter(user => user.role === 'PARTNER');
  const moderators = users.filter(user => user.role === 'MODERATOR');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">User Management</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Users: {users.length} | Buyers: {buyers.length} | Partners: {partners.length} | Moderators: {moderators.length}
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <Label htmlFor="search" className="text-black dark:text-white mb-2 block">Search Users</Label>
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="sm:w-48">
              <Label className="text-black dark:text-white mb-2 block">Filter by Role</Label>
              <Select value={activeTab} onValueChange={(value: 'buyers' | 'partners' | 'all') => setActiveTab(value)}>
                <SelectTrigger className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="buyers">Buyers Only</SelectItem>
                  <SelectItem value="partners">Partners Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">
            {activeTab === 'buyers' ? 'Buyers List' : 
             activeTab === 'partners' ? 'Partners List' : 'All Users'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              {searchQuery ? 'No users found matching your search' : 'No users found'}
            </p>
          ) : (
            <div className="space-y-6">
              {filteredUsers.map((user) => (
                <div key={user._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-black dark:text-white">{user.name}</h3>
                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                          user.role === 'BUYER' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : user.role === 'PARTNER'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {user.role}
                        </span>
                        {user.isApproved !== undefined && (
                          <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                            user.isApproved 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {user.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
                      {user.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Phone: {user.phone}</p>
                      )}
                      {user.companyName && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">
                          Company: {user.companyName}
                        </p>
                      )}
                      {user.companyAddress && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">
                          Address: {user.companyAddress}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-3 ml-6">
                      {user.role === 'PARTNER' && user.isApproved !== undefined && !user.isApproved && (
                        <>
                          <Button
                            onClick={() => approveUser(user._id)}
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => rejectUser(user._id)}
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {user.role !== 'MODERATOR' && (
                        <Button
                          onClick={() => deleteUser(user._id)}
                          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                          size="sm"
                        >
                          Delete
                        </Button>
                      )}
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

export default UserManagementPage; 