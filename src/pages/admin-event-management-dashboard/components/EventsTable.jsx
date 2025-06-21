import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const EventsTable = ({ 
  events, 
  selectedEvents, 
  onSelectionChange, 
  onEventAction,
  viewMode 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (sortConfig.key === 'registrations' || sortConfig.key === 'capacity') {
      return sortConfig.direction === 'asc' 
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    }
    
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
    
    return sortConfig.direction === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(events.map(event => event.id));
    }
  };

  const handleSelectEvent = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      onSelectionChange(selectedEvents.filter(id => id !== eventId));
    } else {
      onSelectionChange([...selectedEvents, eventId]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-success-100 text-success-600';
      case 'draft':
        return 'bg-secondary-100 text-secondary-600';
      case 'cancelled':
        return 'bg-error-100 text-error-600';
      default:
        return 'bg-secondary-100 text-secondary-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRegistrationPercentage = (registrations, capacity) => {
    return Math.round((registrations / capacity) * 100);
  };

  if (viewMode === 'calendar') {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="text-center py-12">
          <Icon name="Calendar" size={48} className="text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">Calendar View</h3>
          <p className="text-text-secondary">Calendar view implementation coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedEvents.length === events.length && events.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary border-secondary-300 rounded focus:ring-primary-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Event
              </th>
              {['date', 'capacity', 'registrations', 'status'].map((key) => (
                <th
                  key={key}
                  className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors duration-200 ease-out"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <Icon 
                      name={sortConfig.key === key && sortConfig.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                      size={14} 
                      className={sortConfig.key === key ? 'text-primary' : 'text-secondary-400'}
                    />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedEvents.map((event) => (
              <tr 
                key={event.id}
                className="hover:bg-secondary-50 transition-colors duration-150 ease-out cursor-pointer"
                onClick={() => onEventAction(event.id, 'view-attendees')}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => handleSelectEvent(event.id)}
                    className="w-4 h-4 text-primary border-secondary-300 rounded focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                      <Image
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-text-primary truncate">
                        {event.name}
                      </div>
                      <div className="text-sm text-text-secondary truncate">
                        {event.location} • {event.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-primary">
                  <div>{formatDate(event.date)}</div>
                  <div className="text-text-secondary">{event.time}</div>
                </td>
                <td className="px-6 py-4 text-sm text-text-primary">
                  {event.capacity.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-text-primary">
                      {event.registrations.toLocaleString()}
                    </div>
                    <div className="w-16 bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${Math.min(getRegistrationPercentage(event.registrations, event.capacity), 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-text-secondary">
                      {getRegistrationPercentage(event.registrations, event.capacity)}%
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEventAction(event.id, 'edit')}
                      className="p-1 text-text-secondary hover:text-primary transition-colors duration-200 ease-out"
                      title="Edit Event"
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => onEventAction(event.id, 'duplicate')}
                      className="p-1 text-text-secondary hover:text-accent transition-colors duration-200 ease-out"
                      title="Duplicate Event"
                    >
                      <Icon name="Copy" size={16} />
                    </button>
                    <button
                      onClick={() => onEventAction(event.id, 'toggle-status')}
                      className="p-1 text-text-secondary hover:text-success transition-colors duration-200 ease-out"
                      title="Toggle Status"
                    >
                      <Icon name={event.status === 'published' ? 'Eye' : 'EyeOff'} size={16} />
                    </button>
                    <button
                      onClick={() => onEventAction(event.id, 'delete')}
                      className="p-1 text-text-secondary hover:text-error transition-colors duration-200 ease-out"
                      title="Delete Event"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {sortedEvents.map((event) => (
          <div key={event.id} className="p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={selectedEvents.includes(event.id)}
                onChange={() => handleSelectEvent(event.id)}
                className="mt-1 w-4 h-4 text-primary border-secondary-300 rounded focus:ring-primary-500"
              />
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                <Image
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-text-primary truncate">
                      {event.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {formatDate(event.date)} • {event.time}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {event.location}
                    </p>
                  </div>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    {event.registrations.toLocaleString()} / {event.capacity.toLocaleString()} registered
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEventAction(event.id, 'edit')}
                      className="p-1 text-text-secondary hover:text-primary transition-colors duration-200 ease-out"
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => onEventAction(event.id, 'view-attendees')}
                      className="p-1 text-text-secondary hover:text-accent transition-colors duration-200 ease-out"
                    >
                      <Icon name="Users" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Calendar" size={48} className="text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No events found</h3>
          <p className="text-text-secondary mb-4">Get started by creating your first event</p>
          <button
            onClick={() => onEventAction(null, 'create')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out"
          >
            <Icon name="Plus" size={16} />
            <span>Create Event</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsTable;