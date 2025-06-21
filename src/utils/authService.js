// src/utils/authService.js
import supabase from './supabase';

class AuthService {
  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error getting session:', jsError);
      return { success: false, error: 'Failed to get session' };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error signing in:', jsError);
      return { success: false, error: 'Failed to sign in' };
    }
  }

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
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
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error signing up:', jsError);
      return { success: false, error: 'Failed to sign up' };
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
      return { success: false, error: 'Failed to sign out' };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (jsError) {
      console.log('JS error resetting password:', jsError);
      return { success: false, error: 'Failed to reset password' };
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
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
      return { success: false, error: 'Failed to get user profile' };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
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
      return { success: false, error: 'Failed to update user profile' };
    }
  }

  // Get user permissions
  async getUserPermissions(userId) {
    try {
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
      return { success: false, error: 'Failed to get user permissions' };
    }
  }

  // Check if user has specific permission
  async hasPermission(permission) {
    try {
      const { data, error } = await supabase.rpc('has_permission', {
        permission_name: permission
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error checking permission:', jsError);
      return { success: false, error: 'Failed to check permission' };
    }
  }

  // Grant permission to user
  async grantPermission(userId, permission, grantedBy, expiresAt = null) {
    try {
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
      return { success: false, error: 'Failed to grant permission' };
    }
  }

  // Revoke permission from user
  async revokePermission(userId, permission) {
    try {
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
      return { success: false, error: 'Failed to revoke permission' };
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export default new AuthService();