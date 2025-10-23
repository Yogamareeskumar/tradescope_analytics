import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationHeader = () => {
  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="TrendingUp" size={24} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">TradeScope</h1>
          <p className="text-sm text-muted-foreground font-medium">Analytics</p>
        </div>
      </div>

      {/* Header Content */}
      <div className="space-y-2 mb-6">
        <h2 className="text-3xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Join thousands of traders who trust TradeScope for professional-grade analytics and performance tracking
        </p>
      </div>

      {/* Login Link */}
      <div className="flex items-center justify-center space-x-2 text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Button
          variant="link"
          onClick={handleLoginRedirect}
          className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
        >
          Sign in here
        </Button>
      </div>
    </div>
  );
};

export default RegistrationHeader;