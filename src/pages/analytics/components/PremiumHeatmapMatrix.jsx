import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

const PremiumHeatmapMatrix = ({ data = [], currency = 'USD', config = {} }) => {
  const [selectedMetric, setSelectedMetric] = useState('pnl');
  const [timeframe, setTimeframe] = useState('hourly');
  
  // Generate matrix data based on timeframe
  const matrixData = useMemo(() => {
    if (!data?.length) return [];
    
    if (timeframe === 'hourly') {
      // Create 24x7 hourly heatmap (hour vs day of week)
      const matrix = Array(24)?.fill(null)?.map(() => Array(7)?.fill({ value: 0, count: 0, trades: [] }));
      
      data?.forEach(trade => {
        const date = new Date(trade?.created_at || trade?.date);
        const hour = date?.getHours();
        const day = date?.getDay();
        const value = trade?.[selectedMetric] || trade?.daily_pnl || 0;
        
        if (hour >= 0 && hour < 24 && day >= 0 && day < 7) {
          const current = matrix?.[hour]?.[day];
          matrix[hour][day] = {
            value: current?.value + value,
            count: current?.count + 1,
            trades: [...(current?.trades || []), trade]
          };
        }
      });
      
      return matrix?.map((hourRow, hour) =>
        hourRow?.map((cell, day) => ({
          hour,
          day,
          value: cell?.count > 0 ? cell?.value / cell?.count : 0,
          totalValue: cell?.value,
          count: cell?.count,
          trades: cell?.trades,
          intensity: cell?.count > 0 ? Math.min(Math.abs(cell?.value) / 1000, 1) : 0
        }))
      )?.flat();
    } else {
      // Monthly calendar view (day vs week)
      const matrix = Array(6)?.fill(null)?.map(() => Array(7)?.fill({ value: 0, count: 0, trades: [] }));
      const startOfMonth = new Date();
      startOfMonth?.setDate(1);
      
      data?.forEach(trade => {
        const date = new Date(trade?.created_at || trade?.date);
        const dayOfMonth = date?.getDate();
        const firstDay = new Date(date?.getFullYear(), date?.getMonth(), 1)?.getDay();
        const week = Math.floor((dayOfMonth + firstDay - 1) / 7);
        const day = (dayOfMonth + firstDay - 1) % 7;
        const value = trade?.[selectedMetric] || trade?.daily_pnl || 0;
        
        if (week >= 0 && week < 6 && day >= 0 && day < 7) {
          const current = matrix?.[week]?.[day];
          matrix[week][day] = {
            value: current?.value + value,
            count: current?.count + 1,
            trades: [...(current?.trades || []), trade]
          };
        }
      });
      
      return matrix?.map((weekRow, week) =>
        weekRow?.map((cell, day) => ({
          week,
          day,
          value: cell?.count > 0 ? cell?.value / cell?.count : 0,
          totalValue: cell?.value,
          count: cell?.count,
          trades: cell?.trades,
          intensity: cell?.count > 0 ? Math.min(Math.abs(cell?.value) / 1000, 1) : 0
        }))
      )?.flat();
    }
  }, [data, selectedMetric, timeframe]);

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter?.format(value);
  };

  const getHeatmapColor = (intensity, value) => {
    if (intensity === 0) return 'bg-muted/30';
    
    const opacity = Math.max(0.2, intensity);
    if (value > 0) {
      return `bg-success/40 hover:bg-success/60`;
    } else if (value < 0) {
      return `bg-destructive/40 hover:bg-destructive/60`;
    } else {
      return `bg-muted/50 hover:bg-muted/70`;
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hourLabels = Array(24)?.fill(null)?.map((_, i) => 
    new Date(2024, 0, 1, i)?.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    })
  );

  const metrics = [
    { id: 'pnl', name: 'P&L', icon: 'DollarSign' },
    { id: 'win_rate', name: 'Win Rate', icon: 'Target' },
    { id: 'volume', name: 'Volume', icon: 'BarChart2' },
    { id: 'trade_count', name: 'Trade Count', icon: 'Hash' }
  ];

  const timeframes = [
    { id: 'hourly', name: 'Hourly Patterns', icon: 'Clock' },
    { id: 'monthly', name: 'Monthly Calendar', icon: 'Calendar' }
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Icon name="Grid3X3" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Performance Heatmap Matrix</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {metrics?.map((metric) => (
              <button
                key={metric?.id}
                onClick={() => setSelectedMetric(metric?.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedMetric === metric?.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={metric?.icon} size={14} />
                <span>{metric?.name}</span>
              </button>
            ))}
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {timeframes?.map((tf) => (
              <button
                key={tf?.id}
                onClick={() => setTimeframe(tf?.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                  timeframe === tf?.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tf?.icon} size={14} />
                <span className="hidden sm:inline">{tf?.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Heatmap Matrix */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="overflow-x-auto">
          {timeframe === 'hourly' ? (
            <div className="min-w-[600px]">
              {/* Day labels */}
              <div className="flex mb-2">
                <div className="w-16"></div>
                {dayLabels?.map((day, index) => (
                  <div key={index} className="flex-1 text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Hour rows */}
              {hourLabels?.map((hourLabel, hour) => (
                <div key={hour} className="flex items-center mb-1">
                  <div className="w-16 text-xs text-muted-foreground text-right pr-2">
                    {hourLabel}
                  </div>
                  {dayLabels?.map((_, day) => {
                    const cell = matrixData?.find(d => d?.hour === hour && d?.day === day);
                    return (
                      <div
                        key={`${hour}-${day}`}
                        className={`flex-1 h-8 mx-0.5 rounded cursor-pointer transition-colors ${
                          getHeatmapColor(cell?.intensity || 0, cell?.value || 0)
                        }`}
                        title={`${hourLabel} on ${dayLabels?.[day]}: ${
                          cell?.count || 0
                        } trades, ${formatCurrency(cell?.totalValue || 0)}`}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          {cell?.count > 0 && (
                            <span className="text-xs font-medium text-foreground">
                              {cell?.count}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="min-w-[400px]">
              {/* Day labels for monthly view */}
              <div className="flex mb-2">
                <div className="w-8"></div>
                {dayLabels?.map((day, index) => (
                  <div key={index} className="flex-1 text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Week rows */}
              {Array(6)?.fill(null)?.map((_, week) => (
                <div key={week} className="flex items-center mb-1">
                  <div className="w-8 text-xs text-muted-foreground text-center">
                    {week + 1}
                  </div>
                  {dayLabels?.map((_, day) => {
                    const cell = matrixData?.find(d => d?.week === week && d?.day === day);
                    return (
                      <div
                        key={`${week}-${day}`}
                        className={`flex-1 h-8 mx-0.5 rounded cursor-pointer transition-colors ${
                          getHeatmapColor(cell?.intensity || 0, cell?.value || 0)
                        }`}
                        title={`Week ${week + 1}, ${dayLabels?.[day]}: ${
                          cell?.count || 0
                        } trades, ${formatCurrency(cell?.totalValue || 0)}`}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          {cell?.count > 0 && (
                            <span className="text-xs font-medium text-foreground">
                              {cell?.count}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-muted/30 rounded"></div>
              <div className="w-3 h-3 bg-success/20 rounded"></div>
              <div className="w-3 h-3 bg-success/40 rounded"></div>
              <div className="w-3 h-3 bg-success/60 rounded"></div>
              <div className="w-3 h-3 bg-success/80 rounded"></div>
            </div>
            <span className="text-sm text-muted-foreground">More</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {matrixData?.filter(d => d?.count > 0)?.length} active periods
          </div>
        </div>
      </div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">Peak Performance</span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">
            {timeframe === 'hourly' ? '10:30 AM - 11:30 AM' : 'Wednesdays'}
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">Most Active</span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">
            {timeframe === 'hourly' ? 'Tue-Thu 9-4 PM' : 'Mid-month periods'}
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">Hit Rate</span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">
            {((matrixData?.filter(d => d?.value > 0)?.length / Math.max(matrixData?.length, 1)) * 100)?.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumHeatmapMatrix;