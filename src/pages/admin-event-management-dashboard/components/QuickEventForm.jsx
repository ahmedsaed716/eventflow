import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const QuickEventForm = ({ onEventCreate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    category: 'Technology',
    capacity: '',
    location: ''
  });

  const categories = [
    'Technology',
    'Business',
    'Creative',
    'Healthcare',
    'Education',
    'Sports',
    'Entertainment'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.capacity) return;

    const newEvent = {
      ...formData,
      capacity: parseInt(formData.capacity),
      registrations: 0,
      status: 'draft',
      description: `New ${formData.category.toLowerCase()} event created via quick form.

This event was created using the quick creation form and requires additional details to be completed before publishing.`,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    onEventCreate(newEvent);
    
    // Reset form
    setFormData({
      name: '',
      date: '',
      time: '',
      category: 'Technology',
      capacity: '',
      location: ''
    });
    setIsExpanded(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center space-x-2">
            <Icon name="Plus" size={16} className="text-primary" />
            <h3 className="font-medium text-text-primary">Quick Event Creation</h3>
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-text-secondary"
          />
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Event Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter event name"
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Icon 
                name="ChevronDown" 
                size={14} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none"
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Capacity *
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', e.target.value)}
              placeholder="Maximum attendees"
              min="1"
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Event location"
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out"
            >
              Cancel
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-700 transition-colors duration-200 ease-out"
              >
                <Icon name="Plus" size={14} />
                <span>Create Draft</span>
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-text-secondary bg-secondary-50 p-3 rounded-md">
            <Icon name="Info" size={12} className="inline mr-1" />
            Events created here will be saved as drafts. You can add more details and publish them later.
          </div>
        </form>
      )}
    </div>
  );
};

export default QuickEventForm;