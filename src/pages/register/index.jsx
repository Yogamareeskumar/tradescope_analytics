import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import RegistrationHeader from './components/RegistrationHeader';
import SecurityBadges from './components/SecurityBadges';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, signUp } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegister = async (formData) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await signUp(formData?.email, formData?.password, {
        fullName: formData?.fullName,
        role: formData?.role || 'trader'
      });

      if (result?.error) {
        setError(result?.error);
      } else {
        setSuccess(true);
        // Optionally redirect after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Please check your email to confirm your account before signing in.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <RegistrationHeader />

        {/* Main Registration Card */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Registration Form */}
            <RegistrationForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
            />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-semibold text-accent hover:text-accent/80 transition-colors"
                  disabled={isLoading}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <SecurityBadges />
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Register;