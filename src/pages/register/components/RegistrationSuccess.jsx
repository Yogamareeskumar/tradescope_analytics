import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationSuccess = ({ email, onResendEmail }) => {
  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={40} className="text-success" />
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Account Created Successfully!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We've sent a verification email to <span className="font-semibold text-foreground">{email}</span>. 
          Please check your inbox and click the verification link to activate your account.
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-muted/30 rounded-lg p-6 border border-border text-left max-w-md mx-auto">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Mail" size={18} className="mr-2 text-accent" />
          Next Steps
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start">
            <span className="font-semibold text-accent mr-2">1.</span>
            Check your email inbox (and spam folder)
          </li>
          <li className="flex items-start">
            <span className="font-semibold text-accent mr-2">2.</span>
            Click the verification link in the email
          </li>
          <li className="flex items-start">
            <span className="font-semibold text-accent mr-2">3.</span>
            Return to sign in with your credentials
          </li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={onResendEmail}
          className="w-full max-w-sm"
          iconName="RefreshCw"
          iconPosition="left"
        >
          Resend Verification Email
        </Button>
        
        <Button
          variant="default"
          onClick={handleLoginRedirect}
          className="w-full max-w-sm"
          iconName="ArrowRight"
          iconPosition="right"
        >
          Go to Sign In
        </Button>
      </div>

      {/* Support */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Didn't receive the email? Check your spam folder or contact our support team at{' '}
          <a href="mailto:support@tradescope.com" className="text-accent hover:underline">
            support@tradescope.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;