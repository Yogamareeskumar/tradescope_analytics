import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MetricsPanel = ({ currency }) => {
  const [metrics, setMetrics] = useState({});

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = (event) => {
      // Metrics will automatically update when currency prop changes
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  // Generate mock metrics data
  const generateMetrics = () => {
    const totalTrades = 247;
    const winningTrades = 168;
    const losingTrades = totalTrades - winningTrades;
    const winRate = (winningTrades / totalTrades) * 100;
    
    const totalProfit = 45230;
    const totalLoss = -18940;
    const netPnL = totalProfit + totalLoss;
    
    const avgWin = totalProfit / winningTrades;
    const avgLoss = Math.abs(totalLoss) / losingTrades;
    const riskRewardRatio = avgWin / avgLoss;
    
    const profitFactor = totalProfit / Math.abs(totalLoss);
    const maxDrawdown = -8450;
    const maxDrawdownPercent = (maxDrawdown / 50000) * 100;
    
    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      netPnL,
      totalProfit,
      totalLoss,
      avgWin,
      avgLoss,
      riskRewardRatio,
      profitFactor,
      maxDrawdown,
      maxDrawdownPercent,
      consistencyScore: 78,
      sharpeRatio: 1.42,
      calmarRatio: 2.1,
      recoveryFactor: 3.1
    };
  };

  const metricsData = generateMetrics();

  const formatCurrency = (amount) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const formatted = currency === 'INR' ? amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : amount?.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return `${symbol}${formatted}`;
  };

  const getPerformanceColor = (value, threshold) => {
    if (value >= threshold) return 'text-success';
    if (value >= threshold * 0.7) return 'text-warning';
    return 'text-destructive';
  };

  const metricCards = [
    {
      title: 'Win Rate',
      value: `${metricsData?.winRate?.toFixed(1)}%`,
      subtitle: `${metricsData?.winningTrades}/${metricsData?.totalTrades} trades`,
      icon: 'Target',
      color: getPerformanceColor(metricsData?.winRate, 60),
      trend: metricsData?.winRate > 60 ? 'up' : 'down'
    },
    {
      title: 'Net PnL',
      value: formatCurrency(metricsData?.netPnL),
      subtitle: `${formatCurrency(metricsData?.totalProfit)} profit, ${formatCurrency(metricsData?.totalLoss)} loss`,
      icon: 'TrendingUp',
      color: metricsData?.netPnL > 0 ? 'text-success' : 'text-destructive',
      trend: metricsData?.netPnL > 0 ? 'up' : 'down'
    },
    {
      title: 'Risk/Reward Ratio',
      value: `1:${metricsData?.riskRewardRatio?.toFixed(2)}`,
      subtitle: `Avg win: ${formatCurrency(metricsData?.avgWin)}, Avg loss: ${formatCurrency(metricsData?.avgLoss)}`,
      icon: 'Scale',
      color: getPerformanceColor(metricsData?.riskRewardRatio, 1.5),
      trend: metricsData?.riskRewardRatio > 1.5 ? 'up' : 'down'
    },
    {
      title: 'Profit Factor',
      value: metricsData?.profitFactor?.toFixed(2),
      subtitle: 'Gross profit / Gross loss',
      icon: 'Calculator',
      color: getPerformanceColor(metricsData?.profitFactor, 1.5),
      trend: metricsData?.profitFactor > 1.5 ? 'up' : 'down'
    },
    {
      title: 'Max Drawdown',
      value: `${metricsData?.maxDrawdownPercent?.toFixed(1)}%`,
      subtitle: formatCurrency(metricsData?.maxDrawdown),
      icon: 'TrendingDown',
      color: Math.abs(metricsData?.maxDrawdownPercent) < 15 ? 'text-success' : 'text-destructive',
      trend: Math.abs(metricsData?.maxDrawdownPercent) < 15 ? 'up' : 'down'
    },
    {
      title: 'Consistency Score',
      value: `${metricsData?.consistencyScore}/100`,
      subtitle: 'Performance stability rating',
      icon: 'Activity',
      color: getPerformanceColor(metricsData?.consistencyScore, 70),
      trend: metricsData?.consistencyScore > 70 ? 'up' : 'down'
    },
    {
      title: 'Sharpe Ratio',
      value: metricsData?.sharpeRatio?.toFixed(2),
      subtitle: 'Risk-adjusted returns',
      icon: 'BarChart3',
      color: getPerformanceColor(metricsData?.sharpeRatio, 1.0),
      trend: metricsData?.sharpeRatio > 1.0 ? 'up' : 'down'
    },
    {
      title: 'Recovery Factor',
      value: metricsData?.recoveryFactor?.toFixed(1),
      subtitle: 'Net profit / Max drawdown',
      icon: 'RefreshCw',
      color: getPerformanceColor(metricsData?.recoveryFactor, 2.0),
      trend: metricsData?.recoveryFactor > 2.0 ? 'up' : 'down'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date()?.toLocaleString()}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards?.map((metric, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${metric?.color === 'text-success' ? 'bg-success/10' : 
                metric?.color === 'text-destructive' ? 'bg-destructive/10' : 
                metric?.color === 'text-warning' ? 'bg-warning/10' : 'bg-accent/10'}`}>
                <Icon name={metric?.icon} size={18} className={metric?.color} />
              </div>
              
              <div className={`p-1 rounded ${metric?.trend === 'up' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <Icon 
                  name={metric?.trend === 'up' ? 'ArrowUp' : 'ArrowDown'} 
                  size={14} 
                  className={metric?.trend === 'up' ? 'text-success' : 'text-destructive'} 
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">{metric?.title}</h4>
              <div className={`text-xl font-bold ${metric?.color}`}>
                {metric?.value}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {metric?.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Performance summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-success">Strengths</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Strong win rate above 65%</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Positive risk-reward ratio</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Good consistency score</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-warning">Areas to Improve</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={14} className="text-warning" />
                <span>Reduce maximum drawdown</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={14} className="text-warning" />
                <span>Improve profit factor</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={14} className="text-warning" />
                <span>Enhance position sizing</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-accent">Recommendations</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Icon name="Lightbulb" size={14} className="text-accent" />
                <span>Focus on risk management</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Lightbulb" size={14} className="text-accent" />
                <span>Analyze losing trades</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Lightbulb" size={14} className="text-accent" />
                <span>Maintain current strategy</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;