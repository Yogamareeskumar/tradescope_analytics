import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SyncHistoryTable = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  const syncHistory = [
    {
      id: 1,
      broker: 'Zerodha Kite',
      timestamp: '2025-10-16 09:15:00',
      status: 'success',
      recordsImported: 45,
      duration: '2.3s',
      type: 'Automatic',
      details: 'Successfully imported 45 trades from the last 24 hours'
    },
    {
      id: 2,
      broker: 'MetaTrader 5',
      timestamp: '2025-10-16 08:45:00',
      status: 'success',
      recordsImported: 23,
      duration: '1.8s',
      type: 'Manual',
      details: 'Manual sync completed for forex positions'
    },
    {
      id: 3,
      broker: 'Interactive Brokers',
      timestamp: '2025-10-16 08:30:00',
      status: 'error',
      recordsImported: 0,
      duration: '15.2s',
      type: 'Automatic',
      details: 'API rate limit exceeded. Retry scheduled for next interval.',
      error: 'Rate limit exceeded (429)'
    },
    {
      id: 4,
      broker: 'Zerodha Kite',
      timestamp: '2025-10-16 08:00:00',
      status: 'success',
      recordsImported: 67,
      duration: '3.1s',
      type: 'Automatic',
      details: 'Successfully imported equity and F&O trades'
    },
    {
      id: 5,
      broker: 'Alpaca Markets',
      timestamp: '2025-10-16 07:45:00',
      status: 'partial',
      recordsImported: 12,
      duration: '4.7s',
      type: 'Automatic',
      details: 'Imported 12 of 15 trades. 3 trades had data validation issues.',
      warning: 'Some records skipped due to validation errors'
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'CheckCircle',
          label: 'Success'
        };
      case 'error':
        return {
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          icon: 'XCircle',
          label: 'Failed'
        };
      case 'partial':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'AlertCircle',
          label: 'Partial'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          icon: 'Circle',
          label: 'Unknown'
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date?.toLocaleDateString('en-GB'),
      time: date?.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const periodOptions = [
    { value: '24hours', label: 'Last 24 Hours' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Sync History</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Recent data synchronization activities and import logs
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {periodOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Export sync history')}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Broker</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Timestamp</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Records</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {syncHistory?.map((sync, index) => {
              const statusConfig = getStatusConfig(sync?.status);
              const { date, time } = formatTimestamp(sync?.timestamp);
              
              return (
                <tr key={sync?.id} className={`border-b border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                  <td className="p-4">
                    <div className="font-medium text-card-foreground">{sync?.broker}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-card-foreground">{date}</div>
                    <div className="text-xs text-muted-foreground">{time}</div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full ${statusConfig?.bgColor}`}>
                      <Icon name={statusConfig?.icon} size={14} className={statusConfig?.color} />
                      <span className={`text-xs font-medium ${statusConfig?.color}`}>
                        {statusConfig?.label}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-card-foreground">
                      {sync?.recordsImported}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">{sync?.duration}</div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      sync?.type === 'Automatic' ?'bg-accent/10 text-accent' :'bg-secondary/10 text-secondary'
                    }`}>
                      {sync?.type}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => console.log('View details', sync?.id)}
                        title="View details"
                      />
                      
                      {sync?.status === 'error' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="RefreshCw"
                          onClick={() => console.log('Retry sync', sync?.id)}
                          title="Retry sync"
                          className="text-accent hover:text-accent/80"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {syncHistory?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Clock" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No sync history available</p>
        </div>
      )}
    </div>
  );
};

export default SyncHistoryTable;