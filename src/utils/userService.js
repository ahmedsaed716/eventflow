// src/utils/userService.js
import supabase from './supabase';

class UserService {
  // Get all users (admin only)
  async getAllUsers(filters = {}) {
    try {
      let query = supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.role && filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }
      
      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error getting users:', jsError);
      return { success: false, error: 'Failed to get users' };
    }
  }

  // Get user by ID
  async getUserById(userId) {
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
      console.log('JS error getting user by ID:', jsError);
      return { success: false, error: 'Failed to get user' };
    }
  }

  // Update user profile
  async updateUser(userId, updates) {
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
      console.log('JS error updating user:', jsError);
      return { success: false, error: 'Failed to update user' };
    }
  }

  // Toggle user active status
  async toggleUserStatus(userId, isActive) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ is_active: isActive })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error toggling user status:', jsError);
      return { success: false, error: 'Failed to toggle user status' };
    }
  }

  // Get user permissions
  async getUserPermissions(userId) {
    try {
      // Get role permissions
      const { data: roleData, error: roleError } = await supabase
        .from('user_profiles')
        .select(`
          role,
          role_permissions!inner(permission)
        `)
        .eq('id', userId)
        .single();

      if (roleError) {
        return { success: false, error: roleError.message };
      }

      // Get user-specific permissions
      const { data: userPerms, error: userError } = await supabase
        .from('user_permissions')
        .select('permission, granted, expires_at')
        .eq('user_id', userId);

      if (userError) {
        return { success: false, error: userError.message };
      }

      // Combine permissions
      const rolePermissions = roleData.role_permissions?.map(rp => rp.permission) || [];
      const activeUserPermissions = userPerms?.filter(up => 
        up.granted && (!up.expires_at || new Date(up.expires_at) > new Date())
      ).map(up => up.permission) || [];

      const allPermissions = [...new Set([...rolePermissions, ...activeUserPermissions])];

      return { 
        success: true, 
        data: {
          role: roleData.role,
          rolePermissions,
          userPermissions: activeUserPermissions,
          allPermissions
        }
      };
    } catch (jsError) {
      console.log('JS error getting user permissions:', jsError);
      return { success: false, error: 'Failed to get user permissions' };
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
          expires_at: expiresAt,
          granted_at: new Date().toISOString()
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

  // Get users by role
  async getUsersByRole(role) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', role)
        .eq('is_active', true)
        .order('full_name');
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error getting users by role:', jsError);
      return { success: false, error: 'Failed to get users by role' };
    }
  }

  // Change user role
  async changeUserRole(userId, newRole, changedBy) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (jsError) {
      console.log('JS error changing user role:', jsError);
      return { success: false, error: 'Failed to change user role' };
    }
  }
}

export default new UserService();