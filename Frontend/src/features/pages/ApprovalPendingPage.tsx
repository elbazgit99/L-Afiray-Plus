import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, LogOut } from 'lucide-react';

const ApprovalPendingPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If user is not a partner or is approved, redirect
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (user.role !== 'PARTNER') {
      navigate('/login', { replace: true });
      return;
    }
    
    if (user.isApproved) {
      navigate('/partner-dashboard', { replace: true });
      return;
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user || user.role !== 'PARTNER' || user.isApproved) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-gray-600 dark:text-gray-300" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Account Pending Approval
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
            Hello {user.name}, your partner account for {user.companyName} is currently under review
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
              onClick={handleLogout}
              className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              onClick={() => {
                const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=lafirayservice@gmail.com&su=Partner Account Approval Inquiry';
                window.open(gmailUrl, '_blank');
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalPendingPage; 