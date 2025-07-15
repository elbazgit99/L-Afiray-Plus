import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      toast.error('Invalid email', { description: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/users/forgot-password`, { email });
      toast.success('Reset code sent!', { description: 'Check your email for the 6-digit code.' });
      setStep('code');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset code', { 
        description: error.response?.data?.message || 'Please check your email and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetCode.length !== 6) {
      toast.error('Invalid code', { description: 'Please enter the 6-digit code from your email.' });
      return;
    }

    setLoading(true);
    try {
      // Call backend to verify code
      await axios.post(`${API_BASE_URL}/users/verify-reset-code`, {
        email,
        resetCode
      });
      toast.success('Code verified!', { description: 'You can now set a new password.' });
      setStep('password');
    } catch (error: any) {
      toast.error('Invalid or expired code', { description: error.response?.data?.message || 'Please check the code and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password too short', { description: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', { description: 'Please make sure both passwords are the same.' });
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/users/reset-password`, {
        email,
        resetCode,
        newPassword
      });
      
      toast.success('Password reset successful!', { description: 'You can now login with your new password.' });
      onSuccess();
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error('Failed to reset password', { 
        description: error.response?.data?.message || 'Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email required', { description: 'Please go back and enter your email first.' });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/users/forgot-password`, { email });
      toast.success('New code sent!', { description: 'Check your email for the new 6-digit code.' });
    } catch (error: any) {
      console.error('Resend code error:', error);
      toast.error('Failed to resend code', { 
        description: error.response?.data?.message || 'Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.trim());
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setResetCode(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 px-6 sm:px-12 lg:px-24">
      <div className="p-8 rounded-lg shadow-md bg-white dark:bg-black border border-gray-200 dark:border-gray-700 w-full max-w-sm relative">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 p-2 h-auto w-auto text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="sr-only">Back to Login</span>
        </Button>

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Forgot Password</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Enter your email address and we'll send you a reset code.
            </p>
            
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    autoComplete="email"
                    className="pl-10 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity" 
                disabled={loading || !email || !email.includes('@')}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          </>
        )}

        {/* Step 2: Code Verification */}
        {step === 'code' && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Enter Reset Code</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              We've sent a 6-digit code to <strong className="text-black dark:text-white">{email}</strong>
            </p>
            
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <Label htmlFor="code" className="text-black dark:text-white">Reset Code</Label>
                <div className="relative mt-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={resetCode}
                    onChange={handleCodeChange}
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                    className="text-center text-lg tracking-widest bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStep('email')}
                  className="flex-1 border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                  disabled={resetCode.length !== 6}
                >
                  Verify Code
                </Button>
              </div>
              
              <Button 
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                {loading ? "Sending..." : "Resend Code"}
              </Button>
            </form>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 'password' && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Set New Password</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Enter your new password below.
            </p>
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="newPassword" className="text-black dark:text-white mb-2">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="pl-10 pr-10 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-black dark:text-white mb-2">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="pl-10 pr-10 bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStep('code')}
                  className="flex-1 border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                  disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 