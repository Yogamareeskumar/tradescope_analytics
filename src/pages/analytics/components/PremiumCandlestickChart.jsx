import React, { useState, useMemo } from 'react';
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const PremiumCandlestickChart = ({ data = [], currency = 'USD', config = {} }) => {
  const [viewMode, setViewMode] = useState('candlestick');
  
  // Transform data for candlestick format
  const candlestickData = useMemo(() => {
    if (!data?.length) return [];
    
    return data?.map((item, index) => ({
      date: item?.date || new Date(Date.now() - (data.length - index) * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
      open: item?.open_pnl || (index > 0 ? data?.[index - 1]?.cumulative_pnl || 0 : 0),
      high: Math.max(item?.daily_pnl || 0, item?.cumulative_pnl || 0, item?.open_pnl || 0),
      low: Math.min(item?.daily_pnl || 0, item?.cumulative_pnl || 0, item?.open_pnl || 0, 0),
      close: item?.cumulative_pnl || 0,
      volume: item?.volume || Math.floor(Math.random() * 1000) + 100,
      pnl: item?.daily_pnl || 0,
      winRate: item?.win_rate || 0
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{new Date(label)?.toLocaleDateString()}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Open:</span>
              <span className="font-medium text-foreground">{formatCurrency(data?.open)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">High:</span>
              <span className="font-medium text-success">{formatCurrency(data?.high)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Low:</span>
              <span className="font-medium text-destructive">{formatCurrency(data?.low)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Close:</span>
              <span className="font-medium text-foreground">{formatCurrency(data?.close)}</span>
            </div>
            <hr className="border-border my-2" />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Daily P&L:</span>
              <span className={`font-medium ${data?.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(data?.pnl)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-medium text-foreground">{data?.volume?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CandlestickBar = ({ payload, x, y, width, height }) => {
    const { open, close, high, low } = payload;
    const isGreen = close >= open;
    const color = isGreen ? '#22c55e' : '#ef4444';
    const bodyHeight = Math.abs(close - open);
    const bodyY = Math.min(open, close);
    
    return (
      <g>
        {/* High-Low line */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + height}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body rectangle */}
        <rect
          x={x + width * 0.2}
          y={bodyY}
          width={width * 0.6}
          height={Math.max(bodyHeight, 2)}
          fill={isGreen ? color : 'none'}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

  const viewModes = [
    { id: 'candlestick', name: 'Candlestick', icon: 'BarChart3' },
    { id: 'line', name: 'Line Chart', icon: 'TrendingUp' },
    { id: 'area', name: 'Area Chart', icon: 'Area' },
    { id: 'volume', name: 'Volume', icon: 'BarChart2' }
  ];

  return (
    <div className="space-y-4">
      {/* Chart Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Advanced Price Action</h3>
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
      <div className="bg-card rounded-lg border border-border p-4" style={{ height: '500px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'candlestick' ? (
            <ComposedChart data={candlestickData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Custom Candlestick rendering would go here - simplified as bars for now */}
              <Bar
                dataKey="pnl"
                name="Daily P&L"
                fill={(entry) => entry?.pnl >= 0 ? '#22c55e' : '#ef4444'}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Cumulative P&L"
              />
            </ComposedChart>
          ) : viewMode === 'line' ? (
            <ComposedChart data={candlestickData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Portfolio Value"
              />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Daily P&L"
              />
            </ComposedChart>
          ) : viewMode === 'area' ? (
            <ComposedChart data={candlestickData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="close"
                stroke="#8b5cf6"
                fill="url(#colorGradient)"
                strokeWidth={2}
                name="Portfolio Value"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          ) : (
            <ComposedChart data={candlestickData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="volume"
                fill="#64748b"
                name="Trading Volume"
                opacity={0.7}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Chart Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">Highest</span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">
            {formatCurrency(Math.max(...(candlestickData?.map(d => d?.high) || [0])))}
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingDown" size={16} className="text-destructive" />
            <span className="text-sm text-muted-foreground">Lowest</span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">
            {formatCurrency(Math.min(...(candlestickData?.map(d => d?.low) || [0])))}
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="BarChart2" size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">Avg Volume</span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">
            {Math.round(candlestickData?.reduce((sum, d) => sum + (d?.volume || 0), 0) / (candlestickData?.length || 1))?.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">Volatility</span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">
            {(Math.sqrt(candlestickData?.reduce((sum, d) => sum + Math.pow(d?.pnl || 0, 2), 0) / (candlestickData?.length || 1)) / 100)?.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumCandlestickChart;