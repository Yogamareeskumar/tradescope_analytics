import React from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import Icon from '../../../components/AppIcon';

const PremiumReturnsDistribution = ({ data = [], currency = 'USD', config = {} }) => {
  const formatCurrency = (amount) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const formatted = currency === 'INR' ? amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : amount?.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return `${symbol}${formatted}`;
  };

  // Generate returns distribution data
  const generateDistributionData = () => {
    const returns = [];
    
    // Generate mock returns data with realistic distribution
    for (let i = 0; i < 500; i++) {
      // Normal distribution with slight positive skew
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const return_pct = (z0 * 0.02) + 0.001; // 2% volatility, 0.1% daily return
      returns?.push(return_pct * 100); // Convert to percentage
    }
    
    // Create histogram bins
    const bins = [];
    const binSize = 0.5; // 0.5% bins
    const minReturn = Math.min(...returns);
    const maxReturn = Math.max(...returns);
    
    for (let i = Math.floor(minReturn / binSize) * binSize; i <= Math.ceil(maxReturn / binSize) * binSize; i += binSize) {
      const binStart = i;
      const binEnd = i + binSize;
      const count = returns?.filter(r => r >= binStart && r < binEnd)?.length;
      
      bins?.push({
        range: `${binStart?.toFixed(1)}%`,
        binStart,
        binEnd,
        count,
        frequency: count / returns?.length,
        cumulative: 0 // Will be calculated below
      });
    }
    
    // Calculate cumulative frequency
    let cumulative = 0;
    bins?.forEach(bin => {
      cumulative += bin?.frequency;
      bin.cumulative = cumulative;
    });
    
    return { bins, returns, stats: calculateStats(returns) };
  };

  const calculateStats = (returns) => {
    const sorted = [...returns]?.sort((a, b) => a - b);
    const mean = returns?.reduce((sum, r) => sum + r, 0) / returns?.length;
    const variance = returns?.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns?.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate percentiles
    const getPercentile = (p) => sorted?.[Math.floor(p * sorted?.length)];
    
    // Skewness calculation
    const skewness = returns?.reduce((sum, r) => sum + Math.pow((r - mean) / stdDev, 3), 0) / returns?.length;
    
    // Kurtosis calculation
    const kurtosis = returns?.reduce((sum, r) => sum + Math.pow((r - mean) / stdDev, 4), 0) / returns?.length - 3;
    
    return {
      mean,
      median: getPercentile(0.5),
      stdDev,
      skewness,
      kurtosis,
      var95: getPercentile(0.05), // 95% VaR
      var99: getPercentile(0.01), // 99% VaR
      percentile25: getPercentile(0.25),
      percentile75: getPercentile(0.75),
      sharpeRatio: mean / stdDev * Math.sqrt(252), // Annualized
      maxDrawdown: Math.min(...returns),
      maxGain: Math.max(...returns)
    };
  };

  const { bins, returns, stats } = generateDistributionData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">
            Return Range: {data?.range} to {(data?.binStart + 0.5)?.toFixed(1)}%
          </p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Count: <span className="font-semibold text-foreground">{data?.count}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Frequency: <span className="font-semibold text-foreground">
                {(data?.frequency * 100)?.toFixed(2)}%
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Cumulative: <span className="font-semibold text-foreground">
                {(data?.cumulative * 100)?.toFixed(2)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart4" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Returns Distribution Analysis</h3>
          <div className="flex items-center space-x-1 px-2 py-1 bg-accent/10 rounded-md">
            <Icon name="Crown" size={12} className="text-accent" />
            <span className="text-xs font-medium text-accent">Premium</span>
          </div>
        </div>
      </div>
      {/* Distribution Chart */}
      <div className="bg-card rounded-lg border border-border p-4 mb-4" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={bins} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              yAxisId="left"
              dataKey="count" 
              fill="#6366f1" 
              opacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey={(d) => d?.cumulative * 100}
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Statistical Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Mean Return</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats?.mean?.toFixed(3)}%
          </div>
          <div className="text-xs text-muted-foreground">Daily average</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Activity" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Volatility</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats?.stdDev?.toFixed(3)}%
          </div>
          <div className="text-xs text-muted-foreground">Standard deviation</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Award" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Sharpe Ratio</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats?.sharpeRatio?.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">Risk-adjusted return</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} className="text-destructive" />
            <span className="text-sm font-medium text-foreground">95% VaR</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats?.var95?.toFixed(3)}%
          </div>
          <div className="text-xs text-muted-foreground">Value at Risk</div>
        </div>
      </div>
      {/* Advanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Distribution Characteristics</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Skewness</span>
              <span className="text-sm font-medium text-foreground">
                {stats?.skewness?.toFixed(3)}
                <span className="text-xs ml-1 text-muted-foreground">
                  {stats?.skewness > 0 ? '(Right-skewed)' : stats?.skewness < 0 ? '(Left-skewed)' : '(Symmetric)'}
                </span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Kurtosis</span>
              <span className="text-sm font-medium text-foreground">
                {stats?.kurtosis?.toFixed(3)}
                <span className="text-xs ml-1 text-muted-foreground">
                  {stats?.kurtosis > 0 ? '(Fat tails)' : '(Thin tails)'}
                </span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">25th Percentile</span>
              <span className="text-sm font-medium text-foreground">{stats?.percentile25?.toFixed(3)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">75th Percentile</span>
              <span className="text-sm font-medium text-foreground">{stats?.percentile75?.toFixed(3)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Risk Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">99% VaR</span>
              <span className="text-sm font-medium text-destructive">{stats?.var99?.toFixed(3)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Maximum Loss</span>
              <span className="text-sm font-medium text-destructive">{stats?.maxDrawdown?.toFixed(3)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Maximum Gain</span>
              <span className="text-sm font-medium text-success">{stats?.maxGain?.toFixed(3)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Median Return</span>
              <span className="text-sm font-medium text-foreground">{stats?.median?.toFixed(3)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumReturnsDistribution;