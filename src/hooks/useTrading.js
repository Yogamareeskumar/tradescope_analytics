import { useState, useEffect, useCallback } from 'react';
import { TradingService } from '../services/tradingService';

// Custom hook for trading operations
export const useTrading = () => {
  const [trades, setTrades] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState({
    trades: false,
    accounts: false,
    brokers: false,
    strategies: false,
    portfolio: false,
    analytics: false
  });
  const [error, setError] = useState(null);

  // Load trading accounts
  const loadAccounts = useCallback(async () => {
    setLoading(prev => ({ ...prev, accounts: true }));
    try {
      const result = await TradingService?.getTradingAccounts();
      if (result?.success) {
        setAccounts(result?.data || []);
        setError(null);
      } else {
        setError(result?.error || 'Failed to load accounts');
      }
    } catch (err) {
      setError('Failed to load trading accounts');
    } finally {
      setLoading(prev => ({ ...prev, accounts: false }));
    }
  }, []);

  // Load trades with filters
  const loadTrades = useCallback(async (filters = {}) => {
    setLoading(prev => ({ ...prev, trades: true }));
    try {
      const result = await TradingService?.getTrades(filters);
      if (result?.success) {
        setTrades(result?.data || []);
        setError(null);
      } else {
        setError(result?.error || 'Failed to load trades');
      }
    } catch (err) {
      setError('Failed to load trades');
    } finally {
      setLoading(prev => ({ ...prev, trades: false }));
    }
  }, []);

  // Create new trade
  const createTrade = useCallback(async (tradeData) => {
    try {
      const result = await TradingService?.createTrade(tradeData);
      if (result?.success) {
        setTrades(prev => [result?.data, ...prev]);
        setError(null);
        return { success: true, data: result?.data };
      } else {
        setError(result?.error || 'Failed to create trade');
        return { success: false, error: result?.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to create trade';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Update trade
  const updateTrade = useCallback(async (tradeId, updates) => {
    try {
      const result = await TradingService?.updateTrade(tradeId, updates);
      if (result?.success) {
        setTrades(prev => 
          prev?.map(trade => 
            trade?.id === tradeId ? { ...trade, ...result?.data } : trade
          )
        );
        setError(null);
        return { success: true, data: result?.data };
      } else {
        setError(result?.error || 'Failed to update trade');
        return { success: false, error: result?.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to update trade';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Close trade
  const closeTrade = useCallback(async (tradeId, exitPrice) => {
    try {
      const result = await TradingService?.closeTrade(tradeId, exitPrice);
      if (result?.success) {
        setTrades(prev => 
          prev?.map(trade => 
            trade?.id === tradeId ? { ...trade, ...result?.data } : trade
          )
        );
        setError(null);
        return { success: true, data: result?.data };
      } else {
        setError(result?.error || 'Failed to close trade');
        return { success: false, error: result?.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to close trade';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Delete trade
  const deleteTrade = useCallback(async (tradeId) => {
    try {
      const result = await TradingService?.deleteTrade(tradeId);
      if (result?.success) {
        setTrades(prev => prev?.filter(trade => trade?.id !== tradeId));
        setError(null);
        return { success: true };
      } else {
        setError(result?.error || 'Failed to delete trade');
        return { success: false, error: result?.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to delete trade';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Load brokers
  const loadBrokers = useCallback(async () => {
    setLoading(prev => ({ ...prev, brokers: true }));
    try {
      const result = await TradingService?.getBrokers();
      if (result?.success) {
        setBrokers(result?.data || []);
        setError(null);
      } else {
        setError(result?.error || 'Failed to load brokers');
      }
    } catch (err) {
      setError('Failed to load brokers');
    } finally {
      setLoading(prev => ({ ...prev, brokers: false }));
    }
  }, []);

  // Add broker
  const addBroker = useCallback(async (brokerData) => {
    try {
      const result = await TradingService?.addBroker(brokerData);
      if (result?.success) {
        setBrokers(prev => [result?.data, ...prev]);
        setError(null);
        return { success: true, data: result?.data };
      } else {
        setError(result?.error || 'Failed to add broker');
        return { success: false, error: result?.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to add broker';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Load strategies
  const loadStrategies = useCallback(async () => {
    setLoading(prev => ({ ...prev, strategies: true }));
    try {
      const result = await TradingService?.getStrategies();
      if (result?.success) {
        setStrategies(result?.data || []);
        setError(null);
      } else {
        setError(result?.error || 'Failed to load strategies');
      }
    } catch (err) {
      setError('Failed to load strategies');
    } finally {
      setLoading(prev => ({ ...prev, strategies: false }));
    }
  }, []);

  // Load portfolio summary
  const loadPortfolio = useCallback(async () => {
    setLoading(prev => ({ ...prev, portfolio: true }));
    try {
      const result = await TradingService?.getPortfolioSummary();
      if (result?.success) {
        setPortfolio(result?.data || null);
        setError(null);
      } else {
        setError(result?.error || 'Failed to load portfolio');
      }
    } catch (err) {
      setError('Failed to load portfolio');
    } finally {
      setLoading(prev => ({ ...prev, portfolio: false }));
    }
  }, []);

  // Load analytics data
  const loadAnalytics = useCallback(async (filters = {}) => {
    setLoading(prev => ({ ...prev, analytics: true }));
    try {
      const result = await TradingService?.getAnalyticsData(filters);
      if (result?.success) {
        setAnalytics(result?.data || []);
        setError(null);
      } else {
        setError(result?.error || 'Failed to load analytics');
      }
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }));
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    let tradesChannel;
    let analyticsChannel;

    // Subscribe to trades changes
    tradesChannel = TradingService?.subscribeToTrades((payload) => {
      if (payload?.eventType === 'INSERT') {
        setTrades(prev => [payload?.new, ...prev]);
      } else if (payload?.eventType === 'UPDATE') {
        setTrades(prev => 
          prev?.map(trade => 
            trade?.id === payload?.new?.id ? payload?.new : trade
          )
        );
      } else if (payload?.eventType === 'DELETE') {
        setTrades(prev => 
          prev?.filter(trade => trade?.id !== payload?.old?.id)
        );
      }
    });

    // Subscribe to analytics changes
    analyticsChannel = TradingService?.subscribeToAnalytics((payload) => {
      if (payload?.eventType === 'INSERT' || payload?.eventType === 'UPDATE') {
        setAnalytics(prev => {
          const existing = prev?.find(item => item?.id === payload?.new?.id);
          if (existing) {
            return prev?.map(item => 
              item?.id === payload?.new?.id ? payload?.new : item
            );
          } else {
            return [...prev, payload?.new];
          }
        });
      }
    });

    // Cleanup subscriptions
    return () => {
      if (tradesChannel) {
        TradingService?.unsubscribe(tradesChannel);
      }
      if (analyticsChannel) {
        TradingService?.unsubscribe(analyticsChannel);
      }
    };
  }, []);

  return {
    // Data
    trades,
    accounts,
    brokers,
    strategies,
    portfolio,
    analytics,
    
    // Loading states
    loading,
    
    // Error state
    error,
    
    // Actions
    loadAccounts,
    loadTrades,
    createTrade,
    updateTrade,
    closeTrade,
    deleteTrade,
    loadBrokers,
    addBroker,
    loadStrategies,
    loadPortfolio,
    loadAnalytics,
    
    // Clear error
    clearError: () => setError(null)
  };
};

export default useTrading;