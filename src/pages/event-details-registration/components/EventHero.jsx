import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const EventHero = ({ 
  eventData, 
  availableSpots, 
  registrationProgress, 
  daysUntilDeadline, 
  onRegisterClick 
}) => {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Event Image */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image 
          src={eventData.image}
          alt={eventData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Event Tags */}
        <div className="absolute top-4 left-4">
          <div className="flex flex-wrap gap-2">
            {eventData.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-white/90 text-text-primary text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Capacity Indicator */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <div className="text-xs text-text-secondary mb-1">Capacity</div>
            <div className="flex items-center space-x-2">
              <div className="text-sm font-semibold text-text-primary">
                {eventData.registered}/{eventData.capacity}
              </div>
              <div className="w-16 h-2 bg-secondary-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${registrationProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              {eventData.title}
            </h1>
            <div className="flex items-center space-x-4 text-text-secondary mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} />
                <span className="text-sm">{new Date(eventData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} />
                <span className="text-sm">{eventData.time}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              ${eventData.price}
            </div>
            <div className="text-sm text-text-secondary">per person</div>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-start space-x-3 mb-4">
              <Icon name="MapPin" size={20} className="text-text-secondary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-text-primary mb-1">{eventData.location}</h3>
                <p className="text-sm text-text-secondary">{eventData.address}</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-32 rounded-lg overflow-hidden border border-border">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={eventData.location}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${eventData.coordinates.lat},${eventData.coordinates.lng}&z=14&output=embed`}
              className="border-0"
            />
          </div>
        </div>

        {/* Registration Button & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onRegisterClick}
              disabled={availableSpots === 0}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ease-out ${
                availableSpots === 0
                  ? 'bg-secondary-200 text-text-muted cursor-not-allowed' :'bg-primary text-white hover:bg-primary-700 hover:shadow-md transform hover:scale-105'
              }`}
            >
              {availableSpots === 0 ? 'Event Full' : 'Register Now'}
            </button>

            {availableSpots > 0 && availableSpots <= 50 && (
              <div className="flex items-center space-x-2 text-warning">
                <Icon name="AlertTriangle" size={16} />
                <span className="text-sm font-medium">Only {availableSpots} spots left!</span>
              </div>
            )}
          </div>

          {/* Deadline Warning */}
          {daysUntilDeadline > 0 && daysUntilDeadline <= 7 && (
            <div className="flex items-center space-x-2 text-error">
              <Icon name="Clock" size={16} />
              <span className="text-sm font-medium">
                Registration closes in {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventHero;