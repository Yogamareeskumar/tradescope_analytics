import { supabase } from '../lib/supabase';
import axios from 'axios';

/**
 * Upstox API Integration Service for TradeScope
 * Handles authentication, token management, and data fetching from Upstox API
 */
export class UpstoxService {
  static BASE_URL = 'https://api.upstox.com/v2';
  
  // Upstox OAuth Configuration
  static OAUTH_URL = 'https://api.upstox.com/v2/login/authorization/dialog';
  static TOKEN_URL = 'https://api.upstox.com/v2/login/authorization/token';
  
  /**
   * Generate Upstox OAuth URL for user authentication
   */
  static generateAuthUrl(clientId, redirectUri, state) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
      scope: 'NSE|BSE|MCX'
    });
    
    return `${this.OAUTH_URL}?${params?.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code, clientId, clientSecret, redirectUri) {
    try {
      const response = await axios?.post(this.TOKEN_URL, {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });

      const { access_token, refresh_token, expires_in } = response?.data;
      const expiresAt = new Date(Date.now() + expires_in * 1000);

      // Store tokens in Supabase
      const { data: user } = await supabase?.auth?.getUser();
      if (user?.user) {
        await this.storeTokens(user?.user?.id, access_token, refresh_token, expiresAt);
      }

      return {
        success: true,
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt
        },
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.response?.data?.message || 'Failed to exchange code for token'
      };
    }
  }

  /**
   * Store Upstox tokens in database
   */
  static async storeTokens(userId, accessToken, refreshToken, expiresAt) {
    try {
      const { data, error } = await supabase?.from('upstox_tokens')?.upsert({
          userId,
          accessToken,
          refreshToken,
          expiresAt: expiresAt?.toISOString(),
          updatedAt: new Date()?.toISOString()
        }, {
          onConflict: 'userId'
        })?.select()?.single();

      if (error) {
        return { success: false, data: null, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to store tokens' };
    }
  }

  /**
   * Get stored Upstox tokens for current user
   */
  static async getStoredTokens() {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { success: false, data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase?.from('upstox_tokens')?.select('*')?.eq('userId', user?.user?.id)?.single();

      if (error) {
        return { success: false, data: null, error: error?.message };
      }

      // Check if token is expired
      const now = new Date();
      const expiresAt = new Date(data.expiresAt);
      
      if (now >= expiresAt) {
        // Try to refresh token
        const refreshResult = await this.refreshAccessToken(data?.refreshToken);
        if (refreshResult?.success) {
          return { success: true, data: refreshResult?.data, error: null };
        } else {
          return { success: false, data: null, error: 'Token expired and refresh failed' };
        }
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to get stored tokens' };
    }
  }

  /**
   * Refresh expired access token
   */
  static async refreshAccessToken(refreshToken) {
    try {
      const response = await axios?.post(this.TOKEN_URL, {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });

      const { access_token, expires_in } = response?.data;
      const expiresAt = new Date(Date.now() + expires_in * 1000);

      // Update stored tokens
      const { data: user } = await supabase?.auth?.getUser();
      if (user?.user) {
        await this.storeTokens(user?.user?.id, access_token, refreshToken, expiresAt);
      }

      return {
        success: true,
        data: {
          accessToken: access_token,
          refreshToken,
          expiresAt
        },
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.response?.data?.message || 'Failed to refresh token'
      };
    }
  }

  /**
   * Get user's Upstox profile information
   */
  static async getUserProfile() {
    try {
      const tokensResult = await this.getStoredTokens();
      if (!tokensResult?.success) {
        return tokensResult;
      }

      const response = await axios?.get(`${this.BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${tokensResult?.data?.accessToken}`,
          'Accept': 'application/json'
        }
      });

      return {
        success: true,
        data: response?.data?.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.response?.data?.message || 'Failed to get user profile'
      };
    }
  }

  /**
   * Get account positions from Upstox
   */
  static async getPositions() {
    try {
      const tokensResult = await this.getStoredTokens();
      if (!tokensResult?.success) {
        return tokensResult;
      }

      const response = await axios?.get(`${this.BASE_URL}/portfolio/long-term-positions`, {
        headers: {
          'Authorization': `Bearer ${tokensResult?.data?.accessToken}`,
          'Accept': 'application/json'
        }
      });

      return {
        success: true,
        data: response?.data?.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.response?.data?.message || 'Failed to get positions'
      };
    }
  }

  /**
   * Get order history from Upstox
   */
  static async getOrderHistory() {
    try {
      const tokensResult = await this.getStoredTokens();
      if (!tokensResult?.success) {
        return tokensResult;
      }

      const response = await axios?.get(`${this.BASE_URL}/order/retrieve-all`, {
        headers: {
          'Authorization': `Bearer ${tokensResult?.data?.accessToken}`,
          'Accept': 'application/json'
        }
      });

      return {
        success: true,
        data: response?.data?.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.response?.data?.message || 'Failed to get order history'
      };
    }
  }

  /**
   * Get trade book (completed trades) from Upstox
   */
  static async getTradeBook() {
    try {
      const tokensResult = await this.getStoredTokens();
      if (!tokensResult?.success) {
        return tokensResult;
      }

      const response = await axios?.get(`${this.BASE_URL}/order/trades/get-trades-for-day`, {
        headers: {
          'Authorization': `Bearer ${tokensResult?.data?.accessToken}`,
          'Accept': 'application/json'
        }
      });

      return {
        success: true,
        data: response?.data?.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.response?.data?.message || 'Failed to get trade book'
      };
    }
  }

  /**
   * Get account funds information
   */
  static async getFundsAndMargin() {
    try {
      const tokensResult = await this.getStoredTokens();
      if (!tokensResult?.success) {
        return tokensResult;
      }

      const response = await axios?.get(`${this.BASE_URL}/user/get-funds-and-margin`, {
        headers: {
          'Authorization': `Bearer ${tokensResult?.data?.accessToken}`,
          'Accept': 'application/json'
        }
      });

      return {
        success: true,
        data: response?.data?.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error?.response?.data?.message || 'Failed to get funds and margin'
      };
    }
  }

  /**
   * Import trades from Upstox to TradeScope database
   */
  static async importTradesToDatabase() {
    try {
      // Get trades from Upstox
      const tradesResult = await this.getTradeBook();
      if (!tradesResult?.success) {
        return tradesResult;
      }

      const upstoxTrades = tradesResult?.data;
      const importedTrades = [];

      // Get user's Upstox broker configuration
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { success: false, data: null, error: 'User not authenticated' };
      }

      // Find or create Upstox broker entry
      let { data: broker, error: brokerError } = await supabase?.from('brokers')?.select('id')?.eq('name', 'Upstox')?.eq('user_profile_id', user?.user?.id)?.single();

      if (brokerError || !broker) {
        const { data: newBroker, error: createError } = await supabase?.from('brokers')?.insert({
            name: 'Upstox',
            status: 'active',
            user_profile_id: user?.user?.id
          })?.select()?.single();

        if (createError) {
          return { success: false, data: null, error: 'Failed to create broker entry' };
        }
        broker = newBroker;
      }

      // Transform and import trades
      for (const upstoxTrade of upstoxTrades) {
        const tradeData = {
          symbol: upstoxTrade?.trading_symbol,
          trade_type: upstoxTrade?.transaction_type?.toLowerCase() === 'buy' ? 'buy' : 'sell',
          position_side: upstoxTrade?.transaction_type?.toLowerCase() === 'buy' ? 'long' : 'short',
          quantity: parseFloat(upstoxTrade?.quantity),
          entry_price: parseFloat(upstoxTrade?.price),
          exit_price: null,
          status: 'closed',
          opened_at: new Date(upstoxTrade.trade_date)?.toISOString(),
          closed_at: new Date(upstoxTrade.trade_date)?.toISOString(),
          external_id: upstoxTrade?.trade_id,
          broker_id: broker?.id
        };

        const { data: insertedTrade, error: insertError } = await supabase?.from('trades')?.upsert(tradeData, { onConflict: 'external_id' })?.select()?.single();

        if (!insertError) {
          importedTrades?.push(insertedTrade);
        }
      }

      return {
        success: true,
        data: {
          importedCount: importedTrades?.length,
          totalUpstoxTrades: upstoxTrades?.length,
          trades: importedTrades
        },
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Failed to import trades to database'
      };
    }
  }

  /**
   * Disconnect Upstox integration (remove stored tokens)
   */
  static async disconnect() {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase?.from('upstox_tokens')?.delete()?.eq('userId', user?.user?.id);

      if (error) {
        return { success: false, error: error?.message };
      }

      // Update broker status to inactive
      await supabase?.from('brokers')?.update({ status: 'inactive' })?.eq('name', 'Upstox')?.eq('user_profile_id', user?.user?.id);

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to disconnect Upstox' };
    }
  }

  /**
   * Check if user has valid Upstox connection
   */
  static async isConnected() {
    const tokensResult = await this.getStoredTokens();
    return tokensResult?.success;
  }

  /**
   * Get connection status and basic info
   */
  static async getConnectionStatus() {
    try {
      const tokensResult = await this.getStoredTokens();
      if (!tokensResult?.success) {
        return {
          connected: false,
          lastSync: null,
          error: tokensResult?.error
        };
      }

      // Try to get user profile to verify connection is working
      const profileResult = await this.getUserProfile();
      
      return {
        connected: profileResult?.success,
        lastSync: tokensResult?.data?.updatedAt,
        userInfo: profileResult?.success ? profileResult?.data : null,
        error: profileResult?.success ? null : profileResult?.error
      };
    } catch (error) {
      return {
        connected: false,
        lastSync: null,
        error: 'Failed to check connection status'
      };
    }
  }
}

export default UpstoxService;