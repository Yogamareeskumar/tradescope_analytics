import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import UpstoxService from '../../../services/upstoxService';

const UpstoxIntegrationModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState('config'); // config, auth, success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [config, setConfig] = useState({
    clientId: '',
    clientSecret: '',
    redirectUri: `${window.location?.origin}/broker-integration?broker=upstox`
  });
  const [authUrl, setAuthUrl] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Check existing connection on modal open
  useEffect(() => {
    if (isOpen) {
      checkExistingConnection();
    }
  }, [isOpen]);

  // Handle URL parameters for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams?.get('code');
    const state = urlParams?.get('state');
    const broker = urlParams?.get('broker');
    
    if (isOpen && code && broker === 'upstox') {
      setAuthCode(code);
      setStep('auth');
      handleTokenExchange(code);
      
      // Clean up URL
      window.history?.replaceState({}, document.title, window.location?.pathname);
    }
  }, [isOpen]);

  const checkExistingConnection = async () => {
    const status = await UpstoxService?.getConnectionStatus();
    setConnectionStatus(status);
    
    if (status?.connected) {
      setStep('success');
    }
  };

  const validateConfiguration = () => {
    const errors = [];
    
    if (!config?.clientId || config?.clientId?.length < 10) {
      errors?.push('Client ID must be at least 10 characters long');
    }
    
    if (!config?.clientSecret || config?.clientSecret?.length < 20) {
      errors?.push('Client Secret must be at least 20 characters long');
    }
    
    // Validate redirect URI format
    try {
      const url = new URL(config.redirectUri);
      if (!url?.searchParams?.get('broker')) {
        errors?.push('Redirect URI must include broker=upstox parameter');
      }
    } catch (e) {
      errors?.push('Invalid redirect URI format');
    }
    
    return errors;
  };

  const generateAuthUrl = () => {
    const validationErrors = validateConfiguration();
    if (validationErrors?.length > 0) {
      setError(validationErrors?.join(', '));
      return;
    }

    const state = Math.random()?.toString(36)?.substring(7);
    const url = UpstoxService?.generateAuthUrl(config?.clientId, config?.redirectUri, state);
    setAuthUrl(url);
    setStep('auth');
    setError('');
  };

  const handleTokenExchange = async (code) => {
    setLoading(true);
    setError('');

    try {
      const result = await UpstoxService?.exchangeCodeForToken(
        code,
        config?.clientId,
        config?.clientSecret,
        config?.redirectUri
      );

      if (result?.success) {
        setStep('success');
        onSuccess?.(result?.data);
      } else {
        setError(result?.error);
        setStep('config');
      }
    } catch (err) {
      setError('Failed to complete authentication');
      setStep('config');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const result = await UpstoxService?.disconnect();
      if (result?.success) {
        setConnectionStatus({ connected: false });
        setStep('config');
        onSuccess?.();
      } else {
        setError(result?.error);
      }
    } catch (err) {
      setError('Failed to disconnect');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await UpstoxService?.importTradesToDatabase();
      if (result?.success) {
        onSuccess?.(result?.data);
        onClose();
      } else {
        setError(result?.error);
      }
    } catch (err) {
      setError('Failed to sync data');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Upstox Integration</h3>
              <p className="text-sm text-muted-foreground">Connect your Upstox account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Configuration Step */}
        {step === 'config' && (
          <div className="space-y-4">
            {/* Enhanced Setup Guide */}
            <div className="bg-accent/10 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-accent">Setup Instructions</p>
                  <ol className="text-muted-foreground mt-2 space-y-1 text-xs list-decimal list-inside">
                    <li>Go to <a href="https://account.upstox.com/developer/apps" target="_blank" rel="noopener" className="text-accent underline">Upstox Developer Console</a></li>
                    <li>Create/Edit your app and copy Client ID & Secret</li>
                    <li>Set Redirect URI to: <code className="bg-muted px-1 rounded text-xs">{config?.redirectUri}</code></li>
                    <li>Ensure exact URL match (including query parameters)</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Client ID"
                value={config?.clientId}
                onChange={(e) => setConfig(prev => ({ ...prev, clientId: e?.target?.value?.trim() }))}
                placeholder="Enter your Upstox Client ID (e.g., abcd1234-5678-90ef-ghij-klmnopqrstuv)"
                required
              />
              
              <Input
                label="Client Secret"
                type="password"
                value={config?.clientSecret}
                onChange={(e) => setConfig(prev => ({ ...prev, clientSecret: e?.target?.value?.trim() }))}
                placeholder="Enter your Upstox Client Secret"
                required
              />
              
              <div className="space-y-2">
                <Input
                  label="Redirect URI"
                  value={config?.redirectUri}
                  onChange={(e) => setConfig(prev => ({ ...prev, redirectUri: e?.target?.value }))}
                  placeholder="Redirect URI"
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ This must exactly match the redirect URI in your Upstox Developer Console
                </p>
              </div>
            </div>

            {/* Common Issues */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm font-medium text-destructive mb-2">Common Issues:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Client ID/Secret copied incorrectly (check for extra spaces)</li>
                <li>• Redirect URI mismatch (must include "?broker=upstox")</li>
                <li>• Using localhost in production or vice versa</li>
                <li>• Case sensitivity in URLs</li>
              </ul>
            </div>

            {error && (
              <div className="bg-destructive/10 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Configuration Error</p>
                    <p className="text-sm text-destructive mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} fullWidth>
                Cancel
              </Button>
              <Button 
                onClick={generateAuthUrl}
                disabled={!config?.clientId || !config?.clientSecret}
                fullWidth
              >
                Continue to Authorization
              </Button>
            </div>
          </div>
        )}

        {/* Authentication Step */}
        {step === 'auth' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="ExternalLink" size={24} className="text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Authorize Upstox</h4>
              <p className="text-muted-foreground mb-4">
                Click the button below to authorize TradeScope to access your Upstox account.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <span className="ml-3 text-muted-foreground">Processing authentication...</span>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => window.open(authUrl, '_blank')}
                  iconName="ExternalLink"
                  iconPosition="right"
                  fullWidth
                >
                  Authorize on Upstox
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    After authorization, you'll be redirected back automatically.
                  </p>
                </div>
              </>
            )}

            {error && (
              <div className="bg-destructive/10 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">OAuth Error (UDAPI100068)</p>
                    <p className="text-sm text-destructive mt-1">{error}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>Double-check:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Client ID is correct (no extra spaces)</li>
                        <li>Redirect URI matches exactly in Upstox Console</li>
                        <li>App is in "Published" status in Upstox Console</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button variant="outline" onClick={() => setStep('config')} fullWidth>
              Back to Configuration
            </Button>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={24} className="text-success" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Connected Successfully!</h4>
              <p className="text-muted-foreground mb-4">
                Your Upstox account is now connected to TradeScope.
              </p>
            </div>

            {connectionStatus && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-success font-medium">Connected</span>
                </div>
                {connectionStatus?.lastSync && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span className="text-foreground">
                      {new Date(connectionStatus.lastSync)?.toLocaleString()}
                    </span>
                  </div>
                )}
                {connectionStatus?.userInfo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account:</span>
                    <span className="text-foreground">{connectionStatus?.userInfo?.user_name}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleDisconnect}
                loading={loading}
                iconName="Unlink"
                iconPosition="left"
              >
                Disconnect
              </Button>
              <Button
                onClick={handleSyncData}
                loading={loading}
                iconName="RefreshCw"
                iconPosition="left"
                fullWidth
              >
                Sync Data Now
              </Button>
            </div>

            <Button variant="outline" onClick={onClose} fullWidth>
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpstoxIntegrationModal;