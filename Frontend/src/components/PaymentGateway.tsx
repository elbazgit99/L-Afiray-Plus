import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CreditCard, Lock, Shield, CheckCircle } from 'lucide-react';

interface PaymentGatewayProps {
  itemName: string;
  price: number;
  onPaymentSuccess: () => void;
  trigger: React.ReactNode;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  itemName,
  price,
  onPaymentSuccess,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment successful!', {
        description: `Your order for ${itemName} has been confirmed.`
      });
      setIsOpen(false);
      onPaymentSuccess();
      setFormData({
        cardNumber: '',
        cardHolder: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        email: '',
        phone: '',
        address: ''
      });
    }, 2000);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Complete your purchase for {itemName} - {price.toFixed(2)} DH
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{itemName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Auto Part</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{price.toFixed(2)} DH</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Free Shipping</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="justify-start"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Card
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('bank')}
                className="justify-start"
              >
                <Shield className="h-4 w-4 mr-2" />
                Bank Transfer
              </Button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Information */}
              <div className="space-y-3">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    placeholder="John Doe"
                    value={formData.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                    required
                    className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    required
                    className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Expiry Month</Label>
                  <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange('expiryMonth', value)}>
                    <SelectTrigger className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                      {months.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Expiry Year</Label>
                  <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange('expiryYear', value)}>
                    <SelectTrigger className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
                      {years.map(year => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+212 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    className="bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your payment information is encrypted and secure
                </p>
              </div>

              {/* Payment Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Pay {price.toFixed(2)} DH
                  </>
                )}
              </Button>
            </form>
          )}

          {paymentMethod === 'bank' && (
            <div className="space-y-4">
              <Card className="bg-gray-50 dark:bg-gray-900">
                <CardHeader>
                  <CardTitle>Bank Transfer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Bank Name</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attijariwafa Bank</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Account Number</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">001-123456-789</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">IBAN</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">MA123 4567 8901 2345 6789 0123</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Reference</Label>
                    <p className="text-sm font-mono bg-gray-200 dark:bg-gray-700 p-2 rounded">
                      LAFIRAY-{Date.now().toString().slice(-6)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Button
                onClick={() => {
                  toast.success('Bank transfer details copied!', {
                    description: 'Please complete the transfer and contact support with the reference number.'
                  });
                  setIsOpen(false);
                }}
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                Confirm Bank Transfer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentGateway; 