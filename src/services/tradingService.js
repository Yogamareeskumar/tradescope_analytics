import { supabase } from '../lib/supabase';
import UpstoxService from './upstoxService';
import BrokerCredentialService from './brokerCredentialService';

// Trading Service for TradeScope
export class TradingService {
  // Get user's trading accounts
  static async getTradingAccounts() {
    try {
      const { data, error } = await supabase?.from('trading_accounts')?.select(`
          *,
          brokers (
            name,
            status
          )
        `)?.eq('is_active', true)?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, data: [], error: error?.message };
      }

      return { success: true, data: data || [], error: null };
    } catch (error) {
      return { success: false, data: [], error: 'Failed to fetch trading accounts' };
    }
  }

  // Get user's trades with filtering and pagination
  static async getTrades(filters = {}) {
    try {
      let query = supabase?.from('trades')?.select(`
          *,
          trading_accounts (
            account_name,
            brokers (
              name
            )
          )
        `);

      // Apply filters
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }
      
      if (filters?.symbol) {
        query = query?.ilike('symbol', `%${filters?.symbol}%`);
      }
      
      if (filters?.dateFrom) {
        query = query?.gte('opened_at', filters?.dateFrom);
      }
      
      if (filters?.dateTo) {
        query = query?.lte('opened_at', filters?.dateTo);
      }

      // Pagination
      const limit = filters?.limit || 50;
      const offset = filters?.offset || 0;
      query = query?.range(offset, offset + limit - 1);

      // Ordering
      query = query?.order('opened_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return { success: false, data: [], error: error?.message };
      }

      return { success: true, data: data || [], error: null };
    } catch (error) {
      return { success: false, data: [], error: 'Failed to fetch trades' };
    }
  }

  // Create new trade
  static async createTrade(tradeData) {
    try {
      // Get current user and session for proper authentication
      const { data: { user }, error: userError } = await supabase?.auth?.getUser();
      
      if (userError || !user) {
        console.error('Authentication error:', userError);
        return { success: false, data: null, error: 'User not authenticated' };
      }

      // Ensure userId is properly formatted as text for RLS policy matching
      const userId = user?.id?.toString();
      
      if (!userId) {
        return { success: false, data: null, error: 'Invalid user ID' };
      }

      // Validate required fields
      if (!tradeData?.instrument || !tradeData?.quantity || !tradeData?.entryPrice) {
        return { success: false, data: null, error: 'Missing required trade data' };
      }

      const { data, error } = await supabase?.from('trades')?.insert({
          instrument: tradeData?.instrument?.toString(),
          tradeType: tradeData?.tradeType?.toString(),
          quantity: parseInt(tradeData?.quantity),
          entryPrice: parseFloat(tradeData?.entryPrice),
          exitPrice: tradeData?.exitPrice ? parseFloat(tradeData?.exitPrice) : null,
          tradeDate: tradeData?.tradeDate || new Date()?.toISOString(),
          strategy: tradeData?.strategy || null,
          notes: tradeData?.notes || null,
          process: tradeData?.process || 'manual',
          pnl: tradeData?.pnl || 0,
          pnlCurrency: tradeData?.pnlCurrency || 'INR',
          userId: userId // Properly formatted user ID as text
        })?.select()?.single();

      if (error) {
        console.error('Database insert error:', error);
        return { success: false, data: null, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('Trade creation error:', error);
      return { success: false, data: null, error: 'Failed to create trade' };
    }
  }

  // Update trade
  static async updateTrade(tradeId, updates) {
    try {
      const { data, error } = await supabase?.from('trades')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', tradeId)?.select()?.single();

      if (error) {
        return { success: false, data: null, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to update trade' };
    }
  }

  // Close trade
  static async closeTrade(tradeId, exitPrice, closedAt = new Date()) {
    try {
      const { data, error } = await supabase?.from('trades')?.update({
          exit_price: exitPrice,
          status: 'closed',
          closed_at: closedAt?.toISOString(),
          updated_at: new Date()?.toISOString()
        })?.eq('id', tradeId)?.select()?.single();

      if (error) {
        return { success: false, data: null, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to close trade' };
    }
  }

  // Delete trade
  static async deleteTrade(tradeId) {
    try {
      const { error } = await supabase?.from('trades')?.delete()?.eq('id', tradeId);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to delete trade' };
    }
  }

  // Get portfolio summary
  static async getPortfolioSummary() {
    try {
      const { data: portfolios, error: portfolioError } = await supabase?.from('portfolios')?.select('*')?.order('created_at', { ascending: false });

      if (portfolioError) {
        return { success: false, data: null, error: portfolioError?.message };
      }

      // Get total account balance
      const { data: accounts, error: accountError } = await supabase?.from('trading_accounts')?.select('balance, currency')?.eq('is_active', true);

      if (accountError) {
        return { success: false, data: null, error: accountError?.message };
      }

      // Calculate totals
      const totalBalance = accounts?.reduce((sum, account) => sum + (parseFloat(account?.balance) || 0), 0) || 0;
      const totalPnL = portfolios?.reduce((sum, portfolio) => sum + (parseFloat(portfolio?.total_pnl) || 0), 0) || 0;
      
      const summary = {
        portfolios: portfolios || [],
        totalBalance,
        totalPnL,
        totalPnLPercentage: totalBalance > 0 ? ((totalPnL / totalBalance) * 100) : 0
      };

      return { success: true, data: summary, error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to fetch portfolio summary' };
    }
  }

  // Get analytics data
  static async getAnalyticsData(filters = {}) {
    try {
      let query = supabase?.from('analytics_data')?.select('*');

      // Apply date filters
      if (filters?.dateFrom) {
        query = query?.gte('date', filters?.dateFrom);
      }
      
      if (filters?.dateTo) {
        query = query?.lte('date', filters?.dateTo);
      }

      query = query?.order('date', { ascending: true });

      const { data, error } = await query;

      if (error) {
        return { success: false, data: [], error: error?.message };
      }

      return { success: true, data: data || [], error: null };
    } catch (error) {
      return { success: false, data: [], error: 'Failed to fetch analytics data' };
    }
  }

  // Get brokers
  static async getBrokers() {
    try {
      const { data, error } = await supabase?.from('brokers')?.select('*')?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, data: [], error: error?.message };
      }

      return { success: true, data: data || [], error: null };
    } catch (error) {
      return { success: false, data: [], error: 'Failed to fetch brokers' };
    }
  }

  // Add new broker
  static async addBroker(brokerData) {
    try {
      // Use the new credential service for secure storage
      const result = await BrokerCredentialService?.storeBrokerCredentials(brokerData);
      
      if (!result?.success) {
        return result;
      }

      // Test the connection after storing credentials
      const testResult = await BrokerCredentialService?.testBrokerConnection(result?.data?.id);
      
      if (testResult?.success) {
        // Update status to active if connection successful
        await BrokerCredentialService?.updateBrokerStatus(result?.data?.id, 'active');
        
        // Create a trading account entry
        await this.createTradingAccountFromBroker(result?.data?.id, brokerData);
      } else {
        // Update status to error if connection failed
        await BrokerCredentialService?.updateBrokerStatus(result?.data?.id, 'error');
      }

      return {
        success: true,
        data: {
          ...result?.data,
          connectionTest: testResult
        },
        error: null
      };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to add broker' };
    }
  }

  // Create trading account from broker connection
  static async createTradingAccountFromBroker(brokerId, brokerData) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase?.from('trading_accounts')?.insert({
          account_name: `${brokerData?.name} Account`,
          account_number: brokerData?.accountId || null,
          broker_id: brokerId,
          balance: 0,
          currency: 'USD',
          is_active: true,
          user_profile_id: user?.user?.id
        })?.select()?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to create trading account' };
    }
  }

  // Enhanced broker synchronization with credential management
  static async syncFromBrokers() {
    try {
      const results = {
        upstox: { success: false, data: null, error: null },
        zerodha: { success: false, data: null, error: null },
        interactive: { success: false, data: null, error: null },
        alpaca: { success: false, data: null, error: null },
        totalImported: 0,
        errors: []
      };

      // Get all active brokers for the user
      const brokersResult = await this.getBrokers();
      if (!brokersResult?.success) {
        return { success: false, data: null, error: 'Failed to get brokers' };
      }

      const activeBrokers = brokersResult?.data?.filter((broker) => broker?.status === 'active');

      // Sync each active broker
      for (const broker of activeBrokers) {
        try {
          let syncResult = { success: false, data: null, error: 'Unsupported broker' };

          switch (broker?.name?.toLowerCase()) {
            case 'upstox':
              const upstoxConnected = await UpstoxService?.isConnected();
              if (upstoxConnected) {
                syncResult = await UpstoxService?.importTradesToDatabase();
              }
              results.upstox = syncResult;
              break;

            case 'zerodha kite': case'zerodha':
              syncResult = await this.syncZerodhaData(broker?.id);
              results.zerodha = syncResult;
              break;

            case 'interactive brokers':
              syncResult = await this.syncInteractiveBrokersData(broker?.id);
              results.interactive = syncResult;
              break;

            case 'alpaca markets': case'alpaca':
              syncResult = await this.syncAlpacaData(broker?.id);
              results.alpaca = syncResult;
              break;
          }

          if (syncResult?.success) {
            results.totalImported += syncResult?.data?.importedCount || 0;
          } else {
            results?.errors?.push(`${broker?.name}: ${syncResult?.error}`);
          }
        } catch (error) {
          results?.errors?.push(`${broker?.name}: ${error?.message}`);
        }
      }

      // Update broker sync timestamps
      await supabase?.from('brokers')?.update({ last_sync_at: new Date()?.toISOString() })?.eq('status', 'active');

      return {
        success: results?.totalImported > 0 || results?.errors?.length === 0,
        data: {
          totalImported: results?.totalImported,
          brokerResults: results
        },
        error: results?.errors?.length > 0 ? results?.errors?.join('; ') : null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Failed to sync broker data'
      };
    }
  }

  // Sync Zerodha data using stored credentials
  static async syncZerodhaData(brokerId) {
    try {
      const credentialsResult = await BrokerCredentialService?.getBrokerCredentials(brokerId);
      if (!credentialsResult?.success) {
        return credentialsResult;
      }

      const { credentials } = credentialsResult?.data;
      
      // Implement Zerodha KiteConnect API calls
      const response = await fetch('https://api.kite.trade/portfolio/positions', {
        headers: {
          'Authorization': `token ${credentials?.apiKey}:${credentials?.apiSecret}`,
          'X-Kite-Version': '3'
        }
      });

      if (!response?.ok) {
        return { success: false, error: 'Failed to fetch Zerodha data' };
      }

      const data = await response?.json();
      // Process and import Zerodha trades...

      return {
        success: true,
        data: { importedCount: 0 }, // Implement actual import logic
        error: null
      };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to sync Zerodha data' };
    }
  }

  // Sync Interactive Brokers data using stored credentials
  static async syncInteractiveBrokersData(brokerId) {
    try {
      const credentialsResult = await BrokerCredentialService?.getBrokerCredentials(brokerId);
      if (!credentialsResult?.success) {
        return credentialsResult;
      }

      // Implement IB TWS API integration
      return {
        success: true,
        data: { importedCount: 0 }, // Implement actual import logic
        error: null
      };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to sync Interactive Brokers data' };
    }
  }

  // Sync Alpaca data using stored credentials
  static async syncAlpacaData(brokerId) {
    try {
      const credentialsResult = await BrokerCredentialService?.getBrokerCredentials(brokerId);
      if (!credentialsResult?.success) {
        return credentialsResult;
      }

      const { credentials } = credentialsResult?.data;
      
      // Implement Alpaca API calls
      const response = await fetch('https://paper-api.alpaca.markets/v2/positions', {
        headers: {
          'APCA-API-KEY-ID': credentials?.apiKey,
          'APCA-API-SECRET-KEY': credentials?.apiSecret
        }
      });

      if (!response?.ok) {
        return { success: false, error: 'Failed to fetch Alpaca data' };
      }

      const data = await response?.json();
      // Process and import Alpaca trades...

      return {
        success: true,
        data: { importedCount: 0 }, // Implement actual import logic
        error: null
      };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to sync Alpaca data' };
    }
  }

  // Enhanced broker connection status with credential testing
  static async getBrokerStatus() {
    try {
      const statuses = {};

      // Check Upstox connection
      const upstoxStatus = await UpstoxService?.getConnectionStatus();
      statuses.upstox = {
        name: 'Upstox',
        connected: upstoxStatus?.connected,
        lastSync: upstoxStatus?.lastSync,
        status: upstoxStatus?.connected ? 'active' : 'inactive',
        error: upstoxStatus?.error
      };

      // Get all brokers and test their connections
      const brokersResult = await this.getBrokers();
      if (brokersResult?.success) {
        for (const broker of brokersResult?.data) {
          const testResult = await BrokerCredentialService?.testBrokerConnection(broker?.id);
          
          statuses[broker?.name?.toLowerCase()?.replace(/\s+/g, '_')] = {
            name: broker?.name,
            connected: testResult?.success,
            lastSync: broker?.last_sync_at,
            status: broker?.status,
            error: testResult?.error
          };
        }
      }

      return { success: true, data: statuses, error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to get broker status' };
    }
  }

  // Get strategies
  static async getStrategies() {
    try {
      const { data, error } = await supabase?.from('strategies')?.select('*')?.eq('is_active', true)?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, data: [], error: error?.message };
      }

      return { success: true, data: data || [], error: null };
    } catch (error) {
      return { success: false, data: [], error: 'Failed to fetch strategies' };
    }
  }

  // Real-time trades subscription
  static subscribeToTrades(callback) {
    return supabase?.channel('trades_changes')?.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trades' }, 
        callback
      )?.subscribe();
  }

  // Real-time analytics subscription
  static subscribeToAnalytics(callback) {
    return supabase?.channel('analytics_changes')?.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'analytics_data' }, 
        callback
      )?.subscribe();
  }

  // Unsubscribe from real-time updates
  static unsubscribe(channel) {
    return supabase?.removeChannel(channel);
  }
}

export default TradingService;