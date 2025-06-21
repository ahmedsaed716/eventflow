import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const EventDescription = ({ eventData }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: 'FileText' },
    { id: 'agenda', label: 'Agenda', icon: 'Calendar' },
    { id: 'speakers', label: 'Speakers', icon: 'Users' },
    { id: 'requirements', label: 'Requirements', icon: 'CheckSquare' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ease-out whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary-50' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="prose prose-lg max-w-none">
            <div className="text-text-secondary leading-relaxed whitespace-pre-line">
              {eventData.description}
            </div>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Event Schedule</h3>
            <div className="space-y-3">
              {eventData.agenda.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-lg">
                  <div className="flex-shrink-0 w-20 text-sm font-medium text-primary">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-1">{item.title}</h4>
                    {item.speaker && (
                      <p className="text-sm text-text-secondary">{item.speaker}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <Icon name="Clock" size={16} className="text-text-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'speakers' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Featured Speakers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventData.speakers.map((speaker, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-lg">
                  <Image 
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary">{speaker.name}</h4>
                    <p className="text-sm text-primary font-medium mb-1">{speaker.title}</p>
                    <p className="text-sm text-text-secondary mb-2">{speaker.company}</p>
                    <p className="text-xs text-text-muted leading-relaxed">{speaker.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">What to Bring</h3>
            <div className="space-y-3">
              {eventData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="text-text-secondary">{requirement}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-accent-50 border border-accent-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-accent-600 mb-1">Important Note</h4>
                  <p className="text-sm text-accent-600">
                    Please ensure you have all required items before arriving at the event. 
                    Late arrivals may miss important sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDescription;