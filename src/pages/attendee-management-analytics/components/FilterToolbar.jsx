import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FilterToolbar = ({ filters, onFiltersChange, totalCount, filteredCount }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      registrationStatus: 'all',
      checkInStatus: 'all',
      paymentStatus: 'all'
    });
  };

  const hasActiveFilters = filters.search || 
                          filters.registrationStatus !== 'all' || 
                          filters.checkInStatus !== 'all' || 
                          filters.paymentStatus !== 'all';

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFilterChange('checkInStatus', filters.checkInStatus === 'checked-in' ? 'all' : 'checked-in')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out ${
              filters.checkInStatus === 'checked-in' ?'bg-success text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
            }`}
          >
            <Icon name="UserCheck" size={14} className="mr-1" />
            Checked In
          </button>
          
          <button
            onClick={() => handleFilterChange('checkInStatus', filters.checkInStatus === 'pending' ? 'all' : 'pending')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out ${
              filters.checkInStatus === 'pending' ?'bg-warning text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
            }`}
          >
            <Icon name="Clock" size={14} className="mr-1" />
            Pending
          </button>

          <button
            onClick={() => handleFilterChange('paymentStatus', filters.paymentStatus === 'pending' ? 'all' : 'pending')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out ${
              filters.paymentStatus === 'pending' ?'bg-error text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
            }`}
          >
            <Icon name="AlertCircle" size={14} className="mr-1" />
            Payment Due
          </button>

          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out ${
              isAdvancedOpen
                ? 'bg-primary text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
            }`}
          >
            <Icon name="Filter" size={14} className="mr-1" />
            Advanced
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Registration Status
              </label>
              <select
                value={filters.registrationStatus}
                onChange={(e) => handleFilterChange('registrationStatus', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
              >
                <option value="all">All Registrations</option>
                <option value="paid">Paid</option>
                <option value="pending">Payment Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Check-in Status
              </label>
              <select
                value={filters.checkInStatus}
                onChange={(e) => handleFilterChange('checkInStatus', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
              >
                <option value="all">All Statuses</option>
                <option value="checked-in">Checked In</option>
                <option value="pending">Pending</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Payment Status
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary and Clear Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-text-secondary">
            Showing {filteredCount} of {totalCount} attendees
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-sm text-primary hover:text-primary-700 transition-colors duration-200 ease-out"
            >
              <Icon name="X" size={14} />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-secondary">Active filters:</span>
            <div className="flex items-center space-x-1">
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-600">
                  Search: "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 hover:text-primary-800"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              )}
              {filters.registrationStatus !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary-100 text-secondary-600">
                  Registration: {filters.registrationStatus}
                  <button
                    onClick={() => handleFilterChange('registrationStatus', 'all')}
                    className="ml-1 hover:text-secondary-800"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              )}
              {filters.checkInStatus !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent-100 text-accent-600">
                  Check-in: {filters.checkInStatus}
                  <button
                    onClick={() => handleFilterChange('checkInStatus', 'all')}
                    className="ml-1 hover:text-accent-800"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              )}
              {filters.paymentStatus !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-success-100 text-success-600">
                  Payment: {filters.paymentStatus}
                  <button
                    onClick={() => handleFilterChange('paymentStatus', 'all')}
                    className="ml-1 hover:text-success-800"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterToolbar;