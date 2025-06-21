// src/pages/user-management/components/PermissionModal.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import userService from '../../../utils/userService';

const PermissionModal = ({ user, onClose, onSave }) => {
  const [permissions, setPermissions] = useState({
    rolePermissions: [],
    userPermissions: [],
    allPermissions: []
  });
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const availablePermissions = [
    {
      id: 'create_events',
      name: 'Create Events',
      description: 'Can create new events',
      category: 'Events'
    },
    {
      id: 'edit_events',
      name: 'Edit Events',
      description: 'Can modify existing events',
      category: 'Events'
    },
    {
      id: 'delete_events',
      name: 'Delete Events',
      description: 'Can delete events',
      category: 'Events'
    },
    {
      id: 'manage_users',
      name: 'Manage Users',
      description: 'Can manage user accounts',
      category: 'Users'
    },
    {
      id: 'manage_permissions',
      name: 'Manage Permissions',
      description: 'Can grant/revoke permissions',
      category: 'Users'
    },
    {
      id: 'view_analytics',
      name: 'View Analytics',
      description: 'Can access analytics and reports',
      category: 'Analytics'
    },
    {
      id: 'check_in_attendees',
      name: 'Check-in Attendees',
      description: 'Can check-in event attendees',
      category: 'Events'
    },
    {
      id: 'export_data',
      name: 'Export Data',
      description: 'Can export system data',
      category: 'Data'
    },
    {
      id: 'send_notifications',
      name: 'Send Notifications',
      description: 'Can send notifications to users',
      category: 'Communication'
    }
  ];

  // Load user permissions
  useEffect(() => {
    const loadPermissions = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError('');
        
        const result = await userService.getUserPermissions(user.id);
        
        if (result.success) {
          setPermissions(result.data);
          setSelectedPermissions(new Set(result.data.allPermissions));
        } else {
          setError(result.error || 'Failed to load permissions');
        }
      } catch (err) {
        setError('Something went wrong loading permissions');
        console.log('Error loading permissions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [user?.id]);

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Implementation would involve granting/revoking individual permissions
      // This is a simplified version - in practice, you'd compare current vs selected
      // and make appropriate API calls to grant/revoke permissions
      
      await onSave?.(Array.from(selectedPermissions));
    } catch (err) {
      setError('Something went wrong saving permissions');
      console.log('Error saving permissions:', err);
    } finally {
      setSaving(false);
    }
  };

  const getPermissionSource = (permissionId) => {
    if (permissions.rolePermissions.includes(permissionId)) {
      return { type: 'role', label: `From ${user?.role} role` };
    }
    if (permissions.userPermissions.includes(permissionId)) {
      return { type: 'user', label: 'Custom permission' };
    }
    return null;
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="relative bg-surface rounded-2xl p-8 max-w-2xl w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading permissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-surface rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Manage Permissions - {user?.full_name}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Control what {user?.full_name} can do in the system
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} className="text-text-muted" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh]">
            <div className="p-6">
              {/* User Role Info */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Shield" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary-700">
                    Current Role: {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-primary-600">
                  Role permissions are automatically assigned. You can grant additional permissions below.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Icon name="AlertCircle" size={16} className="text-error mr-2" />
                    <span className="text-sm text-error">{error}</span>
                  </div>
                </div>
              )}

              {/* Permissions by Category */}
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
                      <Icon name="Folder" size={16} className="mr-2 text-text-muted" />
                      {category}
                    </h4>
                    <div className="space-y-3">
                      {categoryPermissions.map((permission) => {
                        const isSelected = selectedPermissions.has(permission.id);
                        const source = getPermissionSource(permission.id);
                        const isFromRole = source?.type === 'role';
                        
                        return (
                          <div
                            key={permission.id}
                            className={`border rounded-lg p-4 transition-colors ${
                              isSelected 
                                ? 'border-primary bg-primary-50' :'border-border hover:border-secondary-300'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  disabled={isFromRole} // Can't uncheck role permissions
                                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded disabled:opacity-50"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h5 className="text-sm font-medium text-text-primary">
                                      {permission.name}
                                    </h5>
                                    {source && (
                                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                        source.type === 'role' ?'bg-warning-100 text-warning-700' :'bg-success-100 text-success-700'
                                      }`}>
                                        {source.label}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-text-secondary mt-1">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-secondary-50">
            <div className="text-sm text-text-secondary">
              {selectedPermissions.size} permissions selected
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface hover:bg-secondary-100 border border-border rounded-lg transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Save" size={16} />
                    <span>Save Permissions</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;