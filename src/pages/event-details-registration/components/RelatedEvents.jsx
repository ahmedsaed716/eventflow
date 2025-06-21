import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RelatedEvents = ({ events }) => {
  const navigate = useNavigate();

  const handleEventClick = (eventId) => {
    // Navigate to the same page with different event data
    navigate(`/event-details-registration?eventId=${eventId}`);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">Related Events</h3>
        <button 
          onClick={() => navigate('/login-register')}
          className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 ease-out"
        >
          View All Events
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div 
            key={event.id}
            className="group cursor-pointer"
            onClick={() => handleEventClick(event.id)}
          >
            <div className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 ease-out transform group-hover:scale-105">
              {/* Event Image */}
              <div className="relative h-40 overflow-hidden">
                <Image 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-sm font-semibold text-text-primary">
                      ${event.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-4">
                <h4 className="font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors duration-200 ease-out">
                  {event.title}
                </h4>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="Calendar" size={14} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="MapPin" size={14} />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-2 px-4 bg-primary-50 text-primary rounded-md text-sm font-medium hover:bg-primary-100 transition-colors duration-200 ease-out group-hover:bg-primary group-hover:text-white">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Browse More */}
      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/login-register')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out"
        >
          <Icon name="Search" size={16} />
          <span>Browse More Events</span>
        </button>
      </div>
    </div>
  );
};

export default RelatedEvents;