import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BulkActionsBar = ({ selectedCount, onAction, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      id: 'email',
      label: 'Send Email',
      icon: 'Mail',
      description: 'Send email to selected attendees',
      color: 'bg-primary text-white hover:bg-primary-700'
    },
    {
      id: 'check-in',
      label: 'Bulk Check-in',
      icon: 'UserCheck',
      description: 'Mark selected as checked in',
      color: 'bg-success text-white hover:bg-success-600'
    },
    {
      id: 'export',
      label: 'Export Data',
      icon: 'Download',
      description: 'Export selected attendee data',
      color: 'bg-secondary-600 text-white hover:bg-secondary-700'
    },
    {
      id: 'refund',
      label: 'Process Refund',
      icon: 'CreditCard',
      description: 'Process refunds for selected',
      color: 'bg-warning text-white hover:bg-warning-600'
    },
    {
      id: 'delete',
      label: 'Remove',
      icon: 'Trash2',
      description: 'Remove selected attendees',
      color: 'bg-error text-white hover:bg-error-600'
    }
  ];

  const primaryActions = actions.slice(0, 3);
  const secondaryActions = actions.slice(3);

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 animate-slide-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Check" size={16} color="white" />
            </div>
            <span className="text-sm font-medium text-text-primary">
              {selectedCount} attendee{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>

          {/* Primary Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            {primaryActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onAction(action.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out ${action.color}`}
                title={action.description}
              >
                <Icon name={action.icon} size={14} />
                <span className="hidden md:inline">{action.label}</span>
              </button>
            ))}
            
            {secondaryActions.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-1 px-3 py-2 bg-secondary-100 text-text-secondary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out"
              >
                <Icon name="MoreHorizontal" size={14} />
                <span className="hidden md:inline">More</span>
              </button>
            )}
          </div>

          {/* Mobile Actions Menu */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out"
            >
              <Icon name="Settings" size={14} />
              <span>Actions</span>
            </button>
          </div>
        </div>

        {/* Clear Selection */}
        <button
          onClick={onClear}
          className="flex items-center space-x-1 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200 ease-out"
        >
          <Icon name="X" size={14} />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Expanded Actions */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-primary-200 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
            {(window.innerWidth < 640 ? actions : secondaryActions).map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  onAction(action.id);
                  setIsExpanded(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out ${action.color}`}
              >
                <Icon name={action.icon} size={14} />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-3 text-xs text-text-secondary">
            <p>Bulk actions will be applied to all {selectedCount} selected attendees.</p>
          </div>
        </div>
      )}

      {/* Action Confirmation */}
      <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center space-x-4">
          <span>Quick actions available for selected attendees</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={12} />
          <span>Some actions may require confirmation</span>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;