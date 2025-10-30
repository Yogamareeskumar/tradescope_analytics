import React, { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const AdvancedRiskMetrics = ({ data = [], currency = 'USD', config = {} }) => {
  const [activeMetric, setActiveMetric] = useState('drawdown');
  
  // Calculate advanced risk metrics
  const riskMetrics = useMemo(() => {
    if (!data?.length) return {};
    
    const returns = data?.map(d => d?.daily_pnl || 0);
    const cumulativeReturns = data?.map(d => d?.cumulative_pnl || 0);
    
    // Calculate drawdown
    let maxDrawdown = 0;
    let currentDrawdown = 0;
    let peak = 0;
    const drawdownData = [];
    
    cumulativeReturns?.forEach((value, index) => {
      if (value > peak) {
        peak = value;
        currentDrawdown = 0;
      } else {
        currentDrawdown = ((peak - value) / Math.max(peak, 1)) * 100;
        maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
      }
      
      drawdownData?.push({
        date: data?.[index]?.date || new Date(Date.now() - (data.length - index) * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
        drawdown: -currentDrawdown,
        value: value,
        peak: peak
      });
    });
    
    // Calculate Sharpe Ratio
    const avgReturn = returns?.reduce((sum, r) => sum + r, 0) / (returns?.length || 1);
    const returnVariance = returns?.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns?.length || 1);
    const stdDev = Math.sqrt(returnVariance);
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0; // Annualized
    
    // Calculate Sortino Ratio (downside deviation)
    const downReturns = returns?.filter(r => r < 0);
    const downsideVariance = downReturns?.reduce((sum, r) => sum + Math.pow(r, 2), 0) / (downReturns?.length || 1);
    const downsideDeviation = Math.sqrt(downsideVariance);
    const sortinoRatio = downsideDeviation > 0 ? (avgReturn / downsideDeviation) * Math.sqrt(252) : 0;
    
    // Calculate Value at Risk (VaR) - 95% confidence
    const sortedReturns = [...returns]?.sort((a, b) => a - b);
    const var95 = sortedReturns?.[Math.floor(sortedReturns?.length * 0.05)] || 0;
    
    // Calculate Beta (relative to market - simulated)
    const marketReturns = returns?.map(() => (Math.random() - 0.5) * avgReturn * 0.8); // Simulated market
    const covariance = returns?.reduce((sum, r, i) => sum + (r - avgReturn) * (marketReturns?.[i] - avgReturn), 0) / (returns?.length || 1);
    const marketVariance = marketReturns?.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (marketReturns?.length || 1);
    const beta = marketVariance > 0 ? covariance / marketVariance : 1;
    
    // Calmar Ratio
    const calmarRatio = maxDrawdown > 0 ? (avgReturn * 252) / maxDrawdown : 0;
    
    return {
      maxDrawdown: maxDrawdown?.toFixed(2),
      sharpeRatio: sharpeRatio?.toFixed(3),
      sortinoRatio: sortinoRatio?.toFixed(3),
      var95: var95?.toFixed(0),
      beta: beta?.toFixed(3),
      calmarRatio: calmarRatio?.toFixed(3),
      volatility: (stdDev * Math.sqrt(252))?.toFixed(2), // Annualized volatility
      drawdownData,
      avgReturn: avgReturn?.toFixed(0),
      winRate: ((returns?.filter(r => r > 0)?.length / (returns?.length || 1)) * 100)?.toFixed(1)
    };
  }, [data]);

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{new Date(label)?.toLocaleDateString()}</p>
          <div className="space-y-1">
            {payload?.map((entry, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-muted-foreground">{entry?.name}:</span>
                <span className="font-medium text-foreground" style={{ color: entry?.color }}>
                  {entry?.name?.includes('Drawdown') ? `${entry?.value?.toFixed(2)}%` : formatCurrency(entry?.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const riskMetricCards = [
    {
      id: 'sharpe',
      name: 'Sharpe Ratio',
      value: riskMetrics?.sharpeRatio,
      description: 'Risk-adjusted returns',
      icon: 'TrendingUp',
      color: parseFloat(riskMetrics?.sharpeRatio || 0) > 1 ? 'text-success' : parseFloat(riskMetrics?.sharpeRatio || 0) > 0.5 ? 'text-warning' : 'text-destructive',
      benchmark: '> 1.0 Excellent'
    },
    {
      id: 'sortino',
      name: 'Sortino Ratio',
      value: riskMetrics?.sortinoRatio,
      description: 'Downside risk-adjusted returns',
      icon: 'Shield',
      color: parseFloat(riskMetrics?.sortinoRatio || 0) > 1.5 ? 'text-success' : parseFloat(riskMetrics?.sortinoRatio || 0) > 1 ? 'text-warning' : 'text-destructive',
      benchmark: '> 1.5 Excellent'
    },
    {
      id: 'drawdown',
      name: 'Max Drawdown',
      value: `${riskMetrics?.maxDrawdown}%`,
      description: 'Largest peak-to-trough decline',
      icon: 'TrendingDown',
      color: parseFloat(riskMetrics?.maxDrawdown || 0) < 10 ? 'text-success' : parseFloat(riskMetrics?.maxDrawdown || 0) < 20 ? 'text-warning' : 'text-destructive',
      benchmark: '< 10% Excellent'
    },
    {
      id: 'var',
      name: 'Value at Risk (95%)',
      value: formatCurrency(riskMetrics?.var95),
      description: 'Potential loss (5% probability)',
      icon: 'AlertTriangle',
      color: 'text-destructive',
      benchmark: 'Daily risk exposure'
    },
    {
      id: 'volatility',
      name: 'Volatility',
      value: `${riskMetrics?.volatility}%`,
      description: 'Annualized standard deviation',
      icon: 'Activity',
      color: parseFloat(riskMetrics?.volatility || 0) < 15 ? 'text-success' : parseFloat(riskMetrics?.volatility || 0) < 25 ? 'text-warning' : 'text-destructive',
      benchmark: '< 15% Low Risk'
    },
    {
      id: 'beta',
      name: 'Beta',
      value: riskMetrics?.beta,
      description: 'Market correlation',
      icon: 'BarChart2',
      color: Math.abs(parseFloat(riskMetrics?.beta || 1) - 1) < 0.2 ? 'text-success' : 'text-accent',
      benchmark: '~1.0 Market neutral'
    }
  ];

  const chartMetrics = [
    { id: 'drawdown', name: 'Drawdown Analysis', icon: 'TrendingDown' },
    { id: 'rolling-sharpe', name: 'Rolling Sharpe', icon: 'TrendingUp' },
    { id: 'rolling-vol', name: 'Rolling Volatility', icon: 'Activity' }
  ];

  const renderChart = () => {
    switch (activeMetric) {
      case 'drawdown':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={riskMetrics?.drawdownData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value?.toFixed(1)}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                name="Drawdown %"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Portfolio Value"
              />
              <ReferenceLine y={-10} stroke="#f59e0b" strokeDasharray="5 5" label="10% Risk Level" />
              <ReferenceLine y={-20} stroke="#ef4444" strokeDasharray="5 5" label="20% Risk Level" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'rolling-sharpe':
        // Calculate rolling 30-day Sharpe ratio
        const rollingData = riskMetrics?.drawdownData?.map((item, index) => {
          const windowStart = Math.max(0, index - 29);
          const windowData = data?.slice(windowStart, index + 1);
          const windowReturns = windowData?.map(d => d?.daily_pnl || 0);
          const avgReturn = windowReturns?.reduce((sum, r) => sum + r, 0) / (windowReturns?.length || 1);
          const stdDev = Math.sqrt(windowReturns?.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (windowReturns?.length || 1));
          const sharpe = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(30) : 0;
          
          return {
            ...item,
            rollingSharpe: sharpe
          };
        });
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={rollingData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="rollingSharpe"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
                name="30-Day Rolling Sharpe"
              />
              <ReferenceLine y={1} stroke="#22c55e" strokeDasharray="5 5" label="Good Performance" />
              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={riskMetrics?.drawdownData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Portfolio Value"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Advanced Risk Analytics</h3>
        </div>
        
        {/* Chart selector */}
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {chartMetrics?.map((metric) => (
            <button
              key={metric?.id}
              onClick={() => setActiveMetric(metric?.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                activeMetric === metric?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={metric?.icon} size={14} />
              <span className="hidden sm:inline">{metric?.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskMetricCards?.map((metric) => (
          <div key={metric?.id} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon name={metric?.icon} size={16} className={metric?.color} />
                <span className="text-sm font-medium text-foreground">{metric?.name}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className={`text-2xl font-bold ${metric?.color}`}>
                {metric?.value}
              </p>
              <p className="text-xs text-muted-foreground">{metric?.description}</p>
              <p className="text-xs text-accent">{metric?.benchmark}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-foreground">
            {chartMetrics?.find(m => m?.id === activeMetric)?.name || 'Risk Analysis'}
          </h4>
        </div>
        
        {renderChart()}
      </div>

      {/* Risk Assessment Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Risk Assessment Summary</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Strengths</h5>
            <div className="space-y-2">
              {parseFloat(riskMetrics?.sharpeRatio || 0) > 1 && (
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm">Excellent risk-adjusted returns</span>
                </div>
              )}
              {parseFloat(riskMetrics?.maxDrawdown || 0) < 15 && (
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm">Low maximum drawdown</span>
                </div>
              )}
              {parseFloat(riskMetrics?.winRate || 0) > 60 && (
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm">High win rate consistency</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-medium text-foreground">Areas for Improvement</h5>
            <div className="space-y-2">
              {parseFloat(riskMetrics?.volatility || 0) > 25 && (
                <div className="flex items-center space-x-2 text-warning">
                  <Icon name="AlertCircle" size={16} />
                  <span className="text-sm">Consider reducing position sizes</span>
                </div>
              )}
              {parseFloat(riskMetrics?.maxDrawdown || 0) > 20 && (
                <div className="flex items-center space-x-2 text-destructive">
                  <Icon name="AlertTriangle" size={16} />
                  <span className="text-sm">Implement better risk management</span>
                </div>
              )}
              {parseFloat(riskMetrics?.sortinoRatio || 0) < 1 && (
                <div className="flex items-center space-x-2 text-warning">
                  <Icon name="AlertCircle" size={16} />
                  <span className="text-sm">Focus on reducing downside risk</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedRiskMetrics;