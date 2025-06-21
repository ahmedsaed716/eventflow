import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RecentActivity = () => {
  const [activities] = useState([
    {
      id: 1,
      type: 'registration',
      title: 'New Registration',
      description: 'Sarah Johnson registered for Tech Conference 2024',
      timestamp: '2 minutes ago',
      icon: 'UserPlus',
      color: 'success'
    },
    {
      id: 2,
      type: 'event_published',
      title: 'Event Published',
      description: 'Marketing Summit has been published and is now live',
      timestamp: '15 minutes ago',
      icon: 'Eye',
      color: 'primary'
    },
    {
      id: 3,
      type: 'registration',
      title: 'New Registration',
      description: 'Michael Chen registered for Design Workshop',
      timestamp: '23 minutes ago',
      icon: 'UserPlus',
      color: 'success'
    },
    {
      id: 4,
      type: 'event_updated',
      title: 'Event Updated',
      description: 'Healthcare Innovation Forum details were modified',
      timestamp: '1 hour ago',
      icon: 'Edit',
      color: 'accent'
    },
    {
      id: 5,
      type: 'registration',
      title: 'Bulk Registration',
      description: '12 new registrations for Startup Pitch Competition',
      timestamp: '2 hours ago',
      icon: 'Users',
      color: 'success'
    },
    {
      id: 6,
      type: 'event_created',
      title: 'Event Created',
      description: 'New event "AI Workshop Series" created as draft',
      timestamp: '3 hours ago',
      icon: 'Plus',
      color: 'secondary'
    },
    {
      id: 7,
      type: 'check_in',
      title: 'Event Check-in Started',
      description: 'Check-in process began for Tech Conference 2024',
      timestamp: '4 hours ago',
      icon: 'QrCode',
      color: 'primary'
    },
    {
      id: 8,
      type: 'registration_cancelled',
      title: 'Registration Cancelled',
      description: 'John Smith cancelled registration for Marketing Summit',
      timestamp: '5 hours ago',
      icon: 'UserMinus',
      color: 'error'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All Activity', icon: 'Activity' },
    { value: 'registration', label: 'Registrations', icon: 'UserPlus' },
    { value: 'event_published', label: 'Publications', icon: 'Eye' },
    { value: 'event_updated', label: 'Updates', icon: 'Edit' }
  ];

  const getIconColor = (color) => {
    switch (color) {
      case 'success':
        return 'text-success bg-success-50';
      case 'primary':
        return 'text-primary bg-primary-50';
      case 'accent':
        return 'text-accent bg-accent-50';
      case 'error':
        return 'text-error bg-error-50';
      case 'secondary':
        return 'text-secondary-600 bg-secondary-100';
      default:
        return 'text-secondary-600 bg-secondary-100';
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const displayedActivities = showAll 
    ? filteredActivities 
    : filteredActivities.slice(0, 5);

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-text-primary">Recent Activity</h3>
          <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 ease-out">
            View All
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 bg-secondary-50 p-1 rounded-lg">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ease-out ${
                filter === option.value
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={option.icon} size={12} />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-secondary-50 transition-colors duration-150 ease-out">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(activity.color)}`}>
                <Icon name={activity.icon} size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {activity.title}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-text-muted ml-2 flex-shrink-0">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less */}
      {filteredActivities.length > 5 && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center justify-center w-full space-x-2 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out"
          >
            <Icon name={showAll ? "ChevronUp" : "ChevronDown"} size={14} />
            <span>{showAll ? 'Show Less' : `Show ${filteredActivities.length - 5} More`}</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Activity" size={32} className="text-secondary-400 mx-auto mb-3" />
          <p className="text-sm text-text-secondary">No recent activity found</p>
        </div>
      )}

      {/* Real-time Indicator */}
      <div className="px-4 py-2 bg-secondary-50 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-xs text-text-secondary">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>Live updates enabled</span>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;