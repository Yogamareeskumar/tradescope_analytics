import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TradeDetailsModal = ({ isOpen, trade, onClose, onEdit }) => {
  if (!isOpen || !trade) return null;

  const formatCurrency = (amount, currency = 'USD') => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const formatted = Math.abs(amount)?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${symbol}${formatted}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPnLColor = (pnl) => {
    if (pnl > 0) return 'text-success';
    if (pnl < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-primary/10 text-primary';
      case 'closed':
        return 'bg-success/10 text-success';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-secondary/10 text-secondary';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Trade Details</h2>
            <p className="text-sm text-muted-foreground">ID: {trade?.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(trade)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Instrument</label>
                <div className="mt-1">
                  <div className="text-lg font-semibold text-foreground">{trade?.instrument}</div>
                  <div className="text-sm text-muted-foreground">{trade?.assetClass}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Trade Type</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                    trade?.type === 'BUY' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {trade?.type}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                    getStatusColor(trade?.status)
                  }`}>
                    {trade?.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Strategy</label>
                <div className="mt-1 text-foreground">
                  {trade?.strategy || 'No strategy specified'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                <div className="mt-1 text-lg font-semibold text-foreground">
                  {trade?.quantity?.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Entry Price</label>
                <div className="mt-1 text-lg font-semibold text-foreground">
                  {formatCurrency(trade?.entryPrice, trade?.currency)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Exit Price</label>
                <div className="mt-1 text-lg font-semibold text-foreground">
                  {trade?.exitPrice ? formatCurrency(trade?.exitPrice, trade?.currency) : 'Still Open'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">P&L</label>
                <div className="mt-1">
                  <span className={`text-lg font-bold ${getPnLColor(trade?.pnl)}`}>
                    {trade?.pnl > 0 ? '+' : ''}{formatCurrency(trade?.pnl, trade?.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Entry Date</label>
                <div className="mt-1 text-foreground">
                  {formatDate(trade?.entryDate)}
                </div>
              </div>
              
              {trade?.exitDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Exit Date</label>
                  <div className="mt-1 text-foreground">
                    {formatDate(trade?.exitDate)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Details */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Value</label>
                <div className="mt-1 text-foreground">
                  {formatCurrency((trade?.entryPrice * trade?.quantity), trade?.currency)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fees</label>
                <div className="mt-1 text-foreground">
                  {trade?.fees ? formatCurrency(trade?.fees, trade?.currency) : 'N/A'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Net P&L</label>
                <div className="mt-1">
                  <span className={`font-semibold ${getPnLColor(trade?.pnl - (trade?.fees || 0))}`}>
                    {formatCurrency((trade?.pnl - (trade?.fees || 0)), trade?.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {trade?.notes && (
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Notes</h3>
              <div className="bg-muted/30 rounded-lg p-4 text-foreground">
                {trade?.notes}
              </div>
            </div>
          )}

          {/* Source Information */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Trade Source</h3>
            <div className="flex items-center space-x-2">
              <Icon 
                name={trade?.source === 'imported' ? 'Download' : 'Edit'} 
                size={16} 
                className="text-muted-foreground" 
              />
              <span className="text-foreground">
                {trade?.source === 'imported' ? 'Imported from broker' : 'Manually entered'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onEdit?.(trade)} iconName="Edit" iconPosition="left">
            Edit Trade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradeDetailsModal;