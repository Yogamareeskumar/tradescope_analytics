import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const LoginFooter = ({ isLoading }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (!isLoading) {
      navigate(path);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Button
            variant="link"
            onClick={() => handleNavigation('/register')}
            disabled={isLoading}
            className="p-0 h-auto text-accent hover:text-accent/80 font-medium"
          >
            Create Account
          </Button>
        </p>
      </div>
      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
        <button 
          onClick={() => handleNavigation('/privacy-policy')}
          disabled={isLoading}
          className="hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Privacy Policy
        </button>
        <button 
          onClick={() => handleNavigation('/terms-of-service')}
          disabled={isLoading}
          className="hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Terms of Service
        </button>
        <button 
          onClick={() => handleNavigation('/help-support')}
          disabled={isLoading}
          className="hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Support
        </button>
      </div>
      {/* Copyright */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date()?.getFullYear()} TradeScope Analytics. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginFooter;