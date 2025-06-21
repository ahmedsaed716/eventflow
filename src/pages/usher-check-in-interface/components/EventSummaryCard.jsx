import React from 'react';
import Icon from 'components/AppIcon';

const EventSummaryCard = ({ event, stats }) => {
  const progressPercentage = Math.round((stats.checkedIn / stats.totalCapacity) * 100);
  
  const getEventStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'upcoming':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'ended':
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={20} color="white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {event?.name || 'Event Name'}
                </h2>
                <p className="text-sm text-text-secondary">
                  {event?.date ? formatDate(event.date) : 'Event Date'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEventStatusColor(event?.status)}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                event?.status === 'active' ? 'bg-success animate-pulse' : 
                event?.status === 'upcoming' ? 'bg-warning' : 'bg-secondary-400'
              }`} />
              {event?.status === 'active' ? 'Live Event' : 
               event?.status === 'upcoming' ? 'Upcoming' : 'Ended'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {/* Total Capacity */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-secondary-100 rounded-full flex items-center justify-center">
              <Icon name="Users" size={24} className="text-secondary-600" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.totalCapacity}</div>
            <div className="text-sm text-text-secondary">Total Capacity</div>
          </div>

          {/* Checked In */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-success-100 rounded-full flex items-center justify-center">
              <Icon name="UserCheck" size={24} className="text-success-600" />
            </div>
            <div className="text-2xl font-bold text-success">{stats.checkedIn}</div>
            <div className="text-sm text-text-secondary">Checked In</div>
          </div>

          {/* Remaining */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-accent-100 rounded-full flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-accent-600" />
            </div>
            <div className="text-2xl font-bold text-accent">{stats.remaining}</div>
            <div className="text-sm text-text-secondary">Remaining</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Check-in Progress</span>
            <span className="text-sm text-text-secondary">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-success to-success-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <div>
              <div className="text-sm font-medium text-text-primary">
                {Math.round((stats.checkedIn / (stats.checkedIn + stats.remaining)) * 100)}% Complete
              </div>
              <div className="text-xs text-text-secondary">Attendance Rate</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <div>
              <div className="text-sm font-medium text-text-primary">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-text-secondary">Current Time</div>
            </div>
          </div>
        </div>

        {/* Capacity Warning */}
        {progressPercentage > 90 && (
          <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning-600" />
              <span className="text-sm text-warning-700 font-medium">
                Near Capacity
              </span>
            </div>
            <p className="text-xs text-warning-600 mt-1">
              Event is approaching maximum capacity. Monitor closely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSummaryCard;