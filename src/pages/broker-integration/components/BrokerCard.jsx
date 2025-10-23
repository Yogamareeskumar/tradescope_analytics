import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const BrokerCard = ({ broker, onManage, onDisconnect, onSync }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusConfig = () => {
    switch (broker?.status) {
      case 'connected':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'CheckCircle',
          label: 'Connected'
        };
      case 'error':
        return {
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          icon: 'AlertCircle',
          label: 'Connection Error'
        };
      case 'syncing':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          icon: 'RefreshCw',
          label: 'Syncing',
          animate: true
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          icon: 'Circle',
          label: 'Disconnected'
        };
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    await onSync(broker?.id);
    setIsLoading(false);
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <Image
              src={broker?.logo}
              alt={`${broker?.name} broker platform logo`}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">{broker?.name}</h3>
            <p className="text-sm text-muted-foreground">{broker?.description}</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig?.bgColor}`}>
          <Icon 
            name={statusConfig?.icon} 
            size={16} 
            className={`${statusConfig?.color} ${statusConfig?.animate ? 'animate-spin' : ''}`}
          />
          <span className={`text-sm font-medium ${statusConfig?.color}`}>
            {statusConfig?.label}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Last Sync</p>
          <p className="text-sm font-medium text-card-foreground">{broker?.lastSync}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Sync Frequency</p>
          <p className="text-sm font-medium text-card-foreground">{broker?.syncFrequency}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Records Imported</p>
          <p className="text-sm font-medium text-card-foreground">{broker?.recordsImported}</p>
        </div>
      </div>
      {broker?.status === 'error' && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Connection Error</p>
              <p className="text-xs text-destructive/80 mt-1">{broker?.errorMessage}</p>
              <Button
                variant="link"
                size="sm"
                className="text-destructive hover:text-destructive/80 p-0 h-auto mt-1"
                onClick={() => console.log('View troubleshooting guide')}
              >
                View troubleshooting guide
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManage(broker?.id)}
            iconName="Settings"
            iconPosition="left"
          >
            Manage
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSync}
            loading={isLoading}
            iconName="RefreshCw"
            iconPosition="left"
            disabled={broker?.status === 'error'}
          >
            Sync Now
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDisconnect(broker?.id)}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
          iconName="Unplug"
          iconPosition="left"
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default BrokerCard;