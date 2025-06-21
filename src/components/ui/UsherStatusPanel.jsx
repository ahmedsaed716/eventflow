import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const UsherStatusPanel = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    totalAttendees: 245,
    checkedIn: 187,
    pending: 58,
    lastScanTime: new Date(),
    scanRate: 12, // scans per minute
    eventStatus: 'active'
  });

  const [recentScans, setRecentScans] = useState([
    { id: 1, name: 'John Smith', time: '2 min ago', status: 'success' },
    { id: 2, name: 'Sarah Johnson', time: '3 min ago', status: 'success' },
    { id: 3, name: 'Mike Wilson', time: '5 min ago', status: 'duplicate' },
  ]);

  const [isOnline, setIsOnline] = useState(true);

  // Only show on usher interface
  const isUsherInterface = location.pathname.includes('usher-check-in');

  useEffect(() => {
    if (!isUsherInterface) return;

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        checkedIn: prev.checkedIn + Math.floor(Math.random() * 2),
        pending: Math.max(0, prev.pending - Math.floor(Math.random() * 2)),
        lastScanTime: new Date(),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isUsherInterface]);

  if (!isUsherInterface) {
    return null;
  }

  const checkedInPercentage = Math.round((stats.checkedIn / stats.totalAttendees) * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-lg z-900">
      <div className="px-4 py-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-error'}`} />
            <span className="text-xs text-text-secondary">
              {isOnline ? 'Connected' : 'Offline Mode'}
            </span>
          </div>
          <div className="text-xs text-text-secondary">
            Last scan: {stats.lastScanTime.toLocaleTimeString()}
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Total Progress */}
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#E2E8F0"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#10B981"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${checkedInPercentage * 1.76} 176`}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-text-primary">
                  {checkedInPercentage}%
                </span>
              </div>
            </div>
            <div className="text-xs text-text-secondary">Progress</div>
          </div>

          {/* Checked In */}
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-success-50 rounded-full">
              <Icon name="UserCheck" size={24} className="text-success" />
            </div>
            <div className="text-lg font-semibold text-text-primary">{stats.checkedIn}</div>
            <div className="text-xs text-text-secondary">Checked In</div>
          </div>

          {/* Pending */}
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-accent-50 rounded-full">
              <Icon name="Clock" size={24} className="text-accent" />
            </div>
            <div className="text-lg font-semibold text-text-primary">{stats.pending}</div>
            <div className="text-xs text-text-secondary">Pending</div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} className="text-text-secondary" />
              <span className="text-sm text-text-primary font-medium">{stats.totalAttendees}</span>
              <span className="text-xs text-text-secondary">total</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Zap" size={14} className="text-accent" />
              <span className="text-sm text-text-primary font-medium">{stats.scanRate}</span>
              <span className="text-xs text-text-secondary">scans/min</span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            stats.eventStatus === 'active' ?'bg-success-100 text-success-600' :'bg-secondary-100 text-secondary-600'
          }`}>
            {stats.eventStatus === 'active' ? 'Event Active' : 'Event Ended'}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Recent Scans
            </span>
            <button className="text-xs text-primary hover:text-primary-700 transition-colors duration-200 ease-out">
              View All
            </button>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-2 bg-surface border border-border rounded">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    scan.status === 'success' ? 'bg-success' : 
                    scan.status === 'duplicate' ? 'bg-warning' : 'bg-error'
                  }`} />
                  <span className="text-sm text-text-primary font-medium">{scan.name}</span>
                </div>
                <span className="text-xs text-text-secondary">{scan.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="flex space-x-2 mt-3 pt-3 border-t border-border">
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-error-50 text-error-600 rounded-md text-sm font-medium hover:bg-error-100 transition-colors duration-200 ease-out">
            <Icon name="AlertTriangle" size={16} />
            <span>Emergency</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-secondary-100 text-text-secondary rounded-md text-sm font-medium hover:bg-secondary-200 transition-colors duration-200 ease-out">
            <Icon name="RefreshCw" size={16} />
            <span>Sync Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsherStatusPanel;