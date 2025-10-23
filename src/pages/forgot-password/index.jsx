import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import LoginHeader from '../login/components/LoginHeader';
import LoginFooter from '../login/components/LoginFooter';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await resetPassword(email);
      
      if (result?.error) {
        const errorMessage = typeof result?.error === 'string' 
          ? result?.error 
          : result?.error?.message || 'Failed to send reset email. Please try again.';
        setError(errorMessage);
      } else {
        setMessage('Password reset email sent! Check your inbox and follow the instructions.');
        setIsSubmitted(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err?.message 
        : 'Failed to send reset email. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <LoginHeader />

        {/* Main Forgot Password Card */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="KeyRound" size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
              </h2>
              <p className="text-muted-foreground">
                {isSubmitted 
                  ? 'We\'ve sent password reset instructions to your email address.' :'Enter your email address and we\'ll send you a link to reset your password.'
                }
              </p>
            </div>

            {isSubmitted ? (
              // Success State
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <p className="text-sm text-green-800 font-medium">{message}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    type="button"
                    onClick={() => window.open('mailto:')}
                    variant="outline"
                    fullWidth
                    iconName="Mail"
                    iconPosition="left"
                  >
                    Open Email App
                  </Button>

                  <Button
                    type="button"
                    onClick={handleBackToLogin}
                    variant="ghost"
                    fullWidth
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Back to Login
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email?{' '}
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setMessage('');
                        setError('');
                      }}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // Form State
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value)}
                  required
                  disabled={isLoading}
                  autoFocus
                />

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={16} className="text-destructive" />
                      <p className="text-sm text-destructive font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  iconName="Send"
                  iconPosition="left"
                  className="h-12"
                >
                  Send Reset Link
                </Button>

                <Button
                  type="button"
                  onClick={handleBackToLogin}
                  variant="ghost"
                  fullWidth
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Login
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <LoginFooter isLoading={isLoading} />
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default ForgotPassword;