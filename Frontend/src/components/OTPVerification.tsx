import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Shield, AlertCircle } from 'lucide-react';

interface OTPVerificationProps {
  onVerificationSuccess: () => void;
  onCancel: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  onVerificationSuccess,
  onCancel
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  // This would be the actual OTP code in a real application
  // For demo purposes, we'll use a fixed code
  const correctOTP = '1234';

  const handleVerification = async () => {
    if (otp.length !== 4) {
      toast.error('Please enter a 4-digit code');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otp === correctOTP) {
      toast.success('Access granted! You can now manage car inventory.');
      onVerificationSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= maxAttempts) {
        toast.error('Too many failed attempts. Please try again later.');
        onCancel();
      } else {
        toast.error(`Incorrect code. ${maxAttempts - newAttempts} attempts remaining.`);
        setOtp('');
      }
    }
    
    setIsLoading(false);
  };

  const handleResendOTP = () => {
    toast.info('New OTP code sent to your registered email');
    setOtp('');
    setAttempts(0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl text-black dark:text-white">
            Security Verification Required
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Enter the 4-digit verification code to access car management features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Demo Code: <strong>1234</strong>
              </span>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-black dark:text-white">
                Enter Verification Code
              </Label>
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={4}
                disabled={isLoading}
                className="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot 
                    index={0} 
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  />
                  <InputOTPSlot 
                    index={2} 
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  />
                  <InputOTPSlot 
                    index={3} 
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {attempts > 0 && (
              <div className="text-sm text-red-600 dark:text-red-400 text-center">
                Failed attempts: {attempts}/{maxAttempts}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleVerification}
              disabled={isLoading || otp.length !== 4}
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Access
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="w-full border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Resend Code
            </Button>
            
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification; 