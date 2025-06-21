import React, { useState } from 'react';
import Icon from 'components/AppIcon';


const AttendeeTable = ({ 
  attendees, 
  selectedAttendees, 
  sortConfig, 
  onSort, 
  onSelectAll, 
  onSelectAttendee,
  onAttendeeUpdate 
}) => {
  const [viewMode, setViewMode] = useState('table'); // table or cards

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in':
        return 'bg-success-100 text-success-600';
      case 'pending':
        return 'bg-warning-100 text-warning-600';
      case 'no-show':
        return 'bg-error-100 text-error-600';
      case 'paid':
        return 'bg-success-100 text-success-600';
      default:
        return 'bg-secondary-100 text-secondary-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'checked-in':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'no-show':
        return 'XCircle';
      case 'paid':
        return 'CreditCard';
      default:
        return 'AlertCircle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleManualCheckIn = (attendeeId) => {
    onAttendeeUpdate(prev => prev.map(attendee => 
      attendee.id === attendeeId 
        ? { ...attendee, checkInStatus: 'checked-in', checkInTime: new Date().toISOString() }
        : attendee
    ));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const allSelected = attendees.length > 0 && selectedAttendees.length === attendees.length;
  const someSelected = selectedAttendees.length > 0 && selectedAttendees.length < attendees.length;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-base overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Attendees ({attendees.length})
          </h3>
          {selectedAttendees.length > 0 && (
            <span className="text-sm text-text-secondary">
              {selectedAttendees.length} selected
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <div className="hidden sm:flex bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ease-out ${
                viewMode === 'table' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="Table" size={16} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ease-out ${
                viewMode === 'cards' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="Grid3X3" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      {viewMode === 'table' && (
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-secondary-300 text-primary focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => onSort('name')}
                    className="flex items-center space-x-1 hover:text-text-primary transition-colors duration-200 ease-out"
                  >
                    <span>Name</span>
                    <Icon name={getSortIcon('name')} size={12} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <button
                    onClick={() => onSort('registrationDate')}
                    className="flex items-center space-x-1 hover:text-text-primary transition-colors duration-200 ease-out"
                  >
                    <span>Registration</span>
                    <Icon name={getSortIcon('registrationDate')} size={12} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Check-in Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendees.map((attendee) => (
                <tr 
                  key={attendee.id}
                  className={`hover:bg-secondary-50 transition-colors duration-150 ease-out ${
                    selectedAttendees.includes(attendee.id) ? 'bg-primary-50' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.includes(attendee.id)}
                      onChange={(e) => onSelectAttendee(attendee.id, e.target.checked)}
                      className="rounded border-secondary-300 text-primary focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-text-secondary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">{attendee.name}</div>
                        <div className="text-xs text-text-secondary">{attendee.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-text-primary">{attendee.email}</div>
                    <div className="text-xs text-text-secondary">{attendee.phone}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-text-primary">
                      {formatDate(attendee.registrationDate)}
                    </div>
                    <div className="text-xs text-text-secondary">{attendee.ticketType}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(attendee.checkInStatus)}`}>
                        <Icon name={getStatusIcon(attendee.checkInStatus)} size={12} className="mr-1" />
                        {attendee.checkInStatus.replace('-', ' ')}
                      </span>
                    </div>
                    {attendee.checkInTime && (
                      <div className="text-xs text-text-secondary mt-1">
                        {formatDate(attendee.checkInTime)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(attendee.paymentStatus)}`}>
                      <Icon name={getStatusIcon(attendee.paymentStatus)} size={12} className="mr-1" />
                      {attendee.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      {attendee.checkInStatus === 'pending' && (
                        <button
                          onClick={() => handleManualCheckIn(attendee.id)}
                          className="p-1 text-success hover:bg-success-50 rounded transition-colors duration-200 ease-out"
                          title="Manual Check-in"
                        >
                          <Icon name="UserCheck" size={16} />
                        </button>
                      )}
                      <button
                        className="p-1 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200 ease-out"
                        title="View Profile"
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button
                        className="p-1 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200 ease-out"
                        title="Send Message"
                      >
                        <Icon name="MessageSquare" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {attendees.map((attendee) => (
          <div 
            key={attendee.id}
            className={`p-4 ${selectedAttendees.includes(attendee.id) ? 'bg-primary-50' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedAttendees.includes(attendee.id)}
                  onChange={(e) => onSelectAttendee(attendee.id, e.target.checked)}
                  className="rounded border-secondary-300 text-primary focus:ring-primary-500"
                />
                <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{attendee.name}</div>
                  <div className="text-xs text-text-secondary">{attendee.company}</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {attendee.checkInStatus === 'pending' && (
                  <button
                    onClick={() => handleManualCheckIn(attendee.id)}
                    className="p-2 text-success hover:bg-success-50 rounded transition-colors duration-200 ease-out"
                  >
                    <Icon name="UserCheck" size={16} />
                  </button>
                )}
                <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded transition-colors duration-200 ease-out">
                  <Icon name="MoreVertical" size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Contact:</span>
                <span className="text-text-primary">{attendee.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Registered:</span>
                <span className="text-text-primary">{formatDate(attendee.registrationDate)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Status:</span>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendee.checkInStatus)}`}>
                    <Icon name={getStatusIcon(attendee.checkInStatus)} size={10} className="mr-1" />
                    {attendee.checkInStatus.replace('-', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendee.paymentStatus)}`}>
                    <Icon name={getStatusIcon(attendee.paymentStatus)} size={10} className="mr-1" />
                    {attendee.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {attendees.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No attendees found</h3>
          <p className="text-text-secondary">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AttendeeTable;