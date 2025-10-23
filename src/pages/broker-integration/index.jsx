import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BrokerCard from './components/BrokerCard';
import AddBrokerModal from './components/AddBrokerModal';
import SyncHistoryTable from './components/SyncHistoryTable';
import ImportPreferences from './components/ImportPreferences';
import UpstoxIntegrationModal from './components/UpstoxIntegrationModal';
import { TradingService } from '../../services/tradingService';
import UpstoxService from '../../services/upstoxService';

const BrokerIntegration = () => {
  const [connectedBrokers, setConnectedBrokers] = useState([]);
  const [availableBrokers] = useState([
  {
    id: 'zerodha',
    name: 'Zerodha Kite',
    description: 'India\'s largest retail broker',
    logo: "https://images.unsplash.com/photo-1690692927220-12c0d6305389",
    features: ['Equity Trading', 'F&O', 'Commodity', 'Currency'],
    supported: true
  },
  {
    id: 'upstox',
    name: 'Upstox',
    description: 'Technology-first discount broker',
    logo: "https://images.unsplash.com/photo-1644995520599-211478ea8254",
    features: ['Equity Trading', 'F&O', 'Commodity', 'Currency'],
    supported: true
  },
  {
    id: 'angelone',
    name: 'Angel One',
    description: 'Full-service broker with digital platform',
    logo: "https://images.unsplash.com/photo-1687847211897-e92cbbaef208",
    features: ['Equity Trading', 'F&O', 'Mutual Funds'],
    supported: false
  },
  {
    id: 'fyers',
    name: 'Fyers',
    description: 'Modern trading and investment platform',
    logo: "https://images.unsplash.com/photo-1605588723255-9a1e3c0d3b3d",
    features: ['Equity Trading', 'F&O', 'Currency'],
    supported: false
  }]
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpstoxModalOpen, setIsUpstoxModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('brokers');
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState({});

  // Load connected brokers on component mount
  useEffect(() => {
    loadConnectedBrokers();
    loadBrokerStatuses();
  }, []);

  const loadConnectedBrokers = async () => {
    setLoading(true);
    try {
      const result = await TradingService?.getBrokers();
      if (result?.success) {
        setConnectedBrokers(result?.data);
      }
    } catch (error) {
      console.error('Failed to load brokers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrokerStatuses = async () => {
    try {
      const result = await TradingService?.getBrokerStatus();
      if (result?.success) {
        setSyncStatus(result?.data);
      }
    } catch (error) {
      console.error('Failed to load broker statuses:', error);
    }
  };

  const handleAddBroker = (brokerType) => {
    if (brokerType === 'upstox') {
      setIsUpstoxModalOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  const handleUpstoxSuccess = async (data) => {
    await loadConnectedBrokers();
    await loadBrokerStatuses();
    setIsUpstoxModalOpen(false);
  };

  const handleDisconnectBroker = async (brokerId) => {
    if (window.confirm('Are you sure you want to disconnect this broker? This will stop automatic data synchronization.')) {
      try {
        const broker = connectedBrokers?.find((b) => b?.id === brokerId);
        if (broker?.name === 'Upstox') {
          await UpstoxService?.disconnect();
        }
        // Refresh the list
        await loadConnectedBrokers();
        await loadBrokerStatuses();
      } catch (error) {
        console.error('Failed to disconnect broker:', error);
      }
    }
  };

  const handleSyncBroker = async (brokerId) => {
    try {
      setSyncStatus((prev) => ({
        ...prev,
        [brokerId]: { ...prev?.[brokerId], syncing: true }
      }));

      const result = await TradingService?.syncFromBrokers();

      if (result?.success) {
        await loadBrokerStatuses();
      } else {
        console.error('Sync failed:', result?.error);
      }
    } catch (error) {
      console.error('Failed to sync broker:', error);
    } finally {
      setSyncStatus((prev) => ({
        ...prev,
        [brokerId]: { ...prev?.[brokerId], syncing: false }
      }));
    }
  };

  const getConnectedBrokerStats = () => {
    const activeCount = connectedBrokers?.filter((b) => b?.status === 'active')?.length;
    const totalRecords = connectedBrokers?.reduce((sum, broker) => {
      return sum + (parseInt(broker?.records_imported) || 0);
    }, 0);

    return {
      total: connectedBrokers?.length,
      active: activeCount,
      totalRecords
    };
  };

  const stats = getConnectedBrokerStats();
  const tabs = [
  { id: 'brokers', label: 'Connected Brokers', icon: 'Link' },
  { id: 'available', label: 'Available Brokers', icon: 'Plus' },
  { id: 'history', label: 'Sync History', icon: 'Clock' },
  { id: 'preferences', label: 'Import Preferences', icon: 'Settings' }];


  return (
    <div className="min-h-screen bg-background">
      <Header activeRoute="/broker-integration" />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Broker Integration</h1>
                <p className="text-muted-foreground mt-2">
                  Connect your trading accounts for automated data synchronization and comprehensive portfolio management
                </p>
              </div>
              
              <Button
                variant="default"
                onClick={() => setActiveTab('available')}
                iconName="Plus"
                iconPosition="left"
                className="shrink-0">

                Add Broker
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected Brokers</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats?.total}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Link" size={24} className="text-accent" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Connections</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats?.active}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats?.totalRecords?.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Database" size={24} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Sync</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {syncStatus?.upstox?.lastSync ?
                    new Date(syncStatus.upstox.lastSync)?.toLocaleTimeString() :
                    'Never'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="RefreshCw" size={24} className="text-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8">
              {tabs?.map((tab) =>
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab?.id ?
                'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}`
                }>

                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Connected Brokers Tab */}
            {activeTab === 'brokers' &&
            <>
                {connectedBrokers?.length === 0 ?
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Link" size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-card-foreground mb-2">No Brokers Connected</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Connect your first broker to start automatically importing trades and synchronizing your trading data.
                    </p>
                    <Button
                  variant="default"
                  onClick={() => setActiveTab('available')}
                  iconName="Plus"
                  iconPosition="left">

                      Browse Available Brokers
                    </Button>
                  </div> :

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {connectedBrokers?.map((broker) =>
                <BrokerCard
                  key={broker?.id}
                  broker={{
                    ...broker,
                    logo: broker?.name === 'Upstox' ?
                    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3" :
                    "https://images.unsplash.com/photo-1690692927220-12c0d6305389",
                    syncStatus: syncStatus?.[broker?.name?.toLowerCase()]
                  }}
                  onDisconnect={handleDisconnectBroker}
                  onSync={handleSyncBroker} />

                )}
                  </div>
              }
              </>
            }

            {/* Available Brokers Tab */}
            {activeTab === 'available' &&
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableBrokers?.map((broker) =>
              <div
                key={broker?.id}
                className={`bg-card border border-border rounded-lg p-6 transition-all hover:shadow-md ${
                !broker?.supported ? 'opacity-60' : ''}`
                }>

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                      src={broker?.logo}
                      alt={`${broker?.name} logo`}
                      className="w-12 h-12 rounded-lg object-cover" />

                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{broker?.name}</h3>
                          <p className="text-sm text-muted-foreground">{broker?.description}</p>
                        </div>
                      </div>
                      {!broker?.supported &&
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          Coming Soon
                        </span>
                  }
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {broker?.features?.map((feature) =>
                      <span
                        key={feature}
                        className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">

                              {feature}
                            </span>
                      )}
                        </div>
                      </div>
                    </div>

                    <Button
                  variant={broker?.supported ? "default" : "outline"}
                  fullWidth
                  disabled={!broker?.supported}
                  onClick={() => broker?.supported && handleAddBroker(broker?.id)}
                  iconName={broker?.supported ? "Plus" : "Clock"}
                  iconPosition="left">

                      {broker?.supported ? "Connect" : "Coming Soon"}
                    </Button>
                  </div>
              )}
              </div>
            }

            {activeTab === 'history' && <SyncHistoryTable />}
            {activeTab === 'preferences' && <ImportPreferences />}
          </div>
        </div>
      </main>
      {/* Modals */}
      <AddBrokerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={loadConnectedBrokers} />

      <UpstoxIntegrationModal
        isOpen={isUpstoxModalOpen}
        onClose={() => setIsUpstoxModalOpen(false)}
        onSuccess={handleUpstoxSuccess} />

    </div>);

};

export default BrokerIntegration;