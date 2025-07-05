import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, Shield, AlertTriangle } from 'lucide-react';

interface ApprovalPendingBannerProps {
  partnerName: string;
  companyName: string;
}

const ApprovalPendingBanner: React.FC<ApprovalPendingBannerProps> = ({ 
  partnerName, 
  companyName 
}) => {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
            Account Pending Approval
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-300 text-lg">
            Hello {partnerName}, your partner account for {companyName} is currently under review
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Information */}
          <div className="bg-white dark:bg-black/50 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Current Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Application Status:</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
                  Under Review
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Review Process:</span>
                <span className="text-gray-900 dark:text-white font-medium">1-3 Business Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Notification:</span>
                <span className="text-gray-900 dark:text-white font-medium">Email</span>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-white dark:bg-black/50 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What happens next?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Application Review</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Our moderation team will review your company information and application details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Email Notification</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    You'll receive an email notification once your account is approved or if additional information is needed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
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
          <div className="bg-white dark:bg-black/50 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have questions about your application or need to provide additional information, 
              please contact our support team.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Email:</strong> support@lafiray.ma</p>
              <p><strong>Phone:</strong> +212 5 00 00 00 00</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              onClick={() => window.location.href = '/login'}
            >
              Back to Login
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open('mailto:support@lafiray.ma', '_blank')}
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