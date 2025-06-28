// src/utils/authService.js
import supabase from './supabase';
import { testSupabaseConnection } from './supabase';

class AuthService {
  // Enhanced debugging mode
  constructor() {
    this.debugMode = import.meta.env.MODE === 'development';
  }

  // Enhanced logging for debugging
  _debugLog(operation, data, error = null) {
    if (this.debugMode) {
      console.group(`🔐 AuthService: ${operation}`);
      if (data) console.log('Data:', data);
      if (error) console.error('Error:', error);
      console.groupEnd();
    }
  }

  // Helper method to handle network errors
  _handleNetworkError(error, operation) {
    console.error(`Network error during ${operation}:`, error);
    
    // Check for specific network error types
    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
      return {
        success: false,
        error: 'Unable to connect to authentication service. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
        details: 'This could be due to network issues, firewall restrictions, or the authentication service being temporarily unavailable.'
      };
    }
    
    if (error.message.includes('timeout') || error.message.includes('Connection timeout')) {
      return {
        success: false,
        error: 'Connection timeout. The authentication service is taking too long to respond.',
        code: 'TIMEOUT_ERROR',
        details: 'Try again in a few moments. If the problem persists, contact support.'
      };
    }
    
    if (error.message.includes('CORS')) {
      return {
        success: false,
        error: 'Configuration error. Please contact support if this persists.',
        code: 'CORS_ERROR',
        details: 'This appears to be a cross-origin resource sharing (CORS) configuration issue.'
      };
    }

    if (error.message.includes('No internet connection')) {
      return {
        success: false,
        error: 'No internet connection detected. Please check your connection and try again.',
        code: 'OFFLINE_ERROR',
        details: 'Make sure you are connected to the internet before attempting to sign in.'
      };
    }
    
    return {
      success: false,
      error: error.message || `Failed to ${operation}`,
      code: 'UNKNOWN_ERROR',
      details: 'An unexpected error occurred. Please try again or contact support if the problem persists.'
    };
  }

  // Test connection before performing operations with enhanced retry logic
  async _ensureConnection() {
    const connectionTest = await testSupabaseConnection(2); // Try twice
    if (!connectionTest.success) {
      const error = new Error(connectionTest.error || 'Unable to connect to authentication service');
      error.suggestion = connectionTest.suggestion;
      error.code = 'CONNECTION_FAILED';
      throw error;
    }
  }

  // Enhanced debug function for user credentials
  async debugUserCredentials(email) {
    if (!this.debugMode) {
      return { success: false, error: 'Debug mode not enabled' };
    }

    try {
      this._debugLog('Debug User Credentials', { email });
      
      // Check if user exists in auth.users
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email, email_confirmed_at, created_at')
        .eq('email', email);

      if (authError) {
        this._debugLog('Auth Users Query Error', null, authError);
      }

      // Check user profile
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email);

      if (profileError) {
        this._debugLog('User Profiles Query Error', null, profileError);
      }

      // Use debug function from database
      const { data: debugInfo, error: debugError } = await supabase
        .rpc('debug_user_status', { user_email: email });

      if (debugError) {
        this._debugLog('Debug Function Error', null, debugError);
      }

      const debugResult = {
        authUsers: authUsers || [],
        profiles: profiles || [],
        debugInfo: debugInfo || [],
        errors: {
          authError: authError?.message,
          profileError: profileError?.message,
          debugError: debugError?.message
        }
      };

      this._debugLog('Debug Results', debugResult);
      return { success: true, data: debugResult };
    } catch (error) {
      this._debugLog('Debug Credentials Error', null, error);
      return { success: false, error: error.message };
    }
  }

  // Get current session
  async getSession() {
    try {
      await this._ensureConnection();
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        this._debugLog('Get Session Error', null, error);
        return { success: false, error: error.message };
      }
      this._debugLog('Get Session Success', { hasUser: !!data?.session?.user });
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error getting session:', jsError);
      return this._handleNetworkError(jsError, 'get session');
    }
  }

  // Enhanced sign in with detailed error reporting
  async signIn(email, password) {
    try {
      this._debugLog('Sign In Attempt', { email: email, passwordLength: password?.length });

      // Validate inputs
      if (!email || !password) {
        const error = { 
          success: false, 
          error: 'Email and password are required',
          code: 'VALIDATION_ERROR'
        };
        this._debugLog('Validation Error', error);
        return error;
      }

      // Enhanced connection check with better error handling
      try {
        await this._ensureConnection();
        this._debugLog('Connection Check', { status: 'success' });
      } catch (connectionError) {
        this._debugLog('Connection Error', null, connectionError);
        return this._handleNetworkError(connectionError, 'sign in');
      }

      // Debug user credentials in development mode
      if (this.debugMode) {
        const debugResult = await this.debugUserCredentials(email);
        if (debugResult.success) {
          this._debugLog('User Debug Info', debugResult.data);
        }
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        this._debugLog('Supabase Auth Error', { error: error.message, code: error.status });
        
        // Provide user-friendly error messages
        if (error.message === 'Invalid login credentials') {
          return { 
            success: false, 
            error: 'Invalid email or password. Please check your credentials and try again.',
            code: 'INVALID_CREDENTIALS',
            debug: this.debugMode ? { 
              originalError: error.message,
              suggestion: 'Verify the user exists in the database and credentials are correct'
            } : undefined
          };
        }
        
        if (error.message.includes('Email not confirmed')) {
          return { 
            success: false, 
            error: 'Please check your email and click the confirmation link before signing in.',
            code: 'EMAIL_NOT_CONFIRMED'
          };
        }
        
        // Handle network-related auth errors
        if (error.message.includes('fetch') || error.message.includes('network')) {
          return this._handleNetworkError(error, 'sign in');
        }
        
        return { 
          success: false, 
          error: error.message, 
          code: 'AUTH_ERROR',
          debug: this.debugMode ? { originalError: error } : undefined
        };
      }
      
      this._debugLog('Sign In Success', { 
        userId: data?.user?.id,
        email: data?.user?.email,
        hasSession: !!data?.session
      });

      return { success: true, data };
    } catch (jsError) {
      this._debugLog('JavaScript Error', null, jsError);
      console.log('JS error signing in:', jsError);
      return this._handleNetworkError(jsError, 'sign in');
    }
  }

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      // Validate inputs
      if (!email || !password) {
        return { 
          success: false, 
          error: 'Email and password are required',
          code: 'VALIDATION_ERROR'
        };
      }

      await this._ensureConnection();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || '',
            role: userData.role || 'attendee'
          }
        }
      });
      
      if (error) {
        return { success: false, error: error.message, code: 'AUTH_ERROR' };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error signing up:', jsError);
      return this._handleNetworkError(jsError, 'sign up');
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (jsError) {
      console.log('JS error signing out:', jsError);
      return this._handleNetworkError(jsError, 'sign out');
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      if (!email) {
        return { 
          success: false, 
          error: 'Email is required',
          code: 'VALIDATION_ERROR'
        };
      }

      await this._ensureConnection();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (jsError) {
      console.log('JS error resetting password:', jsError);
      return this._handleNetworkError(jsError, 'reset password');
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      await this._ensureConnection();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error getting user profile:', jsError);
      return this._handleNetworkError(jsError, 'get user profile');
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      await this._ensureConnection();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error updating user profile:', jsError);
      return this._handleNetworkError(jsError, 'update user profile');
    }
  }

  // Get user permissions
  async getUserPermissions(userId) {
    try {
      await this._ensureConnection();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          role,
          role_permissions!inner(permission),
          user_permissions(permission, granted, expires_at)
        `)
        .eq('id', userId)
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      // Combine role and user permissions
      const rolePermissions = data.role_permissions?.map(rp => rp.permission) || [];
      const userPermissions = data.user_permissions?.filter(up => 
        up.granted && (!up.expires_at || new Date(up.expires_at) > new Date())
      ).map(up => up.permission) || [];
      
      const allPermissions = [...new Set([...rolePermissions, ...userPermissions])];
      
      return { 
        success: true, 
        data: {
          role: data.role,
          permissions: allPermissions
        }
      };
    } catch (jsError) {
      console.log('JS error getting user permissions:', jsError);
      return this._handleNetworkError(jsError, 'get user permissions');
    }
  }

  // Check if user has specific permission
  async hasPermission(permission) {
    try {
      await this._ensureConnection();
      
      const { data, error } = await supabase.rpc('has_permission', {
        permission_name: permission
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error checking permission:', jsError);
      return this._handleNetworkError(jsError, 'check permission');
    }
  }

  // Grant permission to user
  async grantPermission(userId, permission, grantedBy, expiresAt = null) {
    try {
      await this._ensureConnection();
      
      const { data, error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          permission,
          granted: true,
          granted_by: grantedBy,
          expires_at: expiresAt
        })
        .select()
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error granting permission:', jsError);
      return this._handleNetworkError(jsError, 'grant permission');
    }
  }

  // Revoke permission from user
  async revokePermission(userId, permission) {
    try {
      await this._ensureConnection();
      
      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId)
        .eq('permission', permission);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (jsError) {
      console.log('JS error revoking permission:', jsError);
      return this._handleNetworkError(jsError, 'revoke permission');
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export default new AuthService();