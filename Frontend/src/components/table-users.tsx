import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  companyAddress?: string;
  phone?: string;
}

const API_URL = 'http://localhost:5000/api';

const TableUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get<User[]>(`${API_URL}/users`);
      setUsers(response.data);
      toast.success("Users loaded successfully.");
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users", { description: error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/users/${selectedUserId}`);
      toast.success("User deleted successfully.");
      fetchUsers();
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user", { description: error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-black dark:text-white">Loading users...</div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center text-black dark:text-white">No users found.</div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Manage System Users</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-zinc-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company/Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700 text-black dark:text-white">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.role === 'PARTNER' && `${user.companyName || 'N/A'}, ${user.companyAddress || 'N/A'}`}
                {user.role === 'BUYER' && 'N/A'}
                {user.role === 'MODERATOR' && 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                <Button
                  onClick={() => navigate(`/admin-dashboard/users/update/${user._id}`)}
                  className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(user._id)}
                  variant="destructive"
                  size="sm"
                  className="bg-black text-white dark:bg-white dark:text-black hover:bg-red-600 hover:text-white transition-colors"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { TableUsers };
