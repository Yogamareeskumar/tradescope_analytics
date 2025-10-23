import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AdvancedFilters = ({ filters, onFiltersChange, onSavePreset, savedPresets = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  const assetClassOptions = [
    { value: 'all', label: 'All Asset Classes' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'options', label: 'Options' },
    { value: 'futures', label: 'Futures' },
    { value: 'forex', label: 'Forex' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'commodities', label: 'Commodities' }
  ];

  const strategyOptions = [
    { value: 'all', label: 'All Strategies' },
    { value: 'scalping', label: 'Scalping' },
    { value: 'day-trading', label: 'Day Trading' },
    { value: 'swing-trading', label: 'Swing Trading' },
    { value: 'momentum', label: 'Momentum' },
    { value: 'mean-reversion', label: 'Mean Reversion' },
    { value: 'breakout', label: 'Breakout' },
    { value: 'arbitrage', label: 'Arbitrage' }
  ];

  const positionSizeOptions = [
    { value: 'all', label: 'All Position Sizes' },
    { value: 'small', label: 'Small (< $1,000)' },
    { value: 'medium', label: 'Medium ($1,000 - $10,000)' },
    { value: 'large', label: 'Large ($10,000 - $50,000)' },
    { value: 'xlarge', label: 'Extra Large (> $50,000)' }
  ];

  const outcomeOptions = [
    { value: 'all', label: 'All Outcomes' },
    { value: 'winners', label: 'Winners Only' },
    { value: 'losers', label: 'Losers Only' },
    { value: 'breakeven', label: 'Breakeven' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSavePreset = () => {
    if (presetName?.trim()) {
      onSavePreset({
        name: presetName,
        filters: { ...filters },
        createdAt: new Date()?.toISOString()
      });
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const loadPreset = (preset) => {
    onFiltersChange(preset?.filters);
  };

  const resetFilters = () => {
    onFiltersChange({
      assetClass: 'all',
      strategy: 'all',
      positionSize: 'all',
      outcome: 'all',
      minPnL: '',
      maxPnL: '',
      minDuration: '',
      maxDuration: '',
      tags: [],
      includePartialFills: true,
      includeCommissions: true
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Advanced Filters</h3>
        </div>
        
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {isExpanded && (
        <div className="space-y-6">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Asset Class"
              options={assetClassOptions}
              value={filters?.assetClass || 'all'}
              onChange={(value) => handleFilterChange('assetClass', value)}
            />
            
            <Select
              label="Strategy"
              options={strategyOptions}
              value={filters?.strategy || 'all'}
              onChange={(value) => handleFilterChange('strategy', value)}
            />
            
            <Select
              label="Position Size"
              options={positionSizeOptions}
              value={filters?.positionSize || 'all'}
              onChange={(value) => handleFilterChange('positionSize', value)}
            />
            
            <Select
              label="Outcome"
              options={outcomeOptions}
              value={filters?.outcome || 'all'}
              onChange={(value) => handleFilterChange('outcome', value)}
            />
          </div>

          {/* PnL Range */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">PnL Range</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Minimum PnL"
                type="number"
                placeholder="Enter minimum PnL"
                value={filters?.minPnL || ''}
                onChange={(e) => handleFilterChange('minPnL', e?.target?.value)}
              />
              
              <Input
                label="Maximum PnL"
                type="number"
                placeholder="Enter maximum PnL"
                value={filters?.maxPnL || ''}
                onChange={(e) => handleFilterChange('maxPnL', e?.target?.value)}
              />
            </div>
          </div>

          {/* Duration Range */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Trade Duration (minutes)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Minimum Duration"
                type="number"
                placeholder="Enter minimum duration"
                value={filters?.minDuration || ''}
                onChange={(e) => handleFilterChange('minDuration', e?.target?.value)}
              />
              
              <Input
                label="Maximum Duration"
                type="number"
                placeholder="Enter maximum duration"
                value={filters?.maxDuration || ''}
                onChange={(e) => handleFilterChange('maxDuration', e?.target?.value)}
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Additional Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox
                label="Include Partial Fills"
                checked={filters?.includePartialFills || false}
                onChange={(e) => handleFilterChange('includePartialFills', e?.target?.checked)}
              />
              
              <Checkbox
                label="Include Commissions in PnL"
                checked={filters?.includeCommissions || false}
                onChange={(e) => handleFilterChange('includeCommissions', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Tags</h4>
            <Input
              label="Filter by Tags"
              placeholder="Enter tags separated by commas"
              value={filters?.tags?.join(', ') || ''}
              onChange={(e) => handleFilterChange('tags', e?.target?.value?.split(',')?.map(tag => tag?.trim())?.filter(Boolean))}
              description="Filter trades by custom tags"
            />
          </div>

          {/* Saved Presets */}
          {savedPresets?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Saved Presets</h4>
              <div className="flex flex-wrap gap-2">
                {savedPresets?.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadPreset(preset)}
                    className="text-xs"
                  >
                    {preset?.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              onClick={() => console.log('Apply filters:', filters)}
              iconName="Search"
              iconPosition="left"
            >
              Apply Filters
            </Button>
            
            <Button
              variant="outline"
              onClick={resetFilters}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset All
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setShowSavePreset(!showSavePreset)}
              iconName="Save"
              iconPosition="left"
            >
              Save Preset
            </Button>
          </div>

          {/* Save Preset Form */}
          {showSavePreset && (
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <h5 className="text-sm font-medium text-foreground">Save Current Filters as Preset</h5>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter preset name"
                  value={presetName}
                  onChange={(e) => setPresetName(e?.target?.value)}
                  className="flex-1"
                />
                <Button
                  variant="default"
                  onClick={handleSavePreset}
                  disabled={!presetName?.trim()}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowSavePreset(false);
                    setPresetName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;