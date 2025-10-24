import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TradeTable = ({ trades, onEditTrade, onViewTrade, onDeleteTrade, onBulkAction, selectedTrades, onTradeSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-accent" />
      : <Icon name="ArrowDown" size={16} className="text-accent" />;
  };

  const formatCurrency = (amount, currency = 'USD') => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const formatted = Math.abs(amount)?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${symbol}${formatted}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPnLColor = (pnl) => {
    if (pnl > 0) return 'text-success';
    if (pnl < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getSourceBadge = (source) => {
    const isImported = source === 'imported';
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isImported 
          ? 'bg-accent/10 text-accent' :'bg-secondary/10 text-secondary'
      }`}>
        <Icon 
          name={isImported ? "Download" : "Edit"} 
          size={12} 
          className="mr-1" 
        />
        {isImported ? 'Imported' : 'Manual'}
      </span>
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onTradeSelect(trades?.map(trade => trade?.id));
    } else {
      onTradeSelect([]);
    }
  };

  const isAllSelected = trades?.length > 0 && selectedTrades?.length === trades?.length;
  const isIndeterminate = selectedTrades?.length > 0 && selectedTrades?.length < trades?.length;

  const handleDuplicateTrade = (trade) => {
    // Create a duplicate trade with modified data
    const duplicatedTrade = {
      ...trade,
      id: undefined, // Remove ID to create new trade
      instrument: `${trade?.instrument} (Copy)`,
      tradeDate: new Date()?.toISOString(),
      exitPrice: null,
      pnl: 0,
      status: 'open'
    };
    
    // Call the onEditTrade handler to open form with duplicated data
    onEditTrade(duplicatedTrade, true); // Pass true to indicate it's a duplicate
  };

  const handleAddNote = (trade) => {
    const currentNotes = trade?.notes || '';
    const newNote = prompt('Add a note to this trade:', currentNotes);
    
    if (newNote !== null && newNote !== currentNotes) {
      // Update the trade with new notes
      onEditTrade(trade?.id, { notes: newNote });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('instrument')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Instrument</span>
                  {getSortIcon('instrument')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Date</span>
                  {getSortIcon('date')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Type</span>
                  {getSortIcon('type')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('quantity')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent ml-auto"
                >
                  <span>Quantity</span>
                  {getSortIcon('quantity')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('entryPrice')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent ml-auto"
                >
                  <span>Entry Price</span>
                  {getSortIcon('entryPrice')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('exitPrice')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent ml-auto"
                >
                  <span>Exit Price</span>
                  {getSortIcon('exitPrice')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('pnl')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent ml-auto"
                >
                  <span>P&L</span>
                  {getSortIcon('pnl')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-center">
                <span className="text-sm font-medium text-foreground">Source</span>
              </th>
              
              <th className="px-4 py-3 text-center">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {trades?.map((trade) => (
              <tr key={trade?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedTrades?.includes(trade?.id)}
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        onTradeSelect([...selectedTrades, trade?.id]);
                      } else {
                        onTradeSelect(selectedTrades?.filter(id => id !== trade?.id));
                      }
                    }}
                  />
                </td>
                
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-foreground">{trade?.instrument}</div>
                    <div className="text-sm text-muted-foreground">{trade?.assetClass}</div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm text-foreground">{formatDate(trade?.entryDate)}</div>
                    {trade?.exitDate && (
                      <div className="text-xs text-muted-foreground">{formatDate(trade?.exitDate)}</div>
                    )}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    trade?.type === 'BUY' ?'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
                  }`}>
                    {trade?.type}
                  </span>
                </td>
                
                <td className="px-4 py-3 text-right text-sm text-foreground">
                  {trade?.quantity?.toLocaleString()}
                </td>
                
                <td className="px-4 py-3 text-right text-sm text-foreground">
                  {formatCurrency(trade?.entryPrice, trade?.currency)}
                </td>
                
                <td className="px-4 py-3 text-right text-sm text-foreground">
                  {trade?.exitPrice ? formatCurrency(trade?.exitPrice, trade?.currency) : '-'}
                </td>
                
                <td className="px-4 py-3 text-right">
                  <span className={`text-sm font-medium ${getPnLColor(trade?.pnl)}`}>
                    {trade?.pnl > 0 ? '+' : ''}{formatCurrency(trade?.pnl, trade?.currency)}
                  </span>
                </td>
                
                <td className="px-4 py-3 text-center">
                  {getSourceBadge(trade?.source)}
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewTrade?.(trade)}
                      title="View Trade Details"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditTrade?.(trade)}
                      title="Edit Trade"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicateTrade(trade)}
                      title="Duplicate Trade"
                    >
                      <Icon name="Copy" size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddNote(trade)}
                      title="Add Note"
                    >
                      <Icon name="MessageSquare" size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteTrade?.(trade?.id)}
                      title="Delete Trade"
                      className="text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {trades?.map((trade) => (
          <div key={trade?.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={selectedTrades?.includes(trade?.id)}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      onTradeSelect([...selectedTrades, trade?.id]);
                    } else {
                      onTradeSelect(selectedTrades?.filter(id => id !== trade?.id));
                    }
                  }}
                  className="mt-1"
                />
                
                <div>
                  <div className="font-medium text-foreground">{trade?.instrument}</div>
                  <div className="text-sm text-muted-foreground">{trade?.assetClass}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getSourceBadge(trade?.source)}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  trade?.type === 'BUY' ?'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
                }`}>
                  {trade?.type}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Entry Date</div>
                <div className="text-foreground">{formatDate(trade?.entryDate)}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground">Quantity</div>
                <div className="text-foreground">{trade?.quantity?.toLocaleString()}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground">Entry Price</div>
                <div className="text-foreground">{formatCurrency(trade?.entryPrice, trade?.currency)}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground">P&L</div>
                <div className={`font-medium ${getPnLColor(trade?.pnl)}`}>
                  {trade?.pnl > 0 ? '+' : ''}{formatCurrency(trade?.pnl, trade?.currency)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="text-xs text-muted-foreground">
                ID: {trade?.id}
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewTrade?.(trade)}
                  title="View Details"
                >
                  <Icon name="Eye" size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditTrade?.(trade)}
                  title="Edit Trade"
                >
                  <Icon name="Edit" size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTrade?.(trade?.id)}
                  title="Delete Trade"
                  className="text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {trades?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No trades found</h3>
          <p className="text-muted-foreground mb-4">
            No trades match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default TradeTable;