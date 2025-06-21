// src/pages/user-management/components/UserTable.jsx
import React from 'react';
import Icon from 'components/AppIcon';
import { formatDateEgypt, formatRelativeTime } from '../../../utils/dateFormatter';

const UserTable = ({ users, loading, onUserAction, currentUserId }) => {
  const roleColors = {
    admin: 'bg-error-100 text-error-700',
    manager: 'bg-warning-100 text-warning-700',
    usher: 'bg-primary-100 text-primary-700',
    attendee: 'bg-success-100 text-success-700'
  };

  const getRoleBadge = (role) => {
    const colorClass = roleColors[role] || 'bg-secondary-100 text-secondary-700';
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        isActive 
          ? 'bg-success-100 text-success-700' :'bg-secondary-100 text-secondary-700'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-secondary-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
              </div>
              <div className="h-8 w-20 bg-secondary-200 rounded"></div>
              <div className="h-8 w-24 bg-secondary-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Users" size={48} className="mx-auto text-text-muted mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No Users Found</h3>
        <p className="text-text-secondary">
          No users match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-secondary-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-secondary-50 transition-colors">
              {/* User Info */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    {user.avatar_url ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.avatar_url}
                        alt={user.full_name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-text-primary">
                      {user.full_name}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="text-xs text-text-muted">
                        {user.phone}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="px-6 py-4 whitespace-nowrap">
                {getRoleBadge(user.role)}
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(user.is_active)}
              </td>

              {/* Last Login */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                {user.last_login_at ? (
                  <div>
                    <div>{formatRelativeTime(user.last_login_at)}</div>
                    <div className="text-xs text-text-muted">
                      {formatDateEgypt(user.last_login_at, 'MMM d, yyyy')}
                    </div>
                  </div>
                ) : (
                  'Never'
                )}
              </td>

              {/* Created */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                <div>{formatDateEgypt(user.created_at, 'MMM d, yyyy')}</div>
                <div className="text-xs text-text-muted">
                  {formatRelativeTime(user.created_at)}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => onUserAction?.(user.id, 'edit')}
                    className="text-primary hover:text-primary-700 p-1 rounded transition-colors"
                    title="Edit User"
                  >
                    <Icon name="Edit" size={16} />
                  </button>

                  {/* Permissions Button */}
                  <button
                    onClick={() => onUserAction?.(user.id, 'permissions')}
                    className="text-warning hover:text-warning-600 p-1 rounded transition-colors"
                    title="Manage Permissions"
                  >
                    <Icon name="Shield" size={16} />
                  </button>

                  {/* Status Toggle Button */}
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => onUserAction?.(user.id, 'toggle-status')}
                      className={`p-1 rounded transition-colors ${
                        user.is_active
                          ? 'text-error hover:text-error-600' :'text-success hover:text-success-600'
                      }`}
                      title={user.is_active ? 'Deactivate User' : 'Activate User'}
                    >
                      <Icon name={user.is_active ? 'UserX' : 'UserCheck'} size={16} />
                    </button>
                  )}

                  {/* Role Change Dropdown */}
                  {user.id !== currentUserId && (
                    <select
                      value={user.role}
                      onChange={(e) => onUserAction?.(user.id, 'change-role', { role: e.target.value })}
                      className="text-xs border border-border rounded px-2 py-1 bg-surface focus:ring-2 focus:ring-primary focus:border-primary"
                      title="Change Role"
                    >
                      <option value="attendee">Attendee</option>
                      <option value="usher">Usher</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;