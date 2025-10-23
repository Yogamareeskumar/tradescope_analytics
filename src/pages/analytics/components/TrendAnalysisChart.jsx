import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const TrendAnalysisChart = ({ currency }) => {
  const [metric, setMetric] = useState('cumulative');
  const [period, setPeriod] = useState('3m');

  const metricOptions = [
    { value: 'cumulative', label: 'Cumulative PnL' },
    { value: 'drawdown', label: 'Drawdown' },
    { value: 'winrate', label: 'Win Rate Trend' },
    { value: 'sharpe', label: 'Sharpe Ratio' }
  ];

  const periodOptions = [
    { value: '1m', label: 'Last Month' },
    { value: '3m', label: 'Last 3 Months' },
    { value: '6m', label: 'Last 6 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  // Generate trend data
  const generateTrendData = () => {
    const data = [];
    const now = new Date();
    let days = 30;
    
    switch (period) {
      case '1m': days = 30; break;
      case '3m': days = 90; break;
      case '6m': days = 180; break;
      case '1y': days = 365; break;
    }

    let cumulativePnL = 0;
    let peak = 0;
    let wins = 0;
    let totalTrades = 0;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date?.setDate(now?.getDate() - i);
      
      if (date?.getDay() !== 0 && date?.getDay() !== 6) { // Trading days only
        const dailyPnL = (Math.random() - 0.3) * 2000;
        cumulativePnL += dailyPnL;
        
        if (cumulativePnL > peak) peak = cumulativePnL;
        const drawdown = ((peak - cumulativePnL) / Math.max(peak, 1)) * 100;
        
        const tradesCount = Math.floor(Math.random() * 8) + 1;
        const winsCount = Math.floor(tradesCount * (0.4 + Math.random() * 0.4));
        wins += winsCount;
        totalTrades += tradesCount;
        
        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
        
        // Simple Sharpe ratio approximation
        const returns = cumulativePnL / Math.max(Math.abs(cumulativePnL), 1000);
        const sharpe = returns * Math.sqrt(252) / 0.15; // Assuming 15% volatility

        data?.push({
          date: date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          cumulative: cumulativePnL,
          drawdown: -drawdown,
          winrate: winRate,
          sharpe: sharpe,
          dailyPnL: dailyPnL
        });
      }
    }
    return data;
  };

  const data = generateTrendData();

  const formatCurrency = (amount) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const formatted = currency === 'INR' ? amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : amount?.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return `${symbol}${formatted}`;
  };

  const getMetricConfig = () => {
    switch (metric) {
      case 'cumulative':
        return {
          dataKey: 'cumulative',
          color: 'hsl(var(--accent))',
          formatter: formatCurrency,
          label: 'Cumulative PnL'
        };
      case 'drawdown':
        return {
          dataKey: 'drawdown',
          color: 'hsl(var(--destructive))',
          formatter: (value) => `${value?.toFixed(1)}%`,
          label: 'Drawdown %'
        };
      case 'winrate':
        return {
          dataKey: 'winrate',
          color: 'hsl(var(--success))',
          formatter: (value) => `${value?.toFixed(1)}%`,
          label: 'Win Rate %'
        };
      case 'sharpe':
        return {
          dataKey: 'sharpe',
          color: 'hsl(var(--warning))',
          formatter: (value) => value?.toFixed(2),
          label: 'Sharpe Ratio'
        };
      default:
        return {
          dataKey: 'cumulative',
          color: 'hsl(var(--accent))',
          formatter: formatCurrency,
          label: 'Cumulative PnL'
        };
    }
  };

  const metricConfig = getMetricConfig();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <p className="text-sm" style={{ color: metricConfig?.color }}>
            {metricConfig?.label}: {metricConfig?.formatter(payload?.[0]?.value)}
          </p>
          {metric === 'cumulative' && (
            <p className="text-sm text-muted-foreground">
              Daily: {formatCurrency(data?.dailyPnL)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Performance Trend Analysis</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            options={metricOptions}
            value={metric}
            onChange={setMetric}
            className="w-full sm:w-40"
          />
          <Select
            options={periodOptions}
            value={period}
            onChange={setPeriod}
            className="w-full sm:w-36"
          />
        </div>
      </div>
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'drawdown' ? (
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={metricConfig?.formatter}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={metricConfig?.dataKey}
                stroke={metricConfig?.color}
                fill={metricConfig?.color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={metricConfig?.formatter}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey={metricConfig?.dataKey}
                stroke={metricConfig?.color}
                strokeWidth={2}
                dot={{ fill: metricConfig?.color, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: metricConfig?.color, strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Trend insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="bg-accent/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Trend Direction</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {data?.[data?.length - 1]?.[metricConfig?.dataKey] > data?.[0]?.[metricConfig?.dataKey] 
              ? 'Positive upward trend' :'Declining trend - needs attention'}
          </div>
        </div>
        
        <div className="bg-success/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Activity" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Volatility</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.abs(data?.[data?.length - 1]?.[metricConfig?.dataKey] - data?.[0]?.[metricConfig?.dataKey]) > 1000 
              ? 'High volatility period' :'Stable performance period'}
          </div>
        </div>
        
        <div className="bg-warning/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Performance</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Current {metricConfig?.label?.toLowerCase()}: {metricConfig?.formatter(data?.[data?.length - 1]?.[metricConfig?.dataKey] || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysisChart;