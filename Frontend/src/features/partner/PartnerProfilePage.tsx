import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2,Camera, CheckCircle, Clock} from 'lucide-react';
import axios from 'axios';

const PartnerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/users/profile-image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileImage(response.data.profileImage);
      toast.success('Profile image updated successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image', { 
        description: error.response?.data?.message || 'Network error' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user || user.role !== 'PARTNER') {
    return <div className="text-center text-black dark:text-white">Please log in as a Partner to view this page.</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black dark:text-white">My Partner Profile</h2>
      </div>
      
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Card */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 max-w-lg mx-auto flex-1 flex flex-col justify-center">
        <CardContent className="p-8 text-center">
          {/* Profile Image Section */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-6 overflow-hidden">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Building2 className="h-16 w-16 text-gray-500 dark:text-gray-400" />
                )}
              </div>
              
              {/* Upload Button */}
              <Button
                onClick={triggerFileInput}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors w-10 h-10 p-0 rounded-full"
                size="sm"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </Button>
            </div>
            {/* Add extra space between image and status badge */}
            <div className="h-6" />
            {/* Status Badge */}
            <div className="flex justify-center mb-10">
              {user.isApproved ? (
                <span className="flex items-center gap-2 text-black dark:text-white text-sm bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                  Approved
                </span>
              ) : (
                <span className="flex items-center gap-2 text-black dark:text-white text-sm bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                  <Clock className="h-5 w-5" />
                  Pending Approval
                </span>
              )}
            </div>
          </div>

          {/* Company and Partner Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-black dark:text-white mb-3">
              {user.companyName || 'Company Name'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg">
              Managed by {user.name}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 mb-8 text-left">
            {user.phone && (
              <div className="text-base text-black dark:text-white">
                <strong>Phone:</strong> {user.phone}
              </div>
            )}
            {user.companyAddress && (
              <div className="text-base text-black dark:text-white">
                <strong>Address:</strong> {user.companyAddress}
              </div>
            )}
            <div className="text-base text-black dark:text-white">
              <strong>Role:</strong> {user.role}
            </div>
            <div className="text-base text-black dark:text-white">
              <strong>Member Since:</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </div>
            <div className="text-base text-black dark:text-white">
              <strong>Account Status:</strong> {user.isApproved ? 'Active' : 'Pending Review'}
            </div>
          </div>

          {/* Approval Status Message */}
          {user.isApproved === false && (
            <div className="mb-6 p-5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
                Account Pending Approval
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                Your partner account is currently pending approval by our moderation team. 
                You will receive an email notification once your account is approved.
              </p>
              <div className="text-base text-gray-600 dark:text-gray-400">
                <h4 className="font-medium mb-3">What happens next?</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Our moderation team will review your application</li>
                  <li>• You'll receive an email notification once approved</li>
                  <li>• Once approved, you can access all partner features</li>
                  <li>• You can start adding car models and parts to your inventory</li>
                </ul>
              </div>
            </div>
          )}

          {user.isApproved === true && (
            <div className="mb-6">
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Your partner account has been approved! You can now access all partner features.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {/* Removed Sales History button */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerProfilePage;
