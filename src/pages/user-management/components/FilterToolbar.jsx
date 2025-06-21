// src/pages/user-management/components/FilterToolbar.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const FilterToolbar = ({ filters, onFiltersChange, userCount }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      role: 'all',
      status: 'all',
      search: ''
    });
  };

  const hasActiveFilters = (
    filters.role !== 'all' || 
    filters.status !== 'all' || 
    filters.search
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={16} className="text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-4">
          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-text-muted" />
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="border border-border rounded-lg px-3 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="usher">Usher</option>
              <option value="attendee">Attendee</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={16} className="text-text-muted" />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-border rounded-lg px-3 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-secondary-50 transition-colors"
            >
              <Icon name="X" size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center space-x-4">
          <span>
            {userCount} {userCount === 1 ? 'user' : 'users'} found
          </span>
          
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={14} />
              <span>Filters applied</span>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            {filters.role !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                Role: {filters.role}
                <button
                  onClick={() => handleFilterChange('role', 'all')}
                  className="ml-1 hover:text-primary-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                Status: {filters.status === 'true' ? 'Active' : 'Inactive'}
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className="ml-1 hover:text-success-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
                Search: "{filters.search.length > 10 ? filters.search.substring(0, 10) + '...' : filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:text-warning-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterToolbar;