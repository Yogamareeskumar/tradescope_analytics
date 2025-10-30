import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ChartTypeSelector = ({ activeChart, onChartChange, premiumMode = false }) => {
  const basicChartTypes = [
    {
      id: 'calendar',
      name: 'Calendar Heatmap',
      icon: 'Calendar',
      description: 'Daily PnL trends over time'
    },
    {
      id: 'radar',
      name: 'Strategy Performance',
      icon: 'Target',
      description: 'Multi-dimensional strategy analysis'
    },
    {
      id: 'bar',
      name: 'Time Analysis',
      icon: 'BarChart3',
      description: 'Detailed time-based performance'
    },
    {
      id: 'line',
      name: 'Trend Analysis',
      icon: 'TrendingUp',
      description: 'Performance trends and patterns'
    }
  ];

  const premiumChartTypes = [
    ...basicChartTypes,
    {
      id: 'premium-candlestick',
      name: 'Advanced Candlestick',
      icon: 'CandlestickChart',
      description: 'Professional OHLC analysis',
      premium: true
    },
    {
      id: 'premium-heatmap',
      name: 'Heatmap Matrix',
      icon: 'Grid3X3',
      description: 'Time-based performance patterns',
      premium: true
    },
    {
      id: 'premium-risk',
      name: 'Risk Analytics',
      icon: 'Shield',
      description: 'Advanced risk metrics & drawdown',
      premium: true
    },
    {
      id: 'premium-correlation',
      name: 'Correlation Matrix',
      icon: 'Network',
      description: 'Asset correlation analysis',
      premium: true
    },
    {
      id: 'premium-distribution',
      name: 'Returns Distribution',
      icon: 'BarChart4',
      description: 'Statistical return analysis',
      premium: true
    },
    {
      id: 'premium-3d',
      name: '3D Surface Plot',
      icon: 'Box',
      description: 'Multi-dimensional visualization',
      premium: true
    }
  ];

  const chartTypes = premiumMode ? premiumChartTypes : basicChartTypes;

  return (
    <div className="space-y-4">
      {premiumMode && (
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
            <Icon name="Star" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Premium Visualizations Enabled</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {chartTypes?.map((chart) => (
          <Button
            key={chart?.id}
            variant={activeChart === chart?.id ? "default" : "outline"}
            onClick={() => onChartChange(chart?.id)}
            className={`flex items-start space-x-3 p-4 h-auto text-left transition-all duration-200 ${
              chart?.premium 
                ? 'border-accent/50 hover:border-accent bg-gradient-to-br from-accent/5 to-primary/5' :''
            } ${
              activeChart === chart?.id && chart?.premium
                ? 'bg-gradient-to-br from-accent to-primary text-primary-foreground'
                : ''
            }`}
          >
            <div className={`p-2 rounded-lg ${
              activeChart === chart?.id 
                ? chart?.premium 
                  ? 'bg-white/20' :'bg-primary/20'
                : chart?.premium
                  ? 'bg-accent/20' :'bg-muted'
            }`}>
              <Icon name={chart?.icon} size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{chart?.name}</span>
                {chart?.premium && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Crown" size={12} className="text-accent" />
                    <span className="text-xs text-accent font-medium">PRO</span>
                  </div>
                )}
              </div>
              <p className={`text-xs mt-1 ${
                activeChart === chart?.id && chart?.premium
                  ? 'text-primary-foreground/80'
                  : 'text-muted-foreground'
              }`}>
                {chart?.description}
              </p>
            </div>
          </Button>
        ))}
      </div>

      {premiumMode && (
        <div className="mt-6 p-4 bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg border border-accent/20">
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Premium Features</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Unlock institutional-grade analytics with advanced risk metrics, correlation analysis, and AI-powered insights.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span>Real-time risk monitoring</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span>Advanced statistical analysis</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span>Multi-asset correlation</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span>AI performance insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartTypeSelector;