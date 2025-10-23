import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const DateRangeControls = ({ dateRange, onDateRangeChange }) => {
  const [customRange, setCustomRange] = useState(false);

  const presetRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'all', label: 'All Time' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handlePresetChange = (value) => {
    if (value === 'custom') {
      setCustomRange(true);
    } else {
      setCustomRange(false);
      const endDate = new Date();
      let startDate = new Date();

      switch (value) {
        case '7d':
          startDate?.setDate(endDate?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(endDate?.getDate() - 30);
          break;
        case '90d':
          startDate?.setDate(endDate?.getDate() - 90);
          break;
        case '1y':
          startDate?.setFullYear(endDate?.getFullYear() - 1);
          break;
        case 'ytd':
          startDate = new Date(endDate.getFullYear(), 0, 1);
          break;
        case 'all':
          startDate = new Date('2020-01-01');
          break;
        default:
          startDate?.setDate(endDate?.getDate() - 30);
      }

      onDateRangeChange({
        startDate: startDate?.toISOString()?.split('T')?.[0],
        endDate: endDate?.toISOString()?.split('T')?.[0],
        preset: value
      });
    }
  };

  const handleCustomDateChange = (field, value) => {
    onDateRangeChange({
      ...dateRange,
      [field]: value,
      preset: 'custom'
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
      <div className="flex-1 min-w-0">
        <Select
          label="Date Range"
          options={presetRanges}
          value={dateRange?.preset || '30d'}
          onChange={handlePresetChange}
          className="w-full lg:w-48"
        />
      </div>
      {customRange && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <Input
            label="Start Date"
            type="date"
            value={dateRange?.startDate}
            onChange={(e) => handleCustomDateChange('startDate', e?.target?.value)}
            className="w-full sm:w-40"
          />
          <Input
            label="End Date"
            type="date"
            value={dateRange?.endDate}
            onChange={(e) => handleCustomDateChange('endDate', e?.target?.value)}
            className="w-full sm:w-40"
          />
        </div>
      )}
      <Button
        variant="outline"
        iconName="RefreshCw"
        iconPosition="left"
        onClick={() => window.location?.reload()}
        className="whitespace-nowrap"
      >
        Refresh Data
      </Button>
    </div>
  );
};

export default DateRangeControls;