import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const Premium3DChart = ({ data = [], currency = 'USD', config = {} }) => {
  const [viewMode, setViewMode] = useState('scatter3d');
  const [rotationX, setRotationX] = useState(15);
  const [rotationY, setRotationY] = useState(45);
  const containerRef = useRef(null);
  
  // Transform data for 3D visualization
  const chartData = useMemo(() => {
    if (!data?.length) return [];
    
    return data?.map((item, index) => ({
      x: index, // Time dimension
      y: item?.daily_pnl || 0, // Performance dimension
      z: item?.volume || Math.random() * 1000, // Volume dimension
      risk: Math.abs(item?.daily_pnl || 0) / Math.max(item?.cumulative_pnl || 1, 1), // Risk dimension
      date: item?.date || new Date(Date.now() - (data.length - index) * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
      winRate: item?.win_rate || 0,
      sharpe: item?.sharpe_ratio || 0,
      drawdown: item?.drawdown || 0,
      size: Math.max(10, Math.min(100, Math.abs(item?.daily_pnl || 0) / 10)) // Bubble size
    }));
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

  // Custom 3D-like transformation for scatter points
  const transform3D = (x, y, z, rotX = rotationX, rotY = rotationY) => {
    const radX = (rotX * Math.PI) / 180;
    const radY = (rotY * Math.PI) / 180;
    
    // Apply rotation transformations
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    
    const newY = y * cosX - z * sinX;
    const newZ = y * sinX + z * cosX;
    const finalX = x * cosY + newZ * sinY;
    const finalY = newY;
    
    return {
      x: finalX,
      y: finalY,
      z: newZ
    };
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{new Date(data?.date)?.toLocaleDateString()}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">P&L:</span>
              <span className={`font-medium ${data?.y >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(data?.y)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-medium text-foreground">{data?.z?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Risk Score:</span>
              <span className="font-medium text-accent">{(data?.risk * 100)?.toFixed(1)}%</span>
            </div>
            {data?.sharpe && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sharpe:</span>
                <span className="font-medium text-foreground">{data?.sharpe?.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const viewModes = [
    { id: 'scatter3d', name: '3D Performance', icon: 'Box' },
    { id: 'risk-return', name: 'Risk-Return', icon: 'Target' },
    { id: 'time-volume', name: 'Time-Volume', icon: 'BarChart3' },
    { id: 'bubble', name: 'Bubble Chart', icon: 'Circle' }
  ];

  const renderChart = () => {
    switch (viewMode) {
      case 'scatter3d':
        return (
          <div className="relative">
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  domain={['dataMin', 'dataMax']}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  name="Time"
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  domain={['dataMin', 'dataMax']}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  name="P&L"
                  tickFormatter={formatCurrency}
                />
                <ZAxis 
                  type="number" 
                  dataKey="z" 
                  range={[20, 400]}
                  name="Volume"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Scatter
                  name="Performance vs Volume"
                  data={chartData}
                  fill="#8b5cf6"
                />
              </ScatterChart>
            </ResponsiveContainer>
            {/* 3D Controls */}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border p-3 space-y-2">
              <div className="text-xs text-muted-foreground mb-2">3D View Controls</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground w-8">X:</span>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={rotationX}
                    onChange={(e) => setRotationX(parseInt(e?.target?.value))}
                    className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-foreground w-8">{rotationX}°</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground w-8">Y:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotationY}
                    onChange={(e) => setRotationY(parseInt(e?.target?.value))}
                    className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-foreground w-8">{rotationY}°</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'risk-return':
        const riskReturnData = chartData?.map(d => ({
          ...d,
          x: d?.risk * 100, // Risk as X
          y: d?.y // Return as Y
        }));
        
        return (
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={[0, 'dataMax']}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                name="Risk %"
                tickFormatter={(value) => `${value?.toFixed(1)}%`}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={['dataMin', 'dataMax']}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                name="Return"
                tickFormatter={formatCurrency}
              />
              <ZAxis type="number" dataKey="size" range={[20, 200]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter
                name="Risk vs Return"
                data={riskReturnData}
                fill="#22c55e"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      case 'bubble':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={['dataMin', 'dataMax']}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                name="Time"
              />
              <YAxis 
                type="number" 
                dataKey="winRate" 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                name="Win Rate %"
                tickFormatter={(value) => `${value}%`}
              />
              <ZAxis type="number" dataKey="size" range={[30, 300]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter
                name="Win Rate vs Performance (Size = P&L)"
                data={chartData}
                fill="#f59e0b"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={['dataMin', 'dataMax']}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                name="Time"
              />
              <YAxis 
                type="number" 
                dataKey="z" 
                domain={['dataMin', 'dataMax']}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                name="Volume"
              />
              <ZAxis type="number" dataKey="size" range={[20, 200]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter
                name="Time vs Volume"
                data={chartData}
                fill="#06b6d4"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with view mode selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Icon name="Box" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">3D Performance Analysis</h3>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {viewModes?.map((mode) => (
            <button
              key={mode?.id}
              onClick={() => setViewMode(mode?.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === mode?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={mode?.icon} size={14} />
              <span className="hidden sm:inline">{mode?.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div ref={containerRef} className="bg-card rounded-lg border border-border p-6">
        {renderChart()}
      </div>

      {/* Analysis Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Performance Clustering</span>
          </div>
          <p className="text-xs text-muted-foreground">
            High-performing periods show consistent volume patterns with lower risk dispersion
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Risk Correlation</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Risk levels correlate inversely with win rates during high-volume periods
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="BarChart3" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Volume Impact</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Optimal performance occurs in medium-volume environments with controlled risk
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium3DChart;