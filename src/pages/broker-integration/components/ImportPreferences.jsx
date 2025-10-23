import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ImportPreferences = () => {
  const [preferences, setPreferences] = useState({
    autoSync: true,
    syncFrequency: '15min',
    dataRange: '30days',
    duplicateHandling: 'skip',
    autoCategories: true,
    importTypes: {
      equity: true,
      futures: true,
      options: true,
      forex: false,
      crypto: false
    },
    notifications: {
      syncComplete: true,
      syncErrors: true,
      dailySummary: false
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const syncFrequencyOptions = [
    { value: '5min', label: 'Every 5 minutes' },
    { value: '15min', label: 'Every 15 minutes' },
    { value: '30min', label: 'Every 30 minutes' },
    { value: '1hour', label: 'Every hour' },
    { value: '4hours', label: 'Every 4 hours' },
    { value: 'manual', label: 'Manual only' }
  ];

  const dataRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: 'all', label: 'All available data' }
  ];

  const duplicateHandlingOptions = [
    { value: 'skip', label: 'Skip duplicates' },
    { value: 'update', label: 'Update existing' },
    { value: 'create', label: 'Create new entry' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Preferences saved:', preferences);
      setIsSaving(false);
    }, 1500);
  };

  const handleReset = () => {
    setPreferences({
      autoSync: true,
      syncFrequency: '15min',
      dataRange: '30days',
      duplicateHandling: 'skip',
      autoCategories: true,
      importTypes: {
        equity: true,
        futures: true,
        options: true,
        forex: false,
        crypto: false
      },
      notifications: {
        syncComplete: true,
        syncErrors: true,
        dailySummary: false
      }
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Import Preferences</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure how trades are imported and processed from your brokers
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
        </div>
      </div>
      <div className="space-y-8">
        {/* Sync Settings */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-card-foreground flex items-center space-x-2">
            <Icon name="RefreshCw" size={18} className="text-accent" />
            <span>Synchronization Settings</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div className="space-y-4">
              <Checkbox
                label="Enable automatic sync"
                description="Automatically import new trades at regular intervals"
                checked={preferences?.autoSync}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  autoSync: e?.target?.checked
                }))}
              />
              
              <Select
                label="Sync frequency"
                description="How often to check for new trades"
                options={syncFrequencyOptions}
                value={preferences?.syncFrequency}
                onChange={(value) => setPreferences(prev => ({
                  ...prev,
                  syncFrequency: value
                }))}
                disabled={!preferences?.autoSync}
              />
            </div>
            
            <div className="space-y-4">
              <Select
                label="Data range"
                description="How far back to import historical data"
                options={dataRangeOptions}
                value={preferences?.dataRange}
                onChange={(value) => setPreferences(prev => ({
                  ...prev,
                  dataRange: value
                }))}
              />
              
              <Select
                label="Duplicate handling"
                description="What to do when duplicate trades are found"
                options={duplicateHandlingOptions}
                value={preferences?.duplicateHandling}
                onChange={(value) => setPreferences(prev => ({
                  ...prev,
                  duplicateHandling: value
                }))}
              />
            </div>
          </div>
        </div>

        {/* Trade Types */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-card-foreground flex items-center space-x-2">
            <Icon name="Filter" size={18} className="text-accent" />
            <span>Import Trade Types</span>
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-6">
            {Object.entries(preferences?.importTypes)?.map(([type, enabled]) => (
              <Checkbox
                key={type}
                label={type?.charAt(0)?.toUpperCase() + type?.slice(1)}
                checked={enabled}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  importTypes: {
                    ...prev?.importTypes,
                    [type]: e?.target?.checked
                  }
                }))}
              />
            ))}
          </div>
        </div>

        {/* Processing Options */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-card-foreground flex items-center space-x-2">
            <Icon name="Settings" size={18} className="text-accent" />
            <span>Processing Options</span>
          </h4>
          
          <div className="pl-6">
            <Checkbox
              label="Auto-categorize trades"
              description="Automatically assign categories based on instrument type and trading patterns"
              checked={preferences?.autoCategories}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                autoCategories: e?.target?.checked
              }))}
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-card-foreground flex items-center space-x-2">
            <Icon name="Bell" size={18} className="text-accent" />
            <span>Notification Preferences</span>
          </h4>
          
          <div className="space-y-3 pl-6">
            {Object.entries(preferences?.notifications)?.map(([type, enabled]) => {
              const labels = {
                syncComplete: 'Sync completion notifications',
                syncErrors: 'Sync error alerts',
                dailySummary: 'Daily import summary'
              };
              
              const descriptions = {
                syncComplete: 'Get notified when data sync completes successfully',
                syncErrors: 'Receive alerts when sync encounters errors',
                dailySummary: 'Daily email with import statistics and summary'
              };
              
              return (
                <Checkbox
                  key={type}
                  label={labels?.[type]}
                  description={descriptions?.[type]}
                  checked={enabled}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    notifications: {
                      ...prev?.notifications,
                      [type]: e?.target?.checked
                    }
                  }))}
                />
              );
            })}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-accent mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-accent mb-1">Security & Privacy</h5>
              <p className="text-xs text-accent/80">
                All broker credentials are encrypted using AES-256 encryption and stored securely. 
                We never store your actual passwords and use secure API connections only. 
                Your trading data is processed locally and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPreferences;