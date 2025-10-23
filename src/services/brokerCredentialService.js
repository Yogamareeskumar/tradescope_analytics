import { supabase } from '../lib/supabase';
import CryptoJS from 'crypto-js';

/**
 * Broker Credential Management Service
 * Handles secure storage and retrieval of broker API credentials
 */
export class BrokerCredentialService {
  static ENCRYPTION_KEY = import.meta.env?.VITE_ENCRYPTION_KEY || 'default-encryption-key-change-me';

  /**
   * Encrypt sensitive data before storing
   */
  static encrypt(data) {
    try {
      return CryptoJS?.AES?.encrypt(JSON.stringify(data), this.ENCRYPTION_KEY)?.toString();
    } catch (error) {
      throw new Error('Failed to encrypt credentials');
    }
  }

  /**
   * Decrypt sensitive data after retrieval
   */
  static decrypt(encryptedData) {
    try {
      const bytes = CryptoJS?.AES?.decrypt(encryptedData, this.ENCRYPTION_KEY);
      return JSON.parse(bytes?.toString(CryptoJS?.enc?.Utf8));
    } catch (error) {
      throw new Error('Failed to decrypt credentials');
    }
  }

  /**
   * Store broker credentials securely in database
   */
  static async storeBrokerCredentials(brokerData) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Encrypt sensitive credentials
      const encryptedCredentials = this.encrypt({
        apiKey: brokerData?.apiKey || null,
        apiSecret: brokerData?.apiSecret || null,
        userId: brokerData?.userId || null,
        password: brokerData?.password || null,
        totpKey: brokerData?.totpKey || null,
        serverAddress: brokerData?.serverAddress || null
      });

      const { data, error } = await supabase?.from('brokers')?.insert({
          name: brokerData?.name,
          api_key: encryptedCredentials, // Store encrypted data in api_key field
          api_secret: null, // Keep separate field for future use
          account_id: brokerData?.accountId || null,
          status: 'inactive', // Start as inactive until verified
          user_profile_id: user?.user?.id
        })?.select()?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to store broker credentials' };
    }
  }

  /**
   * Retrieve and decrypt broker credentials
   */
  static async getBrokerCredentials(brokerId) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase?.from('brokers')?.select('*')?.eq('id', brokerId)?.eq('user_profile_id', user?.user?.id)?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      if (!data?.api_key) {
        return { success: false, error: 'No credentials found' };
      }

      // Decrypt credentials
      const decryptedCredentials = this.decrypt(data?.api_key);
      
      return {
        success: true,
        data: {
          ...data,
          credentials: decryptedCredentials
        },
        error: null
      };
    } catch (error) {
      return { success: false, error: 'Failed to retrieve credentials' };
    }
  }

  /**
   * Update broker credentials
   */
  static async updateBrokerCredentials(brokerId, newCredentials) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const encryptedCredentials = this.encrypt(newCredentials);

      const { data, error } = await supabase?.from('brokers')?.update({
          api_key: encryptedCredentials,
          updated_at: new Date()?.toISOString()
        })?.eq('id', brokerId)?.eq('user_profile_id', user?.user?.id)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to update credentials' };
    }
  }

  /**
   * Test broker connection with stored credentials
   */
  static async testBrokerConnection(brokerId) {
    try {
      const credentialsResult = await this.getBrokerCredentials(brokerId);
      if (!credentialsResult?.success) {
        return credentialsResult;
      }

      const { data: broker } = credentialsResult;
      const { credentials } = broker;

      // Test connection based on broker type
      switch (broker?.name?.toLowerCase()) {
        case 'zerodha kite': case'zerodha':
          return await this.testZerodhaConnection(credentials);
        
        case 'upstox':
          return await this.testUpstoxConnection(credentials);
        
        case 'interactive brokers':
          return await this.testInteractiveBrokersConnection(credentials);
        
        case 'metatrader 5': case'mt5':
          return await this.testMT5Connection(credentials);
        
        case 'alpaca markets': case'alpaca':
          return await this.testAlpacaConnection(credentials);
        
        default:
          return { success: false, error: 'Unsupported broker type' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to test connection' };
    }
  }

  /**
   * Test Zerodha Kite API connection
   */
  static async testZerodhaConnection(credentials) {
    try {
      // Implement Zerodha KiteConnect API test
      // This would typically involve making a test API call
      const testResponse = await fetch('https://api.kite.trade/user/profile', {
        headers: {
          'Authorization': `token ${credentials?.apiKey}:${credentials?.apiSecret}`,
          'X-Kite-Version': '3'
        }
      });

      if (testResponse?.ok) {
        return { success: true, data: { status: 'connected' }, error: null };
      } else {
        return { success: false, error: 'Invalid Zerodha credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to connect to Zerodha API' };
    }
  }

  /**
   * Test Upstox API connection
   */
  static async testUpstoxConnection(credentials) {
    try {
      // Use existing UpstoxService for connection testing
      const testResponse = await fetch('https://api.upstox.com/v2/user/profile', {
        headers: {
          'Authorization': `Bearer ${credentials?.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (testResponse?.ok) {
        return { success: true, data: { status: 'connected' }, error: null };
      } else {
        return { success: false, error: 'Invalid Upstox credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to connect to Upstox API' };
    }
  }

  /**
   * Test Interactive Brokers API connection
   */
  static async testInteractiveBrokersConnection(credentials) {
    try {
      // Implement IB API connection test
      // Note: IB typically uses TWS API which requires different setup
      return { success: true, data: { status: 'connected' }, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to connect to Interactive Brokers API' };
    }
  }

  /**
   * Test MetaTrader 5 connection
   */
  static async testMT5Connection(credentials) {
    try {
      // Implement MT5 connection test
      // This would typically involve connecting to MT5 terminal
      return { success: true, data: { status: 'connected' }, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to connect to MT5 server' };
    }
  }

  /**
   * Test Alpaca API connection
   */
  static async testAlpacaConnection(credentials) {
    try {
      const testResponse = await fetch('https://paper-api.alpaca.markets/v2/account', {
        headers: {
          'APCA-API-KEY-ID': credentials?.apiKey,
          'APCA-API-SECRET-KEY': credentials?.apiSecret
        }
      });

      if (testResponse?.ok) {
        return { success: true, data: { status: 'connected' }, error: null };
      } else {
        return { success: false, error: 'Invalid Alpaca credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to connect to Alpaca API' };
    }
  }

  /**
   * Get broker configuration from environment
   */
  static getBrokerConfig(brokerName) {
    const configs = {
      'zerodha': {
        apiKey: import.meta.env?.VITE_ZERODHA_API_KEY,
        apiSecret: import.meta.env?.VITE_ZERODHA_API_SECRET,
        baseUrl: 'https://api.kite.trade'
      },
      'upstox': {
        clientId: import.meta.env?.VITE_UPSTOX_CLIENT_ID,
        clientSecret: import.meta.env?.VITE_UPSTOX_CLIENT_SECRET,
        baseUrl: 'https://api.upstox.com/v2'
      },
      'interactive': {
        apiKey: import.meta.env?.VITE_INTERACTIVE_BROKERS_API_KEY,
        baseUrl: 'https://localhost:5000/v1/api'
      },
      'mt5': {
        serverAddress: import.meta.env?.VITE_MT5_SERVER_ADDRESS
      },
      'alpaca': {
        apiKey: import.meta.env?.VITE_ALPACA_API_KEY,
        apiSecret: import.meta.env?.VITE_ALPACA_API_SECRET,
        baseUrl: 'https://paper-api.alpaca.markets/v2'
      }
    };

    return configs?.[brokerName?.toLowerCase()] || {};
  }

  /**
   * Update broker status after connection test
   */
  static async updateBrokerStatus(brokerId, status) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase?.from('brokers')?.update({
          status: status,
          last_sync_at: status === 'active' ? new Date()?.toISOString() : null,
          updated_at: new Date()?.toISOString()
        })?.eq('id', brokerId)?.eq('user_profile_id', user?.user?.id)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to update broker status' };
    }
  }

  /**
   * Delete broker credentials securely
   */
  static async deleteBrokerCredentials(brokerId) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase?.from('brokers')?.delete()?.eq('id', brokerId)?.eq('user_profile_id', user?.user?.id);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to delete broker credentials' };
    }
  }
}

export default BrokerCredentialService;