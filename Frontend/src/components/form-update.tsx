import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  companyAddress?: string;
  phone?: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const UpdateUserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(`${API_BASE_URL}/users/${id}`);
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setRole(response.data.role);
        setCompanyName(response.data.companyName || '');
        setCompanyAddress(response.data.companyAddress || '');
        setPhone(response.data.phone || '');
      } catch (error: any) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load user data", { description: error.response?.data?.message || error.message });
        navigate('/dash-home/users'); // Redirect back if user not found or access denied
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchUser();
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData: Partial<User> = { name, email, role, phone };
      if (role === 'PARTNER') {
        updatedData.companyName = companyName;
        updatedData.companyAddress = companyAddress;
      }

      await axios.put(`${API_BASE_URL}/users/${id}`, updatedData);
      toast.success("User updated successfully!");
      navigate('/dash-home/users'); // Go back to user list
    } catch (error: any) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user", { description: error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-black dark:text-white">Loading user data...</div>;
  }

  if (!user) {
    return <div className="text-center text-red-500">User not found or access denied.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white p-4">
      <div className="p-8 rounded-lg shadow-md bg-white dark:bg-black border border-gray-200 dark:border-gray-700 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Update User: {user.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-black dark:text-white">Name</Label>
            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600" />
          </div>
          <div>
            <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-black dark:text-white">Phone</Label>
            <Input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600" />
          </div>
          <div>
            <Label htmlFor="role" className="text-black dark:text-white">Role</Label>
            <Select value={role} onValueChange={setRole} required disabled={loading}>
              <SelectTrigger className="w-full mt-1 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                                        <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="PARTNER">Partner</SelectItem>
                <SelectItem value="BUYER">Buyer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === 'PARTNER' && (
            <>
              <div>
                <Label htmlFor="companyName" className="text-black dark:text-white">Company Name</Label>
                <Input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required={role === 'PARTNER'} className="mt-1 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600" />
              </div>
              <div>
                <Label htmlFor="companyAddress" className="text-black dark:text-white">Company Address</Label>
                <Input id="companyAddress" type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} required={role === 'PARTNER'} className="mt-1 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600" />
              </div>
            </>
          )}



          <Button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity" disabled={loading}>
            {loading ? "Updating..." : "Update User"}
          </Button>
          <Button type="button" onClick={() => navigate(-1)} variant="outline" className="w-full mt-2 bg-transparent border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserForm;
