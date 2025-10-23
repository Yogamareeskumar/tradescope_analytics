import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SyncStatusIndicator = () => {
  const [syncStatus, setSyncStatus] = useState('connected');
  const [lastSync, setLastSync] = useState(new Date());

  // Simulate sync status changes for demo
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional sync updates
      if (Math.random() > 0.9) {
        setSyncStatus('syncing');
        setTimeout(() => {
          setSyncStatus('connected');
          setLastSync(new Date());
        }, 2000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'connected':
        return {
          icon: 'Wifi',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Connected',
          description: 'Real-time data sync active'
        };
      case 'syncing':
        return {
          icon: 'RefreshCw',
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          label: 'Syncing',
          description: 'Updating broker data...',
          animate: true
        };
      case 'disconnected':
        return {
          icon: 'WifiOff',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          label: 'Disconnected',
          description: 'Check broker connection'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Error',
          description: 'Sync failed - retry needed'
        };
      default:
        return {
          icon: 'Wifi',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Unknown',
          description: 'Status unavailable'
        };
    }
  };

  const formatLastSync = () => {
    const now = new Date();
    const diffMs = now - lastSync;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return lastSync?.toLocaleDateString();
  };

  const handleClick = () => {
    // Navigate to broker integration page
    window.location.href = '/broker-integration';
  };

  const statusConfig = getStatusConfig();

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
      title={`${statusConfig?.label}: ${statusConfig?.description}`}
    >
      <div className={`p-1.5 rounded-full ${statusConfig?.bgColor}`}>
        <Icon 
          name={statusConfig?.icon} 
          size={14} 
          className={`${statusConfig?.color} ${statusConfig?.animate ? 'animate-spin' : ''}`}
        />
      </div>
      <div className="hidden lg:block text-left">
        <div className={`text-xs font-medium ${statusConfig?.color}`}>
          {statusConfig?.label}
        </div>
        <div className="text-xs text-muted-foreground">
          {syncStatus === 'syncing' ? statusConfig?.description : formatLastSync()}
        </div>
      </div>
    </Button>
  );
};

export default SyncStatusIndicator;