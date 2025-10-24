import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTrading } from '../../hooks/useTrading';
import TradeFilters from './components/TradeFilters';
import TradeTable from './components/TradeTable';
import BulkActions from './components/BulkActions';
import AddTradeModal from './components/AddTradeModal';
import TradeDetailsModal from './components/TradeDetailsModal';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

const TradeManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    trades,
    accounts,
    loading,
    error,
    loadTrades,
    loadAccounts,
    createTrade,
    updateTrade,
    deleteTrade,
    closeTrade,
    clearError
  } = useTrading();

  const [selectedTrades, setSelectedTrades] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    symbol: '',
    dateFrom: '',
    dateTo: '',
    limit: 50,
    offset: 0
  });

  // Load initial data
  useEffect(() => {
    if (user) {
      loadTrades(filters);
      loadAccounts();
    }
  }, [user, loadTrades, loadAccounts]);

  // Reload trades when filters change
  useEffect(() => {
    if (user) {
      loadTrades(filters);
    }
  }, [filters, user, loadTrades]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
  };

  const handleAddTrade = async (tradeData) => {
    try {
      // Additional client-side authentication check
      if (!user) {
        console.error('Trade creation failed: User not authenticated in component');
        // Remove setError call as it's not available in this scope
        return { success: false, error: 'User not authenticated' };
      }

      const result = await createTrade(tradeData);
      if (result?.success) {
        setShowAddModal(false);
        // Reload trades to show the new trade
        loadTrades(filters);
        return { success: true };
      } else {
        console.error('Trade creation failed:', result?.error);
        // Show user-friendly error message
        const errorMessage = result?.error === 'User not authenticated' ? 'Authentication expired. Please refresh the page and try again.' : result?.error || 'Failed to create trade';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Trade creation error:', error);
      return { success: false, error: 'Failed to create trade' };
    }
  };

  const handleViewTrade = (trade) => {
    setSelectedTrade(trade);
    setShowDetailsModal(true);
  };

  const handleEditTrade = async (tradeOrId, updates) => {
    try {
      // Handle edit from details modal - open AddTradeModal with trade data
      if (typeof tradeOrId === 'object' && !updates) {
        setSelectedTrade(tradeOrId);
        setShowDetailsModal(false);
        setShowAddModal(true);
        return;
      }

      // Handle both direct trade object (for duplicates) and ID + updates
      if (typeof tradeOrId === 'object' && updates === true) {
        // This is a duplicate operation - create new trade
        const duplicateData = {
          instrument: tradeOrId?.instrument,
          tradeType: tradeOrId?.tradeType,
          quantity: tradeOrId?.quantity,
          entryPrice: tradeOrId?.entryPrice,
          tradeDate: new Date()?.toISOString(),
          strategy: tradeOrId?.strategy,
          notes: tradeOrId?.notes,
          process: 'manual'
        };
        return await createTrade(duplicateData);
      } else {
        // Regular update operation
        const result = await updateTrade(tradeOrId, updates);
        if (result?.success) {
          loadTrades(filters); // Reload trades to show updates
        }
        return result;
      }
    } catch (error) {
      return { success: false, error: 'Failed to update trade' };
    }
  };

  const handleCloseTrade = async (tradeId, exitPrice) => {
    try {
      const result = await closeTrade(tradeId, exitPrice);
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to close trade' };
    }
  };

  const handleDeleteTrade = async (tradeId) => {
    try {
      const result = await deleteTrade(tradeId);
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to delete trade' };
    }
  };

  const handleBulkAction = async (action, tradeIds) => {
    try {
      const promises = tradeIds?.map(tradeId => {
        switch (action) {
          case 'delete':
            return deleteTrade(tradeId);
          default:
            return Promise.resolve({ success: true });
        }
      });

      const results = await Promise.all(promises);
      const failedCount = results?.filter(r => !r?.success)?.length;
      
      if (failedCount === 0) {
        setSelectedTrades([]);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: `${failedCount} operations failed` 
        };
      }
    } catch (error) {
      return { success: false, error: 'Bulk operation failed' };
    }
  };

  const handleLoadMore = () => {
    setFilters(prev => ({ 
      ...prev, 
      offset: prev?.offset + prev?.limit 
    }));
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowDetailsModal(false);
    setSelectedTrade(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Trade Management</h1>
            <p className="text-muted-foreground">
              Manage and analyze your trading positions
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0"
            iconName="Plus"
            iconPosition="left"
          >
            Add Trade
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-destructive/60 hover:text-destructive"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <TradeFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            loading={loading?.trades}
            totalTrades={trades?.length || 0}
            filteredTrades={trades?.length || 0}
          />
        </div>

        {/* Bulk Actions */}
        {selectedTrades?.length > 0 && (
          <div className="mb-6">
            <BulkActions
              selectedCount={selectedTrades?.length}
              onBulkAction={handleBulkAction}
              selectedTrades={selectedTrades}
              onClearSelection={() => setSelectedTrades([])}
            />
          </div>
        )}

        {/* Trades Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <TradeTable
            trades={trades || []}
            loading={loading?.trades}
            selectedTrades={selectedTrades}
            onSelectionChange={setSelectedTrades}
            onTradeSelect={setSelectedTrades}
            onViewTrade={handleViewTrade}
            onEditTrade={handleEditTrade}
            onCloseTrade={handleCloseTrade}
            onDeleteTrade={handleDeleteTrade}
            onBulkAction={handleBulkAction}
          />

          {/* Load More */}
          {trades?.length >= filters?.limit && (
            <div className="p-4 border-t border-border text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                loading={loading?.trades}
              >
                Load More
              </Button>
            </div>
          )}
        </div>

        {/* Add Trade Modal */}
        {showAddModal && (
          <AddTradeModal
            isOpen={showAddModal}
            trade={selectedTrade} // Pass selected trade for editing
            accounts={accounts || []}
            onClose={handleCloseModals}
            onAddTrade={handleAddTrade}
            onSubmit={handleAddTrade}
            loading={loading?.accounts}
          />
        )}

        {/* Trade Details Modal */}
        {showDetailsModal && (
          <TradeDetailsModal
            isOpen={showDetailsModal}
            trade={selectedTrade}
            onClose={handleCloseModals}
            onEdit={handleEditTrade}
          />
        )}
      </main>
    </div>
  );
};

export default TradeManagement;