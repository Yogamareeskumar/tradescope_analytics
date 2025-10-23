import React from 'react';
import Button from '../../../components/ui/Button';

const LoginFooter = ({ isLoading }) => {
  return (
    <div className="space-y-6">
      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Button
            variant="link"
            onClick={() => window.location.href = '/register'}
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
          onClick={() => console.log('Privacy Policy')}
          className="hover:text-foreground transition-colors"
        >
          Privacy Policy
        </button>
        <button 
          onClick={() => console.log('Terms of Service')}
          className="hover:text-foreground transition-colors"
        >
          Terms of Service
        </button>
        <button 
          onClick={() => console.log('Support')}
          className="hover:text-foreground transition-colors"
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