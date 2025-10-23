import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CaptchaVerification = ({ onVerify, error }) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Generate random captcha code
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars?.charAt(Math.floor(Math.random() * chars?.length));
    }
    setCaptchaCode(result);
    setUserInput('');
    setIsVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    const verified = userInput?.toUpperCase() === captchaCode;
    setIsVerified(verified);
    onVerify(verified);
  };

  const handleInputChange = (e) => {
    setUserInput(e?.target?.value);
    if (isVerified) {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Icon name="Shield" size={18} className="text-accent" />
        <h3 className="text-sm font-semibold text-foreground">Security Verification</h3>
      </div>
      {/* Captcha Display */}
      <div className="flex items-center space-x-4">
        <div className="bg-muted border border-border rounded-lg p-4 flex-1">
          <div className="bg-white rounded p-3 border-2 border-dashed border-border">
            <div 
              className="text-2xl font-bold text-center tracking-wider select-none font-mono"
              style={{
                background: 'linear-gradient(45deg, #1E3A8A, #3B82F6, #1E3A8A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {captchaCode}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={generateCaptcha}
          title="Generate new captcha"
        >
          <Icon name="RefreshCw" size={16} />
        </Button>
      </div>
      {/* Input Field */}
      <div className="relative">
        <Input
          label="Enter the code shown above"
          type="text"
          placeholder="Enter captcha code"
          value={userInput}
          onChange={handleInputChange}
          error={error}
          className="uppercase tracking-wider"
          maxLength={6}
        />
        {isVerified && (
          <div className="absolute right-3 top-9 text-success">
            <Icon name="CheckCircle" size={16} />
          </div>
        )}
      </div>
      {/* Verify Button */}
      <Button
        variant="outline"
        onClick={handleVerify}
        disabled={userInput?.length !== 6}
        className="w-full"
        iconName="Shield"
        iconPosition="left"
      >
        Verify Security Code
      </Button>
      {/* Help Text */}
      <p className="text-xs text-muted-foreground text-center">
        This helps us ensure you're a real person and protects against automated registrations
      </p>
    </div>
  );
};

export default CaptchaVerification;