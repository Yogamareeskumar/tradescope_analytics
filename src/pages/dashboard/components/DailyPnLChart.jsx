import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DailyPnLChart = () => {
  const [selectedRange, setSelectedRange] = useState('7d');
  const [currency, setCurrency] = useState('USD');

  // Mock daily PnL data
  const dailyPnLData = [
    { date: '2025-10-09', pnl: 1250, trades: 8, winRate: 75 },
    { date: '2025-10-10', pnl: -850, trades: 6, winRate: 50 },
    { date: '2025-10-11', pnl: 2100, trades: 12, winRate: 83 },
    { date: '2025-10-12', pnl: 450, trades: 4, winRate: 75 },
    { date: '2025-10-13', pnl: -320, trades: 5, winRate: 40 },
    { date: '2025-10-14', pnl: 1800, trades: 9, winRate: 89 },
    { date: '2025-10-15', pnl: 950, trades: 7, winRate: 71 },
    { date: '2025-10-16', pnl: 680, trades: 3, winRate: 67 }
  ];

  const dateRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' },
    { value: '1y', label: '1 Year' }
  ];

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = (event) => {
      setCurrency(event?.detail?.currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    
    // Get initial currency from localStorage
    const savedCurrency = localStorage.getItem('tradescope-currency') || 'USD';
    setCurrency(savedCurrency);

    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  const formatCurrency = (value) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const convertedValue = currency === 'INR' ? value * 83 : value;
    return `${symbol}${convertedValue?.toLocaleString()}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">
            {formatDate(label)}
          </p>
          <div className="space-y-1">
            <p className={`text-sm font-semibold ${data?.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
              PnL: {formatCurrency(data?.pnl)}
            </p>
            <p className="text-xs text-muted-foreground">
              Trades: {data?.trades} | Win Rate: {data?.winRate}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Icon name="BarChart3" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Daily P&L Performance</h3>
            <p className="text-sm text-muted-foreground">Track your daily trading results</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {dateRanges?.map((range) => (
            <Button
              key={range?.value}
              variant={selectedRange === range?.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRange(range?.value)}
            >
              {range?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-80 w-full" aria-label="Daily P&L Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyPnLData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="pnl" 
              fill={(entry) => entry >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyPnLChart;