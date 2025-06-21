import React from 'react';
import Icon from 'components/AppIcon';

const RecentCheckIns = ({ checkIns, onViewAll }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'duplicate':
        return <Icon name="AlertCircle" size={16} className="text-warning" />;
      case 'error':
        return <Icon name="XCircle" size={16} className="text-error" />;
      default:
        return <Icon name="Clock" size={16} className="text-text-secondary" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'duplicate':
        return 'bg-warning-50 border-warning-200';
      case 'error':
        return 'bg-error-50 border-error-200';
      default:
        return 'bg-secondary-50 border-secondary-200';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Recent Check-ins</h3>
          <button
            onClick={onViewAll}
            className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200 ease-out"
          >
            View All
          </button>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          Last 10 attendee check-ins
        </p>
      </div>

      {/* Check-ins List */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {checkIns.length > 0 ? (
          checkIns.map((checkIn) => (
            <div
              key={checkIn.id}
              className={`p-4 transition-colors duration-200 ease-out hover:bg-secondary-50 ${getStatusColor(checkIn.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(checkIn.status)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {checkIn.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-text-secondary">
                        ID: {checkIn.attendeeId}
                      </p>
                      <span className="text-xs text-text-muted">•</span>
                      <p className="text-xs text-text-secondary">
                        {checkIn.time}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    checkIn.status === 'success' ?'bg-success-100 text-success-700'
                      : checkIn.status === 'duplicate' ?'bg-warning-100 text-warning-700' :'bg-error-100 text-error-700'
                  }`}>
                    {checkIn.status === 'success' ? 'Checked In' : 
                     checkIn.status === 'duplicate' ? 'Duplicate' : 'Failed'}
                  </span>
                </div>
              </div>

              {/* Additional Info for Special Cases */}
              {checkIn.status === 'duplicate' && (
                <div className="mt-2 p-2 bg-warning-50 rounded text-xs text-warning-700">
                  <Icon name="Info" size={12} className="inline mr-1" />
                  Already checked in earlier
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Icon name="Users" size={48} className="mx-auto text-text-muted mb-4" />
            <p className="text-text-secondary font-medium">No check-ins yet</p>
            <p className="text-sm text-text-muted mt-1">
              Recent attendee check-ins will appear here
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {checkIns.length > 0 && (
        <div className="p-4 bg-secondary-50 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-success">
                {checkIns.filter(c => c.status === 'success').length}
              </div>
              <div className="text-xs text-text-secondary">Successful</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-warning">
                {checkIns.filter(c => c.status === 'duplicate').length}
              </div>
              <div className="text-xs text-text-secondary">Duplicates</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-error">
                {checkIns.filter(c => c.status === 'error').length}
              </div>
              <div className="text-xs text-text-secondary">Failed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentCheckIns;