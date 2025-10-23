import { supabase } from '../lib/supabase';

// Authentication Service for TradeScope
export class AuthService {
  // Sign up new user
  static async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || '',
            role: userData?.role || 'trader'
          }
        }
      });

      if (error) {
        return { success: false, error: error?.message || 'Sign up failed' };
      }

      return { success: true, data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
        };
      }
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  // Sign in user
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error?.message || 'Sign in failed' };
      }

      return { success: true, data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
        };
      }
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) {
        return { success: false, error: error?.message || 'Sign out failed' };
      }
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession();
      if (error) {
        return { success: false, session: null, error: error?.message };
      }
      return { success: true, session, error: null };
    } catch (error) {
      return { success: false, session: null, error: 'Failed to get session' };
    }
  }

  // Get current user profile
  static async getCurrentUserProfile() {
    try {
      const { data: { user }, error: userError } = await supabase?.auth?.getUser();
      if (userError || !user) {
        return { success: false, profile: null, error: 'User not authenticated' };
      }

      const { data: profile, error: profileError } = await supabase?.from('user_profiles')?.select('*')?.eq('id', user?.id)?.single();

      if (profileError) {
        return { success: false, profile: null, error: profileError?.message };
      }

      return { success: true, profile, error: null };
    } catch (error) {
      return { success: false, profile: null, error: 'Failed to fetch profile' };
    }
  }

  // Update user profile
  static async updateProfile(updates) {
    try {
      const { data: { user }, error: userError } = await supabase?.auth?.getUser();
      if (userError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase?.from('user_profiles')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', user?.id)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message || 'Profile update failed' };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  // Reset password
  static async resetPassword(email) {
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window?.location?.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error?.message || 'Password reset failed' };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  // Update password
  static async updatePassword(newPassword) {
    try {
      const { error } = await supabase?.auth?.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error?.message || 'Password update failed' };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  // OAuth sign in (Google, GitHub, etc.)
  static async signInWithProvider(provider) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window?.location?.origin}/dashboard`
        }
      });

      if (error) {
        return { success: false, error: error?.message || 'OAuth sign in failed' };
      }

      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }
}

export default AuthService;