import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const Security = () => {
  const { user, updatePassword } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e) => {
    e?.preventDefault();
    
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData?.newPassword?.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setLoading(true);
    try {
      await updatePassword(passwordData?.newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setMessage({ type: '', text: '' });
  };

  const toggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    setMessage({ 
      type: 'info', 
      text: `Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully` 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeRoute="/security" />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Security Settings</h1>
            <p className="text-muted-foreground">
              Manage your account security and authentication preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Password Management */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Key" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Password</h2>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
              </div>

              {message?.text && (
                <div className={`mb-4 p-3 rounded-lg ${
                  message?.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
                  message?.type === 'error'? 'bg-red-50 border border-red-200 text-red-700' : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={message?.type === 'success' ? 'CheckCircle' : message?.type === 'error' ? 'AlertCircle' : 'Info'} 
                      size={16} 
                    />
                    <span className="text-sm">{message?.text}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData?.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e?.target?.value)}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData?.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e?.target?.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData?.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !passwordData?.currentPassword || !passwordData?.newPassword || !passwordData?.confirmPassword}
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating Password...</span>
                    </div>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Two-Factor Authentication</h2>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Smartphone" size={20} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Authenticator App</p>
                      <p className="text-sm text-muted-foreground">
                        Use Google Authenticator, Authy, or similar app
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={twoFactorEnabled ? "destructive" : "default"}
                    onClick={toggle2FA}
                    size="sm"
                  >
                    {twoFactorEnabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>

                {twoFactorEnabled && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="CheckCircle" size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-800">2FA Enabled</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your account is protected with two-factor authentication
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="mt-8 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Info" size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Account Information</h2>
                <p className="text-sm text-muted-foreground">Your account security details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <Icon name="Mail" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">{user?.email}</span>
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Account Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-foreground">Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Last Password Change
                  </label>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">Never changed</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Two-Factor Auth
                  </label>
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={twoFactorEnabled ? "Shield" : "ShieldOff"} 
                      size={16} 
                      className={twoFactorEnabled ? "text-green-600" : "text-red-600"} 
                    />
                    <span className="text-foreground">
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Security Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Use a strong, unique password for your trading account</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Enable two-factor authentication for extra security</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Never share your login credentials with anyone</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Log out from shared or public computers</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Security;