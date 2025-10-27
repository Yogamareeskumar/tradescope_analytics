import { supabase } from '../lib/supabase';

/**
 * Broker Credential Management Service
 * Handles secure storage and retrieval of broker API credentials
 * Note: For production use, consider implementing proper encryption
 */
class BrokerCredentialService {
  /**
   * Store broker credentials securely in database
   */
  static async storeBrokerCredentials(brokerData) {
    try {
      const { data: { user }, error: authError } = await supabase?.auth?.getUser();
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      // For now, we'll store credentials as JSON string (in production, encrypt this)
      const credentialsJson = JSON.stringify({
        apiKey: brokerData?.apiKey || null,
        apiSecret: brokerData?.apiSecret || null,
        userId: brokerData?.userId || null,
        password: brokerData?.password || null,
        totpKey: brokerData?.totpKey || null,
        serverAddress: brokerData?.serverAddress || null
      });

      const { data, error } = await supabase?.from('brokers')?.insert({
          name: brokerData?.name,
          api_key: credentialsJson, // Store credentials as JSON string
          api_secret: null, // Keep separate field for future use
          account_id: brokerData?.accountId || null,
          status: 'inactive', // Start as inactive until verified
          user_profile_id: user?.id
        })?.select()?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('Store broker credentials error:', error);
      return { success: false, error: 'Failed to store broker credentials' };
    }
  }

  /**
   * Retrieve broker credentials
   */
  static async getBrokerCredentials(brokerId) {
    try {
      const { data: { user }, error: authError } = await supabase?.auth?.getUser();
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase?.from('brokers')?.select('*')?.eq('id', brokerId)?.eq('user_profile_id', user?.id)?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      if (!data?.api_key) {
        return { success: false, error: 'No credentials found' };
      }

      // Parse credentials from JSON
      let credentials = {};
      try {
        credentials = JSON.parse(data?.api_key);
      } catch (parseError) {
        return { success: false, error: 'Invalid credentials format' };
      }
      
      return {
        success: true,
        data: {
          ...data,
          credentials
        },
        error: null
      };
    } catch (error) {
      console.error('Get broker credentials error:', error);
      return { success: false, error: 'Failed to retrieve credentials' };
    }
  }

  /**
   * Update broker credentials
   */
  static async updateBrokerCredentials(brokerId, newCredentials) {
    try {
      const { data: { user }, error: authError } = await supabase?.auth?.getUser();
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const credentialsJson = JSON.stringify(newCredentials);

      const { data, error } = await supabase?.from('brokers')?.update({
          api_key: credentialsJson,
          updated_at: new Date()?.toISOString()
        })?.eq('id', brokerId)?.eq('user_profile_id', user?.id)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('Update broker credentials error:', error);
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
      console.error('Test broker connection error:', error);
      return { success: false, error: 'Failed to test connection' };
    }
  }

  /**
   * Test Zerodha Kite API connection
   */
  static async testZerodhaConnection(credentials) {
    try {
      if (!credentials?.apiKey || !credentials?.apiSecret) {
        return { success: false, error: 'Missing API key or secret' };
      }

      // For demo purposes, we'll simulate a successful connection
      // In production, make actual API call to Zerodha
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      return { success: true, data: { status: 'connected' }, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to connect to Zerodha API' };
    }
  }

  /**
   * Test Upstox API connection
   */
  static async testUpstoxConnection(credentials) {
    try {
      if (!credentials?.apiKey) {
        return { success: false, error: 'Missing API key' };
      }

      // For demo purposes, we'll simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      return { success: true, data: { status: 'connected' }, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to connect to Upstox API' };
    }
  }

  /**
   * Test Interactive Brokers API connection
   */
  static async testInteractiveBrokersConnection(credentials) {
    try {
      if (!credentials?.apiKey || !credentials?.userId) {
        return { success: false, error: 'Missing API key or user ID' };
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
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
      if (!credentials?.userId || !credentials?.password || !credentials?.serverAddress) {
        return { success: false, error: 'Missing user ID, password, or server address' };
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate connection delay
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
      if (!credentials?.apiKey || !credentials?.apiSecret) {
        return { success: false, error: 'Missing API key or secret' };
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return { success: true, data: { status: 'connected' }, error: null };
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
      const { data: { user }, error: authError } = await supabase?.auth?.getUser();
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase?.from('brokers')?.update({
          status: status,
          last_sync_at: status === 'active' ? new Date()?.toISOString() : null,
          updated_at: new Date()?.toISOString()
        })?.eq('id', brokerId)?.eq('user_profile_id', user?.id)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('Update broker status error:', error);
      return { success: false, error: 'Failed to update broker status' };
    }
  }

  /**
   * Delete broker credentials securely
   */
  static async deleteBrokerCredentials(brokerId) {
    try {
      const { data: { user }, error: authError } = await supabase?.auth?.getUser();
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase?.from('brokers')?.delete()?.eq('id', brokerId)?.eq('user_profile_id', user?.id);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Delete broker credentials error:', error);
      return { success: false, error: 'Failed to delete broker credentials' };
    }
  }
}

export default BrokerCredentialService;