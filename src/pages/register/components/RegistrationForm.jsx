import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    experienceLevel: '',
    assetClasses: [],
    baseCurrency: 'USD',
    agreeTerms: false,
    agreePrivacy: false,
    emailMarketing: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-1 years)' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)' },
    { value: 'advanced', label: 'Advanced (3-5 years)' },
    { value: 'expert', label: 'Expert (5+ years)' }
  ];

  const assetClassOptions = [
    { value: 'stocks', label: 'Stocks & Equities' },
    { value: 'forex', label: 'Foreign Exchange (Forex)' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'options', label: 'Options' },
    { value: 'futures', label: 'Futures' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'INR', label: 'INR - Indian Rupee' }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/?.test(password)) strength += 25;
    return strength;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Password strength calculation
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Email availability check (mock)
    if (field === 'email' && value?.includes('@')) {
      setTimeout(() => {
        const mockUnavailableEmails = ['admin@tradescope.com', 'test@example.com'];
        setEmailAvailable(!mockUnavailableEmails?.includes(value));
      }, 500);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (emailAvailable === false) {
      newErrors.email = 'This email is already registered';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.experienceLevel) {
      newErrors.experienceLevel = 'Please select your trading experience';
    }

    if (formData?.assetClasses?.length === 0) {
      newErrors.assetClasses = 'Please select at least one asset class';
    }

    if (!formData?.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service';
    }

    if (!formData?.agreePrivacy) {
      newErrors.agreePrivacy = 'You must agree to the Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-destructive';
    if (passwordStrength < 50) return 'bg-warning';
    if (passwordStrength < 75) return 'bg-accent';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}
      
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
        />

        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />
          {emailAvailable === true && (
            <div className="absolute right-3 top-9 text-success">
              <Icon name="Check" size={16} />
            </div>
          )}
          {emailAvailable === false && (
            <div className="absolute right-3 top-9 text-destructive">
              <Icon name="X" size={16} />
            </div>
          )}
        </div>
      </div>
      {/* Security */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Security</h3>
        
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />
          {formData?.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Password Strength</span>
                <span className={`font-medium ${
                  passwordStrength < 25 ? 'text-destructive' :
                  passwordStrength < 50 ? 'text-warning' :
                  passwordStrength < 75 ? 'text-accent' : 'text-success'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
      </div>
      {/* Trading Profile */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Trading Profile</h3>
        
        <Select
          label="Trading Experience Level"
          placeholder="Select your experience level"
          options={experienceLevels}
          value={formData?.experienceLevel}
          onChange={(value) => handleInputChange('experienceLevel', value)}
          error={errors?.experienceLevel}
          required
        />

        <Select
          label="Primary Asset Classes"
          description="Select the asset classes you trade or plan to trade"
          placeholder="Choose asset classes"
          options={assetClassOptions}
          value={formData?.assetClasses}
          onChange={(value) => handleInputChange('assetClasses', value)}
          error={errors?.assetClasses}
          multiple
          searchable
          required
        />

        <Select
          label="Preferred Base Currency"
          placeholder="Select your base currency"
          options={currencyOptions}
          value={formData?.baseCurrency}
          onChange={(value) => handleInputChange('baseCurrency', value)}
        />
      </div>
      {/* Legal Agreements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Legal Agreements</h3>
        
        <Checkbox
          label="I agree to the Terms of Service"
          description="By checking this box, you agree to our terms and conditions"
          checked={formData?.agreeTerms}
          onChange={(e) => handleInputChange('agreeTerms', e?.target?.checked)}
          error={errors?.agreeTerms}
          required
        />

        <Checkbox
          label="I agree to the Privacy Policy"
          description="By checking this box, you acknowledge our privacy practices"
          checked={formData?.agreePrivacy}
          onChange={(e) => handleInputChange('agreePrivacy', e?.target?.checked)}
          error={errors?.agreePrivacy}
          required
        />

        <Checkbox
          label="I would like to receive email updates and trading insights"
          description="Optional: Get market insights, platform updates, and trading tips"
          checked={formData?.emailMarketing}
          onChange={(e) => handleInputChange('emailMarketing', e?.target?.checked)}
        />
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        loading={isLoading}
        fullWidth
        className="mt-8"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegistrationForm;