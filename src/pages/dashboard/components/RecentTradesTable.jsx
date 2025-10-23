import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTradesTable = () => {
  const [currency, setCurrency] = useState('USD');

  // Mock recent trades data
  const recentTrades = [
    {
      id: 1,
      date: '2025-10-16',
      time: '09:15',
      instrument: 'AAPL',
      type: 'Long',
      quantity: 100,
      entryPrice: 175.50,
      exitPrice: 178.25,
      pnl: 275,
      status: 'Closed',
      source: 'Manual'
    },
    {
      id: 2,
      date: '2025-10-16',
      time: '08:45',
      instrument: 'TSLA',
      type: 'Short',
      quantity: 50,
      entryPrice: 242.80,
      exitPrice: 240.15,
      pnl: 132.50,
      status: 'Closed',
      source: 'Zerodha API'
    },
    {
      id: 3,
      date: '2025-10-15',
      time: '15:30',
      instrument: 'MSFT',
      type: 'Long',
      quantity: 75,
      entryPrice: 420.25,
      exitPrice: 418.90,
      pnl: -101.25,
      status: 'Closed',
      source: 'Manual'
    },
    {
      id: 4,
      date: '2025-10-15',
      time: '14:20',
      instrument: 'GOOGL',
      type: 'Long',
      quantity: 25,
      entryPrice: 2750.00,
      exitPrice: 2785.50,
      pnl: 887.50,
      status: 'Closed',
      source: 'MT5 API'
    },
    {
      id: 5,
      date: '2025-10-15',
      time: '11:10',
      instrument: 'NVDA',
      type: 'Short',
      quantity: 40,
      entryPrice: 875.25,
      exitPrice: 882.10,
      pnl: -274,
      status: 'Closed',
      source: 'Manual'
    }
  ];

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = (event) => {
      setCurrency(event?.detail?.currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    
    // Get initial currency from localStorage
    const savedCurrency = localStorage.getItem('tradescope-currency') || 'USD';
    setCurrency(savedCurrency);

    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  const formatCurrency = (value) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const convertedValue = currency === 'INR' ? value * 83 : value;
    return `${symbol}${convertedValue?.toLocaleString()}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSourceBadge = (source) => {
    const isAPI = source?.includes('API');
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isAPI 
          ? 'bg-accent/10 text-accent' :'bg-secondary/10 text-secondary'
      }`}>
        <Icon 
          name={isAPI ? 'Zap' : 'Edit'} 
          size={12} 
          className="mr-1" 
        />
        {source}
      </span>
    );
  };

  const getPnLDisplay = (pnl) => {
    const isProfit = pnl >= 0;
    return (
      <span className={`font-semibold ${isProfit ? 'text-success' : 'text-destructive'}`}>
        {isProfit ? '+' : ''}{formatCurrency(pnl)}
      </span>
    );
  };

  const handleEditTrade = (tradeId) => {
    console.log('Edit trade:', tradeId);
    // Navigate to trade edit page
  };

  const handleViewDetails = (tradeId) => {
    console.log('View trade details:', tradeId);
    // Navigate to trade details page
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Icon name="List" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
            <p className="text-sm text-muted-foreground">Latest trading activity</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/trade-management'}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Instrument</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Type</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">P&L</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Source</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentTrades?.map((trade) => (
              <tr key={trade?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-2">
                  <div className="text-sm font-medium text-foreground">
                    {formatDate(trade?.date)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trade?.time}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm font-medium text-foreground">
                    {trade?.instrument}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Qty: {trade?.quantity}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    trade?.type === 'Long' ?'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
                  }`}>
                    <Icon 
                      name={trade?.type === 'Long' ? 'TrendingUp' : 'TrendingDown'} 
                      size={12} 
                      className="mr-1" 
                    />
                    {trade?.type}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  {getPnLDisplay(trade?.pnl)}
                </td>
                <td className="py-3 px-2">
                  {getSourceBadge(trade?.source)}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(trade?.id)}
                      className="w-8 h-8"
                      title="View Details"
                    >
                      <Icon name="Eye" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditTrade(trade?.id)}
                      className="w-8 h-8"
                      title="Edit Trade"
                    >
                      <Icon name="Edit2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTradesTable;