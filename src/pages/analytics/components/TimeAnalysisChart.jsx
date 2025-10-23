import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const TimeAnalysisChart = ({ currency }) => {
  const [timeframe, setTimeframe] = useState('daily');
  const [chartType, setChartType] = useState('bar');

  const timeframeOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const chartTypeOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' }
  ];

  // Generate mock data based on timeframe
  const generateData = () => {
    const data = [];
    const now = new Date();
    
    switch (timeframe) {
      case 'hourly':
        for (let i = 23; i >= 0; i--) {
          const hour = new Date(now);
          hour?.setHours(now?.getHours() - i);
          if (hour?.getHours() >= 9 && hour?.getHours() <= 16) { // Trading hours
            data?.push({
              period: hour?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              pnl: (Math.random() - 0.4) * 2000,
              volume: Math.floor(Math.random() * 50) + 10,
              trades: Math.floor(Math.random() * 15) + 1
            });
          }
        }
        break;
      case 'daily':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date?.setDate(now?.getDate() - i);
          if (date?.getDay() !== 0 && date?.getDay() !== 6) { // Weekdays only
            data?.push({
              period: date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              pnl: (Math.random() - 0.3) * 5000,
              volume: Math.floor(Math.random() * 200) + 50,
              trades: Math.floor(Math.random() * 25) + 5
            });
          }
        }
        break;
      case 'weekly':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date?.setDate(now?.getDate() - (i * 7));
          data?.push({
            period: `Week ${52 - i}`,
            pnl: (Math.random() - 0.2) * 15000,
            volume: Math.floor(Math.random() * 1000) + 200,
            trades: Math.floor(Math.random() * 100) + 20
          });
        }
        break;
      case 'monthly':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date?.setMonth(now?.getMonth() - i);
          data?.push({
            period: date?.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            pnl: (Math.random() - 0.1) * 50000,
            volume: Math.floor(Math.random() * 5000) + 1000,
            trades: Math.floor(Math.random() * 400) + 100
          });
        }
        break;
    }
    return data;
  };

  const data = generateData();

  const formatCurrency = (amount) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const formatted = currency === 'INR' ? amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : amount?.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return `${symbol}${formatted}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <p className="text-sm text-success">
            PnL: {formatCurrency(data?.pnl)}
          </p>
          <p className="text-sm text-accent">
            Trades: {data?.trades}
          </p>
          <p className="text-sm text-muted-foreground">
            Volume: {data?.volume?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Time-Based Performance Analysis</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
            className="w-full sm:w-32"
          />
          <Select
            options={chartTypeOptions}
            value={chartType}
            onChange={setChartType}
            className="w-full sm:w-32"
          />
        </div>
      </div>
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="pnl" 
                fill="hsl(var(--accent))"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="pnl" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Performance summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-xl font-bold text-success">
            {formatCurrency(data?.reduce((sum, d) => sum + Math.max(0, d?.pnl), 0))}
          </div>
          <div className="text-sm text-muted-foreground">Total Profits</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-destructive">
            {formatCurrency(Math.abs(data?.reduce((sum, d) => sum + Math.min(0, d?.pnl), 0)))}
          </div>
          <div className="text-sm text-muted-foreground">Total Losses</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-accent">
            {data?.reduce((sum, d) => sum + d?.trades, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Trades</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(data?.reduce((sum, d) => sum + d?.pnl, 0) / data?.length)}
          </div>
          <div className="text-sm text-muted-foreground">Avg Per Period</div>
        </div>
      </div>
    </div>
  );
};

export default TimeAnalysisChart;