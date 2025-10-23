import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateProfile, profileLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    trading_experience: 'beginner',
    preferred_currency: 'INR',
    risk_tolerance: 'moderate'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load user profile data when component mounts
  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile?.full_name || '',
        phone: userProfile?.phone || '',
        bio: userProfile?.bio || '',
        trading_experience: userProfile?.trading_experience || 'beginner',
        preferred_currency: userProfile?.preferred_currency || 'INR',
        risk_tolerance: userProfile?.risk_tolerance || 'moderate'
      });
    }
  }, [userProfile]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous error/success messages
    setError('');
    setSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: updateError } = await updateProfile(formData);
      
      if (updateError) {
        setError(updateError?.message || 'Failed to update profile');
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const experienceOptions = [
    { value: 'beginner', label: 'Beginner (0-1 years)' },
    { value: 'intermediate', label: 'Intermediate (1-5 years)' },
    { value: 'advanced', label: 'Advanced (5+ years)' },
    { value: 'professional', label: 'Professional Trader' }
  ];

  const currencyOptions = [
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' }
  ];

  const riskOptions = [
    { value: 'conservative', label: 'Conservative' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'aggressive', label: 'Aggressive' }
  ];

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="ArrowLeft" size={20} />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and trading preferences</p>
        </div>

        {/* Account Information Card */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
              <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
              <p className="text-xs text-muted-foreground">Member since: {new Date(user?.created_at)?.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <Icon name="CheckCircle" size={20} className="text-green-600" />
              <span className="text-green-700 font-medium">Profile updated successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <Icon name="AlertCircle" size={20} className="text-red-600" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <Input
                type="text"
                name="full_name"
                value={formData?.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData?.phone}
                onChange={handleInputChange}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData?.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Tell us about yourself and your trading journey..."
            />
          </div>

          <h4 className="text-md font-semibold text-foreground mb-4 mt-8">Trading Preferences</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Trading Experience */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Trading Experience
              </label>
              <select
                name="trading_experience"
                value={formData?.trading_experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {experienceOptions?.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Currency */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preferred Currency
              </label>
              <select
                name="preferred_currency"
                value={formData?.preferred_currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {currencyOptions?.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Risk Tolerance */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground mb-2">
              Risk Tolerance
            </label>
            <select
              name="risk_tolerance"
              value={formData?.risk_tolerance}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {riskOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfileSettings;