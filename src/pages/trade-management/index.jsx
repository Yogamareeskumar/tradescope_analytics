import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTrading } from '../../hooks/useTrading';
import TradeFilters from './components/TradeFilters';
import TradeTable from './components/TradeTable';
import BulkActions from './components/BulkActions';
import AddTradeModal from './components/AddTradeModal';
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
      const result = await createTrade(tradeData);
      if (result?.success) {
        setShowAddModal(false);
        // Trades list will be automatically updated via the hook
        return { success: true };
      } else {
        return { success: false, error: result?.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to create trade' };
    }
  };

  const handleEditTrade = async (tradeId, updates) => {
    try {
      const result = await updateTrade(tradeId, updates);
      return result;
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
            accounts={accounts || []}
            onClose={() => setShowAddModal(false)}
            onAddTrade={handleAddTrade}
            onSubmit={handleAddTrade}
            loading={loading?.accounts}
          />
        )}
      </main>
    </div>
  );
};

export default TradeManagement;