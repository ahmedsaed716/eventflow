// src/pages/user-management/index.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from 'components/AppIcon';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import PermissionModal from './components/PermissionModal';
import FilterToolbar from './components/FilterToolbar';
import userService from '../../utils/userService';


const UserManagement = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await userService.getAllUsers(filters);
      
      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError(result.error || 'Failed to load users');
      }
    } catch (err) {
      setError('Something went wrong loading users');
      console.log('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  // Handle user actions
  const handleUserAction = async (userId, action, data = {}) => {
    try {
      let result;
      
      switch (action) {
        case 'edit':
          setSelectedUser(users.find(u => u.id === userId));
          setShowUserModal(true);
          break;
          
        case 'permissions':
          setSelectedUser(users.find(u => u.id === userId));
          setShowPermissionModal(true);
          break;
          
        case 'toggle-status':
          result = await userService.toggleUserStatus(userId, !users.find(u => u.id === userId)?.is_active);
          if (result.success) {
            await loadUsers();
          } else {
            setError(result.error || 'Failed to update user status');
          }
          break;
          
        case 'change-role':
          result = await userService.changeUserRole(userId, data.role, userProfile?.id);
          if (result.success) {
            await loadUsers();
          } else {
            setError(result.error || 'Failed to change user role');
          }
          break;
          
        default:
          console.log('Unknown action:', action);
      }
    } catch (err) {
      setError('Something went wrong performing the action');
      console.log('Error performing user action:', err);
    }
  };

  // Handle user update
  const handleUserUpdate = async (userData) => {
    try {
      const result = await userService.updateUser(selectedUser.id, userData);
      
      if (result.success) {
        await loadUsers();
        setShowUserModal(false);
        setSelectedUser(null);
      } else {
        setError(result.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Something went wrong updating user');
      console.log('Error updating user:', err);
    }
  };

  // Handle permission update
  const handlePermissionUpdate = async (permissions) => {
    try {
      // Implementation for updating permissions would go here
      // This would involve calling userService.grantPermission/revokePermission
      console.log('Updating permissions:', permissions);
      setShowPermissionModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Something went wrong updating permissions');
      console.log('Error updating permissions:', err);
    }
  };

  // Check if current user can manage users
  const canManageUsers = userProfile?.role === 'admin' || userProfile?.role === 'manager';

  if (!canManageUsers) {
    return (
      <div className="min-h-screen bg-background pt-16 lg:pl-64">
        <div className="p-6">
          <div className="text-center py-12">
            <Icon name="Shield" size={48} className="mx-auto text-text-muted mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h2>
            <p className="text-text-secondary">
              You do not have permission to access user management.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 lg:pl-64">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                User Management
              </h1>
              <p className="text-text-secondary">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={loadUsers}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-text-secondary rounded-lg hover:bg-secondary-200 transition-colors duration-200"
              >
                <Icon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setShowUserModal(true);
                }}
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Icon name="UserPlus" size={16} />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={16} className="text-error mr-2" />
              <span className="text-sm text-error">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-error hover:text-error-600"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-surface rounded-xl shadow-sm border border-border">
          {/* Filter Toolbar */}
          <div className="p-6 border-b border-border">
            <FilterToolbar
              filters={filters}
              onFiltersChange={setFilters}
              userCount={users.length}
            />
          </div>

          {/* Users Table */}
          <div className="overflow-hidden">
            <UserTable
              users={users}
              loading={loading}
              onUserAction={handleUserAction}
              currentUserId={userProfile?.id}
            />
          </div>
        </div>

        {/* User Modal */}
        {showUserModal && (
          <UserModal
            user={selectedUser}
            onClose={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
            onSave={handleUserUpdate}
          />
        )}

        {/* Permission Modal */}
        {showPermissionModal && (
          <PermissionModal
            user={selectedUser}
            onClose={() => {
              setShowPermissionModal(false);
              setSelectedUser(null);
            }}
            onSave={handlePermissionUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;