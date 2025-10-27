import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Image from '../../../components/AppImage';
import { TradingService } from '../../../services/tradingService';
import BrokerCredentialService from '../../../services/brokerCredentialService';

const AddBrokerModal = ({ isOpen, onClose, onAdd }) => {
  const [selectedBroker, setSelectedBroker] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    userId: '',
    password: '',
    totpKey: '',
    serverAddress: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const supportedBrokers = [
  {
    value: 'zerodha',
    label: 'Zerodha Kite',
    description: 'India\'s largest retail broker',
    logo: "https://images.unsplash.com/photo-1690692927220-12c0d6305389",
    fields: ['apiKey', 'apiSecret', 'userId', 'password', 'totpKey']
  },
  {
    value: 'mt5',
    label: 'MetaTrader 5',
    description: 'Multi-asset trading platform',
    logo: "https://images.unsplash.com/photo-1642052503374-13c45f288e5e",
    fields: ['userId', 'password', 'serverAddress']
  },
  {
    value: 'interactive',
    label: 'Interactive Brokers',
    description: 'Global electronic trading',
    logo: "https://images.unsplash.com/photo-1614029951470-ef9eb9952be7",
    fields: ['apiKey', 'userId', 'password']
  },
  {
    value: 'alpaca',
    label: 'Alpaca Markets',
    description: 'Commission-free trading API',
    logo: "https://images.unsplash.com/photo-1644995520599-211478ea8254",
    fields: ['apiKey', 'apiSecret']
  }];


  const getFieldConfig = (fieldName) => {
    const configs = {
      apiKey: {
        label: 'API Key',
        type: 'password',
        placeholder: 'Enter your API key',
        description: 'Your broker API key for authentication'
      },
      apiSecret: {
        label: 'API Secret',
        type: 'password',
        placeholder: 'Enter your API secret',
        description: 'Secret key paired with your API key'
      },
      userId: {
        label: 'User ID',
        type: 'text',
        placeholder: 'Enter your user ID',
        description: 'Your broker account user ID'
      },
      password: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        description: 'Your broker account password'
      },
      totpKey: {
        label: 'TOTP Key',
        type: 'password',
        placeholder: 'Enter TOTP key',
        description: 'Time-based one-time password key'
      },
      serverAddress: {
        label: 'Server Address',
        type: 'text',
        placeholder: 'Enter server address',
        description: 'MT5 server address'
      }
    };
    return configs?.[fieldName] || {};
  };

  const handleBrokerSelect = (value) => {
    setSelectedBroker(value);
    setStep(2);
    setFormData({
      apiKey: '',
      apiSecret: '',
      userId: '',
      password: '',
      totpKey: '',
      serverAddress: ''
    });
    setConnectionStatus(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setConnectionStatus(null);

    try {
      const broker = supportedBrokers?.find((b) => b?.value === selectedBroker);
      
      const brokerData = {
        name: broker?.label,
        apiKey: formData?.apiKey,
        apiSecret: formData?.apiSecret,
        userId: formData?.userId,
        password: formData?.password,
        totpKey: formData?.totpKey,
        serverAddress: formData?.serverAddress,
        accountId: formData?.userId
      };

      // Add broker using enhanced TradingService
      const result = await TradingService?.addBroker(brokerData);

      if (result?.success) {
        setConnectionStatus({
          type: 'success',
          message: 'Broker connected successfully!',
          details: result?.data?.connectionTest?.success ? 
            'Connection test passed. Data synchronization will begin shortly.' : 'Broker added but connection test failed. Please check your credentials.'
        });
        
        // Call parent callback
        onAdd?.();
        
        // Close modal after delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setConnectionStatus({
          type: 'error',
          message: 'Failed to connect broker',
          details: result?.error || 'Please check your credentials and try again.'
        });
      }
    } catch (error) {
      console.error('Add broker error:', error);
      setConnectionStatus({
        type: 'error',
        message: 'Connection failed',
        details: error?.message || 'An unexpected error occurred.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test connection without saving
  const handleTestConnection = async () => {
    setIsLoading(true);
    setConnectionStatus(null);

    try {
      const broker = supportedBrokers?.find((b) => b?.value === selectedBroker);
      
      let testResult = { success: false, error: 'Connection test not implemented for this broker' };
      
      // Simulate connection test based on broker type
      switch (selectedBroker) {
        case 'zerodha':
          testResult = await BrokerCredentialService?.testZerodhaConnection(formData);
          break;
        case 'alpaca':
          testResult = await BrokerCredentialService?.testAlpacaConnection(formData);
          break;
        case 'interactive':
          testResult = await BrokerCredentialService?.testInteractiveBrokersConnection(formData);
          break;
        case 'mt5':
          testResult = await BrokerCredentialService?.testMT5Connection(formData);
          break;
        default:
          testResult = { success: true, data: { status: 'test_successful' }, error: null };
      }

      if (testResult?.success) {
        setConnectionStatus({
          type: 'success',
          message: 'Connection test successful!',
          details: 'Your credentials are valid and the connection is working.'
        });
      } else {
        setConnectionStatus({
          type: 'error',
          message: 'Connection test failed',
          details: testResult?.error || 'Please verify your credentials.'
        });
      }
    } catch (error) {
      console.error('Test connection error:', error);
      setConnectionStatus({
        type: 'error',
        message: 'Connection test failed',
        details: error?.message || 'Unable to test connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedBroker('');
    setFormData({
      apiKey: '',
      apiSecret: '',
      userId: '',
      password: '',
      totpKey: '',
      serverAddress: ''
    });
    setConnectionStatus(null);
    onClose();
  };

  const selectedBrokerData = supportedBrokers?.find((b) => b?.value === selectedBroker);
  const isFormValid = selectedBrokerData?.fields?.every((field) => 
    formData?.[field]?.trim()?.length > 0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">
            {step === 1 ? 'Add Broker Connection' : `Connect to ${selectedBrokerData?.label}`}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}>

            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6">
          {step === 1 &&
          <div className="space-y-4">
              <p className="text-muted-foreground">
                Select your broker to set up automatic trade import and data synchronization.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportedBrokers?.map((broker) =>
              <button
                key={broker?.value}
                onClick={() => handleBrokerSelect(broker?.value)}
                className="p-4 border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-colors duration-200 text-left">

                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <Image
                      src={broker?.logo}
                      alt={`${broker?.label} broker platform logo`}
                      className="w-full h-full object-contain" />

                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-card-foreground">{broker?.label}</h3>
                        <p className="text-sm text-muted-foreground">{broker?.description}</p>
                      </div>
                      <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                    </div>
                  </button>
              )}
              </div>
            </div>
          }

          {step === 2 && selectedBrokerData &&
          <div className="space-y-6">
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <Image
                  src={selectedBrokerData?.logo}
                  alt={`${selectedBrokerData?.label} broker platform logo`}
                  className="w-full h-full object-contain" />

                </div>
                <div>
                  <h3 className="font-medium text-card-foreground">{selectedBrokerData?.label}</h3>
                  <p className="text-sm text-muted-foreground">{selectedBrokerData?.description}</p>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Icon name="Shield" size={16} className="text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-accent">Secure Connection</p>
                    <p className="text-xs text-accent/80 mt-1">
                      Your credentials are encrypted and stored securely. We never store your actual passwords in plain text.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedBrokerData?.fields?.map((field) => {
                const config = getFieldConfig(field);
                return (
                  <Input
                    key={field}
                    label={config?.label}
                    type={config?.type}
                    placeholder={config?.placeholder}
                    description={config?.description}
                    value={formData?.[field]}
                    onChange={(e) => handleInputChange(field, e?.target?.value)}
                    required />);


              })}
              </div>

              {/* Connection Status */}
              {connectionStatus &&
              <div className={`p-4 rounded-lg border ${
                connectionStatus?.type === 'success' ? 'bg-success/10 border-success/20': 'bg-destructive/10 border-destructive/20'
              }`}>

                  <div className="flex items-start space-x-2">
                    <Icon 
                  name={connectionStatus?.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                  size={16} 
                  className={`mt-0.5 ${
                    connectionStatus?.type === 'success' ? 'text-success' : 'text-destructive'
                  }`} />

                    <div>
                      <p className={`text-sm font-medium ${
                        connectionStatus?.type === 'success' ? 'text-success' : 'text-destructive'
                      }`}>

                        {connectionStatus?.message}
                      </p>
                      <p className={`text-xs mt-1 ${
                        connectionStatus?.type === 'success' ? 'text-success/80' : 'text-destructive/80'
                      }`}>

                        {connectionStatus?.details}
                      </p>
                    </div>
                  </div>
                </div>
              }

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">Setup Instructions</p>
                    <p className="text-xs text-warning/80 mt-1">
                      Make sure to enable API access in your {selectedBrokerData?.label} account settings before connecting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border">
          {step === 2 &&
          <Button
            variant="ghost"
            onClick={() => setStep(1)}
            iconName="ArrowLeft"
            iconPosition="left">

              Back
            </Button>
          }
          
          <div className="flex items-center space-x-3 ml-auto">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            
            {step === 2 &&
            <>
                <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={!isFormValid}
              loading={isLoading}
              iconName="Zap"
              iconPosition="left">

                  Test Connection
                </Button>
                
                <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!isFormValid}
              loading={isLoading}
              iconName="Plus"
              iconPosition="left">

                  Connect Broker
                </Button>
              </>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default AddBrokerModal;