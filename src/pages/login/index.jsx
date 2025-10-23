import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import SocialLogin from './components/SocialLogin';
import LoginHeader from './components/LoginHeader';
import LoginFooter from './components/LoginFooter';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(formData?.email, formData?.password);
      
      if (result?.error) {
        // Ensure error is always a string, not an Error object
        const errorMessage = typeof result?.error === 'string' 
          ? result?.error 
          : result?.error?.message || 'Login failed. Please try again.';
        setError(errorMessage);
      } else {
        // Success - useAuth will handle redirect via useEffect
        navigate('/dashboard');
      }
    } catch (err) {
      // Ensure caught errors are also converted to strings
      const errorMessage = err instanceof Error 
        ? err?.message 
        : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <LoginHeader />

        {/* Main Login Card */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Demo Credentials Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">Trader:</span>
                  <span className="font-mono text-blue-800">trader@tradescope.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Password:</span>
                  <span className="font-mono text-blue-800">TradeScope2024!</span>
                </div>
                <hr className="my-2 border-blue-200" />
                <div className="flex justify-between">
                  <span className="text-blue-600">Admin:</span>
                  <span className="font-mono text-blue-800">admin@tradescope.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Password:</span>
                  <span className="font-mono text-blue-800">Admin2024!</span>
                </div>
                <hr className="my-2 border-blue-200" />
                <div className="flex justify-between">
                  <span className="text-blue-600">Analyst:</span>
                  <span className="font-mono text-blue-800">analyst@tradescope.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Password:</span>
                  <span className="font-mono text-blue-800">Analyst2024!</span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />

            {/* Social Login */}
            <SocialLogin isLoading={isLoading} />
          </div>
        </div>

        {/* Security Badges */}
        <SecurityBadges />

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

export default Login;