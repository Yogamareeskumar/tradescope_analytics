import React from 'react';

import Icon from '../../../components/AppIcon';

const PremiumCorrelationMatrix = ({ data = [], currency = 'USD', config = {} }) => {
  const formatCurrency = (amount) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const formatted = currency === 'INR' ? amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : amount?.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return `${symbol}${formatted}`;
  };

  // Mock correlation data for different asset classes
  const generateCorrelationData = () => {
    const assets = ['NIFTY', 'BANKNIFTY', 'GOLD', 'CRUDE', 'USD', 'TECH'];
    const correlationMatrix = [];
    
    assets?.forEach((asset1, i) => {
      assets?.forEach((asset2, j) => {
        let correlation;
        if (i === j) {
          correlation = 1.0; // Self-correlation
        } else {
          // Generate realistic correlations
          correlation = (Math.random() - 0.5) * 2;
          if (asset1 === 'NIFTY' && asset2 === 'BANKNIFTY') correlation = 0.85;
          if (asset1 === 'GOLD' && asset2 === 'USD') correlation = -0.7;
          if (asset1 === 'CRUDE' && asset2 === 'USD') correlation = -0.6;
        }
        
        correlationMatrix?.push({
          x: i,
          y: j,
          asset1,
          asset2,
          correlation: correlation,
          strength: Math.abs(correlation)
        });
      });
    });
    
    return { matrix: correlationMatrix, assets };
  };

  const { matrix, assets } = generateCorrelationData();

  const getCorrelationColor = (correlation) => {
    const intensity = Math.abs(correlation);
    if (correlation > 0.7) return '#10b981'; // Strong positive - green
    if (correlation > 0.3) return '#84cc16'; // Moderate positive - light green
    if (correlation > -0.3) return '#6b7280'; // Weak - gray
    if (correlation > -0.7) return '#f59e0b'; // Moderate negative - orange
    return '#ef4444'; // Strong negative - red
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">
            {data?.asset1} vs {data?.asset2}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Correlation: <span className="font-semibold text-foreground">
                {data?.correlation?.toFixed(3)}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {data?.correlation > 0.7 ? 'Strong Positive' :
               data?.correlation > 0.3 ? 'Moderate Positive' :
               data?.correlation > -0.3 ? 'Weak' :
               data?.correlation > -0.7 ? 'Moderate Negative' : 'Strong Negative'}
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
          <Icon name="Network" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Asset Correlation Matrix</h3>
          <div className="flex items-center space-x-1 px-2 py-1 bg-accent/10 rounded-md">
            <Icon name="Crown" size={12} className="text-accent" />
            <span className="text-xs font-medium text-accent">Premium</span>
          </div>
        </div>
      </div>
      {/* Correlation Matrix Visualization */}
      <div className="bg-card rounded-lg border border-border p-4 mb-4">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Header row */}
          <div></div>
          {assets?.map(asset => (
            <div key={asset} className="text-xs text-center font-medium text-muted-foreground p-2">
              {asset}
            </div>
          ))}
          
          {/* Matrix rows */}
          {assets?.map((asset1, i) => (
            <React.Fragment key={asset1}>
              <div className="text-xs font-medium text-muted-foreground p-2 text-right">
                {asset1}
              </div>
              {assets?.map((asset2, j) => {
                const cellData = matrix?.find(m => m?.x === i && m?.y === j);
                return (
                  <div
                    key={`${asset1}-${asset2}`}
                    className="h-8 w-8 rounded flex items-center justify-center text-xs font-bold text-white cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor: getCorrelationColor(cellData?.correlation) }}
                    title={`${asset1} vs ${asset2}: ${cellData?.correlation?.toFixed(3)}`}
                  >
                    {Math.abs(cellData?.correlation) > 0.1 ? cellData?.correlation?.toFixed(1) : '0'}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Strong Negative (-1.0 to -0.7)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Moderate Negative (-0.7 to -0.3)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Weak (-0.3 to 0.3)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-lime-500 rounded"></div>
            <span>Moderate Positive (0.3 to 0.7)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Strong Positive (0.7 to 1.0)</span>
          </div>
        </div>
      </div>
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-4 border border-success/20">
          <div className="flex items-start space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-success">Highest Positive Correlation</p>
              <p className="text-xs text-muted-foreground mt-1">
                NIFTY & BANKNIFTY: 0.850 - Strong positive correlation indicates similar market movements
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-destructive/10 to-destructive/5 rounded-lg p-4 border border-destructive/20">
          <div className="flex items-start space-x-2">
            <Icon name="TrendingDown" size={16} className="text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Strongest Negative Correlation</p>
              <p className="text-xs text-muted-foreground mt-1">
                GOLD & USD: -0.700 - Strong negative correlation suggests inverse relationship
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCorrelationMatrix;