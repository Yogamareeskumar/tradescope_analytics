import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const CurrencyToggle = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ];

  // Load saved currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('tradescope-currency');
    if (savedCurrency && currencies?.find(c => c?.code === savedCurrency)) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Save currency preference and notify other components
  const handleCurrencyChange = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    localStorage.setItem('tradescope-currency', currencyCode);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('currencyChanged', {
      detail: { currency: currencyCode }
    }));
  };

  const currentCurrency = currencies?.find(c => c?.code === selectedCurrency);
  const otherCurrency = currencies?.find(c => c?.code !== selectedCurrency);

  return (
    <div className="flex items-center">
      <button
        onClick={() => handleCurrencyChange(otherCurrency?.code)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200 group"
        title={`Switch to ${otherCurrency?.name}`}
      >
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-foreground font-mono">
            {currentCurrency?.symbol}
          </span>
          <span className="text-sm font-medium text-foreground">
            {currentCurrency?.code}
          </span>
        </div>
        
        <Icon 
          name="ArrowRightLeft" 
          size={14} 
          className="text-muted-foreground group-hover:text-accent transition-colors duration-200" 
        />
        
        <div className="flex items-center space-x-1 opacity-60">
          <span className="text-sm font-medium text-muted-foreground font-mono">
            {otherCurrency?.symbol}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {otherCurrency?.code}
          </span>
        </div>
      </button>
    </div>
  );
};

export default CurrencyToggle;