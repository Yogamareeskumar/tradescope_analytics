import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdvancedMetricsPanel = ({ currency = 'USD', data = [] }) => {
  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    profitFactor: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    recovery: 0,
    calmar: 0,
    sortino: 0,
    consecutiveWins: 0,
    consecutiveLosses: 0,
    largestWin: 0,
    largestLoss: 0,
    avgHoldTime: 0,
    riskRewardRatio: 0
  });

  const [timeframe, setTimeframe] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    calculateMetrics();
  }, [data, timeframe]);

  const calculateMetrics = () => {
    if (!data || data?.length === 0) return;

    // Filter data based on timeframe
    let filteredData = data;
    const now = new Date();
    
    switch (timeframe) {
      case '1M':
        filteredData = data?.filter(item => new Date(item.date) >= new Date(now.setMonth(now.getMonth() - 1)));
        break;
      case '3M':
        filteredData = data?.filter(item => new Date(item.date) >= new Date(now.setMonth(now.getMonth() - 3)));
        break;
      case '6M':
        filteredData = data?.filter(item => new Date(item.date) >= new Date(now.setMonth(now.getMonth() - 6)));
        break;
      case '1Y':
        filteredData = data?.filter(item => new Date(item.date) >= new Date(now.setFullYear(now.getFullYear() - 1)));
        break;
      default:
        filteredData = data;
    }

    const trades = filteredData?.length;
    const profits = filteredData?.filter(item => (item?.pnl || 0) > 0);
    const losses = filteredData?.filter(item => (item?.pnl || 0) < 0);
    
    const winRate = trades > 0 ? (profits?.length / trades) * 100 : 0;
    const avgWin = profits?.length > 0 ? profits?.reduce((sum, item) => sum + (item?.pnl || 0), 0) / profits?.length : 0;
    const avgLoss = losses?.length > 0 ? Math.abs(losses?.reduce((sum, item) => sum + (item?.pnl || 0), 0) / losses?.length) : 0;
    
    const totalProfit = profits?.reduce((sum, item) => sum + (item?.pnl || 0), 0);
    const totalLoss = Math.abs(losses?.reduce((sum, item) => sum + (item?.pnl || 0), 0));
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

    // Calculate drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;
    
    filteredData?.forEach(item => {
      runningPnL += (item?.pnl || 0);
      if (runningPnL > peak) peak = runningPnL;
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    // Calculate consecutive wins/losses
    let consecutiveWins = 0;
    let consecutiveLosses = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    
    filteredData?.forEach(item => {
      const pnl = item?.pnl || 0;
      if (pnl > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        consecutiveWins = Math.max(consecutiveWins, currentWinStreak);
      } else if (pnl < 0) {
        currentLossStreak++;
        currentWinStreak = 0;
        consecutiveLosses = Math.max(consecutiveLosses, currentLossStreak);
      }
    });

    // Risk metrics
    const returns = filteredData?.map(item => item?.pnl || 0);
    const avgReturn = returns?.length > 0 ? returns?.reduce((sum, r) => sum + r, 0) / returns?.length : 0;
    const variance = returns?.length > 0 ? returns?.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns?.length : 0;
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

    // Downside deviation for Sortino ratio
    const negativeReturns = returns?.filter(r => r < 0);
    const downsideVariance = negativeReturns?.length > 0 ? 
      negativeReturns?.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns?.length : 0;
    const downsideDeviation = Math.sqrt(downsideVariance);
    const sortino = downsideDeviation > 0 ? avgReturn / downsideDeviation : 0;

    const largestWin = profits?.length > 0 ? Math.max(...profits?.map(item => item?.pnl || 0)) : 0;
    const largestLoss = losses?.length > 0 ? Math.min(...losses?.map(item => item?.pnl || 0)) : 0;

    const riskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0;

    setMetrics({
      totalTrades: trades,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      sharpeRatio,
      maxDrawdown,
      recovery: maxDrawdown > 0 ? ((runningPnL + maxDrawdown) / maxDrawdown) * 100 : 0,
      calmar: maxDrawdown > 0 ? (totalProfit - totalLoss) / maxDrawdown : 0,
      sortino,
      consecutiveWins,
      consecutiveLosses,
      largestWin,
      largestLoss,
      avgHoldTime: 24, // Mock data - would calculate from actual trade durations
      riskRewardRatio
    });
  };

  const formatCurrency = (value) => {
    const symbol = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency;
    return `${symbol}${Math.abs(value)?.toLocaleString()}`;
  };

  const getMetricColor = (value, isGood) => {
    if (value === 0) return 'text-muted-foreground';
    if (isGood) {
      return value > 0 ? 'text-success' : 'text-destructive';
    } else {
      return value > 0 ? 'text-destructive' : 'text-success';
    }
  };

  const basicMetrics = [
    {
      label: 'Total Trades',
      value: metrics?.totalTrades?.toString(),
      icon: 'BarChart',
      color: 'text-foreground'
    },
    {
      label: 'Win Rate',
      value: `${metrics?.winRate?.toFixed(1)}%`,
      icon: 'Target',
      color: getMetricColor(metrics?.winRate - 50, true)
    },
    {
      label: 'Avg Win',
      value: formatCurrency(metrics?.avgWin),
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      label: 'Avg Loss',
      value: formatCurrency(metrics?.avgLoss),
      icon: 'TrendingDown',
      color: 'text-destructive'
    },
    {
      label: 'Profit Factor',
      value: metrics?.profitFactor === Infinity ? '∞' : metrics?.profitFactor?.toFixed(2),
      icon: 'Calculator',
      color: getMetricColor(metrics?.profitFactor - 1, true)
    },
    {
      label: 'Max Drawdown',
      value: formatCurrency(metrics?.maxDrawdown),
      icon: 'ArrowDown',
      color: 'text-destructive'
    }
  ];

  const advancedMetrics = [
    {
      label: 'Sharpe Ratio',
      value: metrics?.sharpeRatio?.toFixed(2),
      icon: 'Activity',
      color: getMetricColor(metrics?.sharpeRatio, true),
      description: 'Risk-adjusted returns'
    },
    {
      label: 'Sortino Ratio',
      value: metrics?.sortino?.toFixed(2),
      icon: 'TrendingUp',
      color: getMetricColor(metrics?.sortino, true),
      description: 'Downside risk-adjusted returns'
    },
    {
      label: 'Calmar Ratio',
      value: metrics?.calmar?.toFixed(2),
      icon: 'Shield',
      color: getMetricColor(metrics?.calmar, true),
      description: 'Annual return vs max drawdown'
    },
    {
      label: 'Recovery Factor',
      value: `${metrics?.recovery?.toFixed(1)}%`,
      icon: 'RefreshCw',
      color: getMetricColor(metrics?.recovery, true),
      description: 'Recovery from drawdown'
    },
    {
      label: 'Consecutive Wins',
      value: metrics?.consecutiveWins?.toString(),
      icon: 'Zap',
      color: 'text-success',
      description: 'Max winning streak'
    },
    {
      label: 'Consecutive Losses',
      value: metrics?.consecutiveLosses?.toString(),
      icon: 'AlertTriangle',
      color: 'text-destructive',
      description: 'Max losing streak'
    },
    {
      label: 'Largest Win',
      value: formatCurrency(metrics?.largestWin),
      icon: 'Award',
      color: 'text-success',
      description: 'Best single trade'
    },
    {
      label: 'Largest Loss',
      value: formatCurrency(Math.abs(metrics?.largestLoss)),
      icon: 'AlertCircle',
      color: 'text-destructive',
      description: 'Worst single trade'
    },
    {
      label: 'Risk/Reward',
      value: metrics?.riskRewardRatio === Infinity ? '∞' : metrics?.riskRewardRatio?.toFixed(2),
      icon: 'Scale',
      color: getMetricColor(metrics?.riskRewardRatio - 1, true),
      description: 'Average win vs average loss'
    }
  ];

  const timeframes = ['all', '1M', '3M', '6M', '1Y'];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">Advanced trading statistics and ratios</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e?.target?.value)}
            className="text-sm bg-background border border-border rounded px-3 py-1 text-foreground"
          >
            {timeframes?.map(tf => (
              <option key={tf} value={tf}>
                {tf === 'all' ? 'All Time' : tf}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Basic Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {basicMetrics?.map((metric, index) => (
          <motion.div
            key={metric?.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background/50 rounded-lg p-4 border border-border/50"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon name={metric?.icon} size={16} className="text-accent" />
              <span className={`text-sm font-semibold ${metric?.color}`}>
                {metric?.value}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{metric?.label}</p>
          </motion.div>
        ))}
      </div>
      {/* Advanced Metrics Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Metrics
        </Button>
      </div>
      {/* Advanced Metrics */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          {advancedMetrics?.map((metric, index) => (
            <motion.div
              key={metric?.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/30"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name={metric?.icon} size={14} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{metric?.label}</p>
                  <p className="text-xs text-muted-foreground">{metric?.description}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${metric?.color}`}>
                {metric?.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
      {/* Performance Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="BarChart3" size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">Performance Summary</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Strategy Rating:</span>
              <span className={getMetricColor(metrics?.sharpeRatio, true)}>
                {metrics?.sharpeRatio > 1 ? 'Excellent' : 
                 metrics?.sharpeRatio > 0.5 ? 'Good' : 
                 metrics?.sharpeRatio > 0 ? 'Fair' : 'Poor'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Level:</span>
              <span className={metrics?.maxDrawdown > 1000 ? 'text-destructive' : 
                              metrics?.maxDrawdown > 500 ? 'text-warning' : 'text-success'}>
                {metrics?.maxDrawdown > 1000 ? 'High' : 
                 metrics?.maxDrawdown > 500 ? 'Medium' : 'Low'}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Consistency:</span>
              <span className={metrics?.winRate > 60 ? 'text-success' : 
                              metrics?.winRate > 40 ? 'text-warning' : 'text-destructive'}>
                {metrics?.winRate > 60 ? 'High' : 
                 metrics?.winRate > 40 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Efficiency:</span>
              <span className={metrics?.profitFactor > 1.5 ? 'text-success' : 
                              metrics?.profitFactor > 1 ? 'text-warning' : 'text-destructive'}>
                {metrics?.profitFactor > 1.5 ? 'Excellent' : 
                 metrics?.profitFactor > 1 ? 'Good' : 'Poor'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMetricsPanel;