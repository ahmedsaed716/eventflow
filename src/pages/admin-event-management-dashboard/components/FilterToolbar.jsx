import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FilterToolbar = ({ 
  filters, 
  onFiltersChange, 
  selectedCount, 
  onBulkAction 
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [savedFilters, setSavedFilters] = useState([
    { name: 'Upcoming Events', filters: { dateRange: 'upcoming', status: 'published' } },
    { name: 'Draft Events', filters: { status: 'draft' } },
    { name: 'This Week', filters: { dateRange: 'this-week', status: 'published' } }
  ]);

  const filterOptions = {
    dateRange: [
      { value: 'all', label: 'All Dates' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'this-week', label: 'This Week' },
      { value: 'this-month', label: 'This Month' },
      { value: 'past', label: 'Past Events' }
    ],
    category: [
      { value: 'all', label: 'All Categories' },
      { value: 'Technology', label: 'Technology' },
      { value: 'Business', label: 'Business' },
      { value: 'Creative', label: 'Creative' },
      { value: 'Healthcare', label: 'Healthcare' },
      { value: 'Education', label: 'Education' }
    ],
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
      { value: 'cancelled', label: 'Cancelled' }
    ],
    capacity: [
      { value: 'all', label: 'All Capacities' },
      { value: 'small', label: 'Small (0-100)' },
      { value: 'medium', label: 'Medium (101-300)' },
      { value: 'large', label: 'Large (301+)' }
    ]
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: 'all',
      category: 'all',
      status: 'all',
      capacity: 'all'
    });
  };

  const applyPresetFilter = (preset) => {
    onFiltersChange({
      ...filters,
      ...preset.filters
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

  const bulkActions = [
    { value: 'publish', label: 'Publish Events', icon: 'Eye' },
    { value: 'cancel', label: 'Cancel Events', icon: 'X' },
    { value: 'export', label: 'Export Data', icon: 'Download' },
    { value: 'delete', label: 'Delete Events', icon: 'Trash2', danger: true }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(filterOptions).map(([key, options]) => (
            <div key={key} className="relative">
              <select
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="appearance-none bg-surface border border-border rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon 
                name="ChevronDown" 
                size={14} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none"
              />
            </div>
          ))}
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out"
            >
              <Icon name="X" size={14} />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search events..."
            className="pl-10 pr-4 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
          />
        </div>
      </div>

      {/* Preset Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm text-text-secondary">Quick filters:</span>
        {savedFilters.map((preset, index) => (
          <button
            key={index}
            onClick={() => applyPresetFilter(preset)}
            className="px-3 py-1 text-sm bg-secondary-100 text-text-secondary rounded-full hover:bg-secondary-200 transition-colors duration-200 ease-out"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {selectedCount} event{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="flex items-center space-x-2 px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary-700 transition-colors duration-200 ease-out"
            >
              <span>Bulk Actions</span>
              <Icon name="ChevronDown" size={14} />
            </button>
            
            {showBulkActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {bulkActions.map((action) => (
                    <button
                      key={action.value}
                      onClick={() => {
                        onBulkAction(action.value);
                        setShowBulkActions(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-secondary-100 transition-colors duration-150 ease-out ${
                        action.danger ? 'text-error hover:bg-error-50' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon name={action.icon} size={16} className="mr-3" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;