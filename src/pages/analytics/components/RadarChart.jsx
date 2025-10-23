import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const StrategyRadarChart = ({ currency }) => {
  const strategyData = [
    {
      strategy: 'Win Rate',
      current: 68,
      benchmark: 55,
      fullMark: 100
    },
    {
      strategy: 'Risk/Reward',
      current: 75,
      benchmark: 60,
      fullMark: 100
    },
    {
      strategy: 'Consistency',
      current: 82,
      benchmark: 70,
      fullMark: 100
    },
    {
      strategy: 'Profit Factor',
      current: 71,
      benchmark: 65,
      fullMark: 100
    },
    {
      strategy: 'Drawdown Control',
      current: 85,
      benchmark: 75,
      fullMark: 100
    },
    {
      strategy: 'Position Sizing',
      current: 78,
      benchmark: 70,
      fullMark: 100
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.dataKey === 'current' ? 'Your Performance' : 'Market Benchmark'}: {entry?.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Strategy Performance Analysis</h3>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Your Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-muted-foreground">Market Benchmark</span>
          </div>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={strategyData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="strategy" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Radar
              name="Your Performance"
              dataKey="current"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Market Benchmark"
              dataKey="benchmark"
              stroke="hsl(var(--secondary))"
              fill="hsl(var(--secondary))"
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="bg-success/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Strengths</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Excellent drawdown control and consistency scores above market average
          </div>
        </div>
        
        <div className="bg-warning/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Areas to Improve</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Focus on improving profit factor and risk/reward ratios
          </div>
        </div>
        
        <div className="bg-accent/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Overall Score</span>
          </div>
          <div className="text-sm text-muted-foreground">
            76/100 - Above average performance with room for optimization
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyRadarChart;