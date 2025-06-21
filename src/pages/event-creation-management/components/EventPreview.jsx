import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const EventPreview = ({ eventData, isFullPreview = false }) => {
  const formatDate = (date, time) => {
    if (!date || !time) return 'Date & Time TBD';
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price, currency) => {
    if (price === 0) return 'Free';
    const symbol = currency === 'USD' ? '$' : 
                  currency === 'EUR' ? '€' : 
                  currency === 'GBP' ? '£' : 
                  currency === 'JPY' ? '¥' : '$';
    return `${symbol}${price.toFixed(2)}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      business: 'Briefcase',
      education: 'GraduationCap',
      technology: 'Cpu',
      networking: 'Users',
      health: 'Heart',
      arts: 'Palette',
      sports: 'Trophy',
      other: 'Calendar'
    };
    return icons[category] || 'Calendar';
  };

  if (isFullPreview) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Event Header */}
        <div className="relative mb-6">
          {eventData.imagePreview ? (
            <div className="aspect-video overflow-hidden rounded-lg">
              <Image
                src={eventData.imagePreview}
                alt={eventData.title || 'Event image'}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-secondary-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Icon name="Image" size={48} className="mx-auto text-text-muted mb-2" />
                <p className="text-text-secondary">Event image will appear here</p>
              </div>
            </div>
          )}
          
          {eventData.category && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                <Icon name={getCategoryIcon(eventData.category)} size={14} className="mr-1" />
                {eventData.category.charAt(0).toUpperCase() + eventData.category.slice(1)}
              </span>
            </div>
          )}
          
          {eventData.price !== undefined && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
                {formatPrice(eventData.price, eventData.currency)}
              </span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {eventData.title || 'Event Title'}
            </h1>
            {eventData.description && (
              <p className="text-text-secondary leading-relaxed">
                {eventData.description}
              </p>
            )}
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-1">Date & Time</h3>
                <p className="text-text-secondary">
                  {formatDate(eventData.startDate, eventData.startTime)}
                </p>
                {eventData.endDate && eventData.endTime && (
                  <p className="text-text-secondary text-sm">
                    Ends: {formatDate(eventData.endDate, eventData.endTime)}
                  </p>
                )}
                {eventData.timezone && (
                  <p className="text-text-muted text-sm">{eventData.timezone}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <Icon name={eventData.isOnline ? "Monitor" : "MapPin"} size={20} className="text-success" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-1">Location</h3>
                {eventData.isOnline ? (
                  <div>
                    <p className="text-text-secondary">Online Event</p>
                    {eventData.meetingLink && (
                      <p className="text-primary text-sm">Meeting link will be provided</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-text-secondary">
                      {eventData.venue || 'Venue TBD'}
                    </p>
                    {eventData.address && (
                      <p className="text-text-muted text-sm">{eventData.address}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Capacity */}
            {eventData.capacity && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">Capacity</h3>
                  <p className="text-text-secondary">{eventData.capacity} attendees</p>
                  {eventData.enableWaitlist && (
                    <p className="text-text-muted text-sm">Waitlist available</p>
                  )}
                </div>
              </div>
            )}

            {/* Registration Deadline */}
            {eventData.registrationDeadline && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">Registration Deadline</h3>
                  <p className="text-text-secondary">
                    {new Date(eventData.registrationDeadline).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {eventData.tags && eventData.tags.length > 0 && (
            <div>
              <h3 className="font-medium text-text-primary mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {eventData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary-100 text-text-secondary rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Registration Requirements */}
          {(eventData.requiresApproval || eventData.customFields.length > 0) && (
            <div>
              <h3 className="font-medium text-text-primary mb-3">Registration Requirements</h3>
              <div className="space-y-2">
                {eventData.requiresApproval && (
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="Shield" size={16} />
                    <span>Registration requires approval</span>
                  </div>
                )}
                {eventData.customFields.length > 0 && (
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="FormInput" size={16} />
                    <span>{eventData.customFields.length} additional field(s) required</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="pt-6 border-t border-border">
            <button className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 ease-out">
              Register for Event
            </button>
            <p className="text-center text-text-muted text-sm mt-2">
              Registration opens when event is published
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar preview (compact version)
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">Live Preview</h3>
        <Icon name="Eye" size={16} className="text-text-secondary" />
      </div>

      <div className="space-y-4">
        {/* Event Image */}
        <div className="aspect-video overflow-hidden rounded-lg bg-secondary-100">
          {eventData.imagePreview ? (
            <Image
              src={eventData.imagePreview}
              alt={eventData.title || 'Event preview'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="Image" size={32} className="text-text-muted" />
            </div>
          )}
        </div>

        {/* Event Title */}
        <div>
          <h4 className="font-semibold text-text-primary text-lg leading-tight">
            {eventData.title || 'Event Title'}
          </h4>
          {eventData.category && (
            <div className="flex items-center space-x-1 mt-1">
              <Icon name={getCategoryIcon(eventData.category)} size={14} className="text-text-muted" />
              <span className="text-sm text-text-muted capitalize">{eventData.category}</span>
            </div>
          )}
        </div>

        {/* Key Details */}
        <div className="space-y-2 text-sm">
          {(eventData.startDate || eventData.startTime) && (
            <div className="flex items-center space-x-2 text-text-secondary">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(eventData.startDate, eventData.startTime)}</span>
            </div>
          )}

          {(eventData.venue || eventData.isOnline) && (
            <div className="flex items-center space-x-2 text-text-secondary">
              <Icon name={eventData.isOnline ? "Monitor" : "MapPin"} size={14} />
              <span>
                {eventData.isOnline ? 'Online Event' : (eventData.venue || 'Venue TBD')}
              </span>
            </div>
          )}

          {eventData.capacity && (
            <div className="flex items-center space-x-2 text-text-secondary">
              <Icon name="Users" size={14} />
              <span>{eventData.capacity} attendees</span>
            </div>
          )}

          {eventData.price !== undefined && (
            <div className="flex items-center space-x-2 text-text-secondary">
              <Icon name="DollarSign" size={14} />
              <span>{formatPrice(eventData.price, eventData.currency)}</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        {eventData.description && (
          <div>
            <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
              {eventData.description.length > 100 
                ? `${eventData.description.substring(0, 100)}...` 
                : eventData.description
              }
            </p>
          </div>
        )}

        {/* Status Indicator */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Preview Mode</span>
            <span className="px-2 py-1 bg-warning-100 text-warning-600 rounded text-xs font-medium">
              Draft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;