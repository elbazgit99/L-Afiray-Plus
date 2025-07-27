import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader,} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, AlertTriangle } from 'lucide-react';

interface ApprovalPendingBannerProps {
  partnerName: string;
  companyName: string;
}

const ApprovalPendingBanner: React.FC<ApprovalPendingBannerProps> = ({ 
  partnerName, 
  companyName 
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleBackToLogin = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-gray-600 dark:text-gray-300" />
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
            Hello {partnerName}, your partner account for {companyName} is currently under review
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* What happens next */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What happens next?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-gray-600 dark:text-gray-300 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Application Review</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Our moderation team will review your company information and application details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-gray-600 dark:text-gray-300 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Email Notification</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    You'll receive an email notification once your account is approved or if additional information is needed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-gray-600 dark:text-gray-300 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Access Granted</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Once approved, you can access all partner features including inventory management and sales reports.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Important Notice</h4>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  You cannot access partner features until your account is approved. Please wait for the email notification 
                  from our moderation team before attempting to log in again.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
              Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have questions about your application or need to provide additional information, 
              please contact our support team.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Email:</strong> lafirayservice@gmail.com</p>
              <p><strong>Phone:</strong> +212 5 00 00 00 00</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={handleBackToLogin}
            >
              Back to Login
            </Button>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              onClick={() => window.open('mailto:lafirayservice@gmail.com', '_blank')}
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalPendingBanner; 