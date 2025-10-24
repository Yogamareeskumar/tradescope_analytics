import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddTradeModal = ({ isOpen, onClose, onAddTrade, accounts }) => {
  const [formData, setFormData] = useState({
    instrument: '',
    assetClass: '',
    type: 'BUY',
    quantity: '',
    entryPrice: '',
    exitPrice: '',
    entryDate: '',
    exitDate: '',
    strategy: '',
    notes: '',
    currency: 'USD'
  });

  const [errors, setErrors] = useState({});

  const assetClassOptions = [
    { value: '', label: 'Select Asset Class' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'forex', label: 'Forex' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'indices', label: 'Indices' }
  ];

  const typeOptions = [
    { value: 'BUY', label: 'Buy' },
    { value: 'SELL', label: 'Sell' }
  ];

  const strategyOptions = [
    { value: '', label: 'Select Strategy (Optional)' },
    { value: 'scalping', label: 'Scalping' },
    { value: 'day-trading', label: 'Day Trading' },
    { value: 'swing-trading', label: 'Swing Trading' },
    { value: 'position-trading', label: 'Position Trading' },
    { value: 'momentum', label: 'Momentum' },
    { value: 'mean-reversion', label: 'Mean Reversion' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'INR', label: 'INR (₹)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.instrument?.trim()) {
      newErrors.instrument = 'Instrument name is required';
    }

    if (!formData?.assetClass) {
      newErrors.assetClass = 'Asset class is required';
    }

    if (!formData?.quantity || parseFloat(formData?.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData?.entryPrice || parseFloat(formData?.entryPrice) <= 0) {
      newErrors.entryPrice = 'Valid entry price is required';
    }

    if (!formData?.entryDate) {
      newErrors.entryDate = 'Entry date is required';
    }

    if (formData?.exitPrice && parseFloat(formData?.exitPrice) <= 0) {
      newErrors.exitPrice = 'Exit price must be greater than 0';
    }

    if (formData?.exitDate && formData?.entryDate && new Date(formData.exitDate) < new Date(formData.entryDate)) {
      newErrors.exitDate = 'Exit date cannot be before entry date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const calculatePnL = () => {
    const quantity = parseFloat(formData?.quantity) || 0;
    const entryPrice = parseFloat(formData?.entryPrice) || 0;
    const exitPrice = parseFloat(formData?.exitPrice) || 0;

    if (quantity && entryPrice && exitPrice) {
      const multiplier = formData?.type === 'BUY' ? 1 : -1;
      return multiplier * quantity * (exitPrice - entryPrice);
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Enhanced trade data with proper validation
    const tradeData = {
      instrument: formData?.instrument?.trim(),
      tradeType: formData?.type,
      quantity: parseFloat(formData?.quantity),
      entryPrice: parseFloat(formData?.entryPrice),
      exitPrice: formData?.exitPrice ? parseFloat(formData?.exitPrice) : null,
      tradeDate: formData?.entryDate,
      strategy: formData?.strategy || null,
      notes: formData?.notes?.trim() || null,
      process: 'manual',
      pnl: calculatePnL(),
      pnlCurrency: formData?.currency
    };

    // Validate data before submission
    if (tradeData?.quantity <= 0 || tradeData?.entryPrice <= 0) {
      console.error('Invalid trade data: quantity or entry price');
      return;
    }

    onAddTrade(tradeData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      instrument: '',
      assetClass: '',
      type: 'BUY',
      quantity: '',
      entryPrice: '',
      exitPrice: '',
      entryDate: '',
      exitDate: '',
      strategy: '',
      notes: '',
      currency: 'USD'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const pnl = calculatePnL();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Add New Trade</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Instrument Name"
                type="text"
                placeholder="e.g., AAPL, EURUSD, BTC"
                value={formData?.instrument}
                onChange={(e) => handleInputChange('instrument', e?.target?.value)}
                error={errors?.instrument}
                required
              />

              <Select
                label="Asset Class"
                options={assetClassOptions}
                value={formData?.assetClass}
                onChange={(value) => handleInputChange('assetClass', value)}
                error={errors?.assetClass}
                required
              />

              <Select
                label="Trade Type"
                options={typeOptions}
                value={formData?.type}
                onChange={(value) => handleInputChange('type', value)}
              />

              <Select
                label="Currency"
                options={currencyOptions}
                value={formData?.currency}
                onChange={(value) => handleInputChange('currency', value)}
              />
            </div>
          </div>

          {/* Trade Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Trade Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Quantity"
                type="number"
                placeholder="Number of shares/units"
                value={formData?.quantity}
                onChange={(e) => handleInputChange('quantity', e?.target?.value)}
                error={errors?.quantity}
                required
                min="0"
                step="0.01"
              />

              <Input
                label="Entry Price"
                type="number"
                placeholder="Price per unit"
                value={formData?.entryPrice}
                onChange={(e) => handleInputChange('entryPrice', e?.target?.value)}
                error={errors?.entryPrice}
                required
                min="0"
                step="0.01"
              />

              <Input
                label="Exit Price (Optional)"
                type="number"
                placeholder="Price per unit"
                value={formData?.exitPrice}
                onChange={(e) => handleInputChange('exitPrice', e?.target?.value)}
                error={errors?.exitPrice}
                min="0"
                step="0.01"
              />

              <div className="flex items-end">
                <div className="w-full p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Estimated P&L</div>
                  <div className={`text-lg font-semibold ${
                    pnl > 0 ? 'text-success' : pnl < 0 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {pnl > 0 ? '+' : ''}{formData?.currency === 'INR' ? '₹' : '$'}{Math.abs(pnl)?.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Dates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Entry Date"
                type="date"
                value={formData?.entryDate}
                onChange={(e) => handleInputChange('entryDate', e?.target?.value)}
                error={errors?.entryDate}
                required
              />

              <Input
                label="Exit Date (Optional)"
                type="date"
                value={formData?.exitDate}
                onChange={(e) => handleInputChange('exitDate', e?.target?.value)}
                error={errors?.exitDate}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Additional Information</h3>
            
            <Select
              label="Strategy"
              options={strategyOptions}
              value={formData?.strategy}
              onChange={(value) => handleInputChange('strategy', value)}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                placeholder="Add any notes about this trade..."
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="default"
              iconName="Plus"
              iconPosition="left"
            >
              Add Trade
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTradeModal;