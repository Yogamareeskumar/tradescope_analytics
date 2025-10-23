import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const StrategyRadarChart = () => {
  // Mock strategy performance data
  const strategyData = [
    {
      strategy: 'Scalping',
      performance: 85,
      winRate: 78,
      riskReward: 72,
      consistency: 88,
      profitability: 82
    },
    {
      strategy: 'Swing Trading',
      performance: 92,
      winRate: 85,
      riskReward: 95,
      consistency: 90,
      profitability: 89
    },
    {
      strategy: 'Day Trading',
      performance: 76,
      winRate: 68,
      riskReward: 80,
      consistency: 75,
      profitability: 78
    },
    {
      strategy: 'Momentum',
      performance: 88,
      winRate: 82,
      riskReward: 85,
      consistency: 91,
      profitability: 87
    },
    {
      strategy: 'Mean Reversion',
      performance: 70,
      winRate: 65,
      riskReward: 78,
      consistency: 68,
      profitability: 72
    }
  ];

  // Aggregate data for radar chart
  const radarData = [
    {
      subject: 'Win Rate',
      A: strategyData?.reduce((sum, item) => sum + item?.winRate, 0) / strategyData?.length,
      fullMark: 100
    },
    {
      subject: 'Risk/Reward',
      A: strategyData?.reduce((sum, item) => sum + item?.riskReward, 0) / strategyData?.length,
      fullMark: 100
    },
    {
      subject: 'Consistency',
      A: strategyData?.reduce((sum, item) => sum + item?.consistency, 0) / strategyData?.length,
      fullMark: 100
    },
    {
      subject: 'Profitability',
      A: strategyData?.reduce((sum, item) => sum + item?.profitability, 0) / strategyData?.length,
      fullMark: 100
    },
    {
      subject: 'Performance',
      A: strategyData?.reduce((sum, item) => sum + item?.performance, 0) / strategyData?.length,
      fullMark: 100
    }
  ];

  const getPerformanceColor = (score) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getPerformanceIcon = (score) => {
    if (score >= 85) return 'TrendingUp';
    if (score >= 70) return 'Minus';
    return 'TrendingDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="Target" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Strategy Performance</h3>
          <p className="text-sm text-muted-foreground">Multi-dimensional analysis</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="h-64" aria-label="Strategy Performance Radar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Strategy Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Strategy Breakdown</h4>
          {strategyData?.map((strategy, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-full ${getPerformanceColor(strategy?.performance)} bg-current/10`}>
                  <Icon 
                    name={getPerformanceIcon(strategy?.performance)} 
                    size={14} 
                    className={getPerformanceColor(strategy?.performance)}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {strategy?.strategy}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Win Rate: {strategy?.winRate}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${getPerformanceColor(strategy?.performance)}`}>
                  {strategy?.performance}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Overall
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Performance Insights */}
      <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">Performance Insights</h5>
            <p className="text-xs text-muted-foreground">
              Your swing trading strategy shows the highest consistency (90%) and risk-reward ratio (95%). 
              Consider focusing more on swing trades while improving mean reversion entry timing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyRadarChart;