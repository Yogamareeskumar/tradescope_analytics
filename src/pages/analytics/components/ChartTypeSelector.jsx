import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ChartTypeSelector = ({ activeChart, onChartChange }) => {
  const chartTypes = [
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

  return (
    <div className="flex flex-wrap gap-2">
      {chartTypes?.map((chart) => (
        <Button
          key={chart?.id}
          variant={activeChart === chart?.id ? "default" : "outline"}
          onClick={() => onChartChange(chart?.id)}
          className="flex items-center space-x-2 px-4 py-2"
        >
          <Icon name={chart?.icon} size={18} />
          <div className="text-left">
            <div className="text-sm font-medium">{chart?.name}</div>
            <div className="text-xs opacity-70 hidden lg:block">{chart?.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ChartTypeSelector;