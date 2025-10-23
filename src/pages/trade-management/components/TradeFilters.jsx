import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TradeFilters = ({ onFiltersChange, totalTrades, filteredTrades }) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    assetClass: '',
    strategy: '',
    pnlRange: { min: '', max: '' },
    source: '',
    search: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const assetClassOptions = [
    { value: '', label: 'All Asset Classes' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'forex', label: 'Forex' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'indices', label: 'Indices' }
  ];

  const strategyOptions = [
    { value: '', label: 'All Strategies' },
    { value: 'scalping', label: 'Scalping' },
    { value: 'day-trading', label: 'Day Trading' },
    { value: 'swing-trading', label: 'Swing Trading' },
    { value: 'position-trading', label: 'Position Trading' },
    { value: 'momentum', label: 'Momentum' },
    { value: 'mean-reversion', label: 'Mean Reversion' }
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'imported', label: 'Imported' },
    { value: 'manual', label: 'Manual Entry' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const newDateRange = { ...filters?.dateRange, [type]: value };
    handleFilterChange('dateRange', newDateRange);
  };

  const handlePnlRangeChange = (type, value) => {
    const newPnlRange = { ...filters?.pnlRange, [type]: value };
    handleFilterChange('pnlRange', newPnlRange);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      dateRange: { start: '', end: '' },
      assetClass: '',
      strategy: '',
      pnlRange: { min: '', max: '' },
      source: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value)?.some(v => v !== '');
    }
    return value !== '';
  });

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search and Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Search by instrument name or symbol..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {filteredTrades} of {totalTrades} trades
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="lg:hidden"
          >
            Filters
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date Range</label>
            <div className="space-y-2">
              <Input
                type="date"
                placeholder="Start Date"
                value={filters?.dateRange?.start}
                onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
              />
              <Input
                type="date"
                placeholder="End Date"
                value={filters?.dateRange?.end}
                onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
              />
            </div>
          </div>

          {/* Asset Class */}
          <div>
            <Select
              label="Asset Class"
              options={assetClassOptions}
              value={filters?.assetClass}
              onChange={(value) => handleFilterChange('assetClass', value)}
            />
          </div>

          {/* Strategy */}
          <div>
            <Select
              label="Strategy"
              options={strategyOptions}
              value={filters?.strategy}
              onChange={(value) => handleFilterChange('strategy', value)}
            />
          </div>

          {/* PnL Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">PnL Range</label>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Min PnL"
                value={filters?.pnlRange?.min}
                onChange={(e) => handlePnlRangeChange('min', e?.target?.value)}
              />
              <Input
                type="number"
                placeholder="Max PnL"
                value={filters?.pnlRange?.max}
                onChange={(e) => handlePnlRangeChange('max', e?.target?.value)}
              />
            </div>
          </div>

          {/* Source */}
          <div>
            <Select
              label="Source"
              options={sourceOptions}
              value={filters?.source}
              onChange={(value) => handleFilterChange('source', value)}
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              iconName="X"
              iconPosition="left"
              className="w-full"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeFilters;