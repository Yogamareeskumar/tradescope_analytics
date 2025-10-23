import React, { useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';


const PremiumVisualizationEngine = ({ 
  data, 
  chartType = 'line', 
  config = {},
  dimensions = { width: '100%', height: 400 },
  theme = 'dark'
}) => {
  // Premium color schemes
  const colorSchemes = {
    default: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
    profit: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
    loss: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
    gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
    monochrome: ['#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db'],
    neon: ['#00ff88', '#00d4ff', '#ff0099', '#ffaa00', '#aa00ff']
  };

  const colors = colorSchemes?.[config?.colorScheme] || colorSchemes?.default;

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-muted-foreground">{entry?.dataKey}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {typeof entry?.value === 'number' ? entry?.value?.toLocaleString() : entry?.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Advanced grid styling
  const gridConfig = {
    stroke: theme === 'dark' ? '#374151' : '#e5e7eb',
    strokeDasharray: config?.gridStyle === 'dashed' ? '3 3' : '0',
    strokeWidth: 1,
    opacity: config?.showGrid ? 0.5 : 0
  };

  // Generate gradient definitions
  const renderGradients = () => (
    <defs>
      {colors?.map((color, index) => (
        <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
        </linearGradient>
      ))}
    </defs>
  );

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
      ...dimensions
    };

    const commonAxisProps = {
      tick: { fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#4b5563' },
      axisLine: { stroke: theme === 'dark' ? '#4b5563' : '#9ca3af' },
      tickLine: { stroke: theme === 'dark' ? '#4b5563' : '#9ca3af' }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {renderGradients()}
            <CartesianGrid {...gridConfig} />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {config?.showLegend && <Legend />}
            {Object.keys(data?.[0] || {})?.filter(key => key !== 'name')?.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId={config?.stacked ? "1" : undefined}
                stroke={colors?.[index % colors?.length]}
                fill={config?.gradient ? `url(#gradient-${index % colors?.length})` : colors?.[index % colors?.length]}
                strokeWidth={2}
                dot={{ fill: colors?.[index % colors?.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors?.[index % colors?.length], strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid {...gridConfig} />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {config?.showLegend && <Legend />}
            {Object.keys(data?.[0] || {})?.filter(key => key !== 'name')?.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors?.[index % colors?.length]}
                radius={[4, 4, 0, 0]}
              >
                {data?.map((entry, entryIndex) => (
                  <Cell 
                    key={`cell-${entryIndex}`} 
                    fill={colors?.[entryIndex % colors?.length]}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid {...gridConfig} />
            <XAxis type="number" dataKey="x" {...commonAxisProps} />
            <YAxis type="number" dataKey="y" {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {config?.showLegend && <Legend />}
            <Scatter
              name="Data Points"
              data={data}
              fill={colors?.[0]}
            />
          </ScatterChart>
        );

      case 'radar':
        return (
          <RadarChart {...commonProps}>
            <PolarGrid stroke={gridConfig?.stroke} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
            />
            <PolarRadiusAxis 
              tick={{ fontSize: 10, fill: theme === 'dark' ? '#6b7280' : '#6b7280' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            {Object.keys(data?.[0] || {})?.filter(key => key !== 'subject')?.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={colors?.[index % colors?.length]}
                fill={colors?.[index % colors?.length]}
                fillOpacity={0.1}
                strokeWidth={2}
                dot={{ fill: colors?.[index % colors?.length], strokeWidth: 2, r: 4 }}
              />
            ))}
          </RadarChart>
        );

      default: // line chart
        return (
          <LineChart {...commonProps}>
            <CartesianGrid {...gridConfig} />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {config?.showLegend && <Legend />}
            {Object.keys(data?.[0] || {})?.filter(key => key !== 'name')?.map((key, index) => (
              <Line
                key={key}
                type={config?.smooth ? "monotone" : "linear"}
                dataKey={key}
                stroke={colors?.[index % colors?.length]}
                strokeWidth={config?.strokeWidth || 2}
                dot={{ fill: colors?.[index % colors?.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors?.[index % colors?.length], strokeWidth: 2 }}
                strokeDasharray={config?.dashed ? "5 5" : "0"}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={dimensions?.height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default PremiumVisualizationEngine;