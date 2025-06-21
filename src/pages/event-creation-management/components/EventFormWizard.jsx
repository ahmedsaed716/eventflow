import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const EventFormWizard = ({
  currentStep,
  eventData,
  errors,
  categories,
  onInputChange,
  onNestedInputChange,
  onImageUpload
}) => {
  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' }
  ];

  const addCustomField = () => {
    const newField = {
      id: Date.now(),
      label: '',
      type: 'text',
      required: false,
      options: []
    };
    onInputChange('customFields', [...eventData.customFields, newField]);
  };

  const updateCustomField = (fieldId, property, value) => {
    const updatedFields = eventData.customFields.map(field =>
      field.id === fieldId ? { ...field, [property]: value } : field
    );
    onInputChange('customFields', updatedFields);
  };

  const removeCustomField = (fieldId) => {
    const updatedFields = eventData.customFields.filter(field => field.id !== fieldId);
    onInputChange('customFields', updatedFields);
  };

  const addTag = (tag) => {
    if (tag && !eventData.tags.includes(tag)) {
      onInputChange('tags', [...eventData.tags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    onInputChange('tags', eventData.tags.filter(tag => tag !== tagToRemove));
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Basic Information</h3>
        <p className="text-text-secondary mb-6">
          Provide essential details about your event that will help attendees understand what to expect.
        </p>
      </div>

      {/* Event Title */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Event Title *
        </label>
        <input
          type="text"
          value={eventData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Enter a compelling event title"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
            errors.title ? 'border-error' : 'border-border'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Event Description */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Event Description *
        </label>
        <textarea
          value={eventData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Describe your event in detail. What will attendees experience? What should they expect?"
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out resize-none ${
            errors.description ? 'border-error' : 'border-border'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-text-secondary">
          {eventData.description.length}/1000 characters
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Event Category *
        </label>
        <select
          value={eventData.category}
          onChange={(e) => onInputChange('category', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
            errors.category ? 'border-error' : 'border-border'
          }`}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.category}
          </p>
        )}
      </div>

      {/* Event Image */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Event Image
        </label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          {eventData.imagePreview ? (
            <div className="relative">
              <Image
                src={eventData.imagePreview}
                alt="Event preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => onInputChange('imagePreview', '')}
                className="absolute top-2 right-2 p-1 bg-error text-white rounded-full hover:bg-error-600 transition-colors duration-200 ease-out"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          ) : (
            <div>
              <Icon name="Upload" size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-secondary mb-2">
                Upload an event image to make your event more appealing
              </p>
              <p className="text-xs text-text-muted mb-4">
                Recommended: 1200x630px, JPG or PNG, max 5MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                id="event-image"
              />
              <label
                htmlFor="event-image"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out cursor-pointer"
              >
                <Icon name="Camera" size={16} />
                <span>Choose Image</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderScheduleLocation = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Schedule & Location</h3>
        <p className="text-text-secondary mb-6">
          Set the date, time, and location details for your event.
        </p>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Start Date *
          </label>
          <input
            type="date"
            value={eventData.startDate}
            onChange={(e) => onInputChange('startDate', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
              errors.startDate ? 'border-error' : 'border-border'
            }`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.startDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Start Time *
          </label>
          <input
            type="time"
            value={eventData.startTime}
            onChange={(e) => onInputChange('startTime', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
              errors.startTime ? 'border-error' : 'border-border'
            }`}
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.startTime}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            End Date *
          </label>
          <input
            type="date"
            value={eventData.endDate}
            onChange={(e) => onInputChange('endDate', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
              errors.endDate ? 'border-error' : 'border-border'
            }`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.endDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            End Time *
          </label>
          <input
            type="time"
            value={eventData.endTime}
            onChange={(e) => onInputChange('endTime', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
              errors.endTime ? 'border-error' : 'border-border'
            }`}
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.endTime}
            </p>
          )}
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Timezone
        </label>
        <select
          value={eventData.timezone}
          onChange={(e) => onInputChange('timezone', e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Event Type Toggle */}
      <div className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg">
        <button
          onClick={() => onInputChange('isOnline', false)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ease-out ${
            !eventData.isOnline
              ? 'bg-primary text-white' :'bg-surface text-text-secondary hover:bg-secondary-100'
          }`}
        >
          <Icon name="MapPin" size={16} />
          <span>In-Person</span>
        </button>
        <button
          onClick={() => onInputChange('isOnline', true)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ease-out ${
            eventData.isOnline
              ? 'bg-primary text-white' :'bg-surface text-text-secondary hover:bg-secondary-100'
          }`}
        >
          <Icon name="Monitor" size={16} />
          <span>Online</span>
        </button>
      </div>

      {/* Location Details */}
      {!eventData.isOnline ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Venue Name *
            </label>
            <input
              type="text"
              value={eventData.venue}
              onChange={(e) => onInputChange('venue', e.target.value)}
              placeholder="Enter venue name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
                errors.venue ? 'border-error' : 'border-border'
              }`}
            />
            {errors.venue && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.venue}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Address
            </label>
            <textarea
              value={eventData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              placeholder="Enter complete address with city, state, and postal code"
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out resize-none"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Meeting Link *
          </label>
          <input
            type="url"
            value={eventData.meetingLink}
            onChange={(e) => onInputChange('meetingLink', e.target.value)}
            placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
              errors.meetingLink ? 'border-error' : 'border-border'
            }`}
          />
          {errors.meetingLink && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.meetingLink}
            </p>
          )}
        </div>
      )}

      {/* Recurring Event */}
      <div className="p-4 bg-secondary-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-text-primary">Recurring Event</h4>
            <p className="text-sm text-text-secondary">Set up a series of recurring events</p>
          </div>
          <button
            onClick={() => onInputChange('isRecurring', !eventData.isRecurring)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-out ${
              eventData.isRecurring ? 'bg-primary' : 'bg-secondary-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                eventData.isRecurring ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {eventData.isRecurring && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Repeat Pattern
            </label>
            <select
              value={eventData.recurringPattern}
              onChange={(e) => onInputChange('recurringPattern', e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );

  const renderRegistrationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Registration Settings</h3>
        <p className="text-text-secondary mb-6">
          Configure how attendees can register for your event.
        </p>
      </div>

      {/* Capacity and Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Event Capacity *
          </label>
          <input
            type="number"
            value={eventData.capacity}
            onChange={(e) => onInputChange('capacity', parseInt(e.target.value) || '')}
            placeholder="Maximum number of attendees"
            min="1"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
              errors.capacity ? 'border-error' : 'border-border'
            }`}
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.capacity}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Registration Deadline *
          </label>
          <input
            type="datetime-local"
            value={eventData.registrationDeadline}
            onChange={(e) => onInputChange('registrationDeadline', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out ${
              errors.registrationDeadline ? 'border-error' : 'border-border'
            }`}
          />
          {errors.registrationDeadline && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.registrationDeadline}
            </p>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Ticket Price
          </label>
          <div className="relative">
            <input
              type="number"
              value={eventData.price}
              onChange={(e) => onInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-text-secondary">
                {eventData.currency === 'USD' ? '$' : 
                 eventData.currency === 'EUR' ? '€' : 
                 eventData.currency === 'GBP' ? '£' : 
                 eventData.currency === 'JPY' ? '¥' : '$'}
              </span>
            </div>
          </div>
          {eventData.price === 0 && (
            <p className="mt-1 text-sm text-success flex items-center">
              <Icon name="Check" size={14} className="mr-1" />
              Free event
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Currency
          </label>
          <select
            value={eventData.currency}
            onChange={(e) => onInputChange('currency', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Registration Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div>
            <h4 className="font-medium text-text-primary">Require Approval</h4>
            <p className="text-sm text-text-secondary">Manually approve each registration</p>
          </div>
          <button
            onClick={() => onInputChange('requiresApproval', !eventData.requiresApproval)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-out ${
              eventData.requiresApproval ? 'bg-primary' : 'bg-secondary-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                eventData.requiresApproval ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div>
            <h4 className="font-medium text-text-primary">Enable Waitlist</h4>
            <p className="text-sm text-text-secondary">Allow registrations when event is full</p>
          </div>
          <button
            onClick={() => onInputChange('enableWaitlist', !eventData.enableWaitlist)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-out ${
              eventData.enableWaitlist ? 'bg-primary' : 'bg-secondary-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                eventData.enableWaitlist ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdvancedOptions = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Advanced Options</h3>
        <p className="text-text-secondary mb-6">
          Customize your event with additional fields and settings.
        </p>
      </div>

      {/* Custom Registration Fields */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-text-primary">Custom Registration Fields</h4>
          <button
            onClick={addCustomField}
            className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out"
          >
            <Icon name="Plus" size={16} />
            <span>Add Field</span>
          </button>
        </div>

        <div className="space-y-4">
          {eventData.customFields.map((field) => (
            <div key={field.id} className="p-4 border border-border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                    placeholder="Enter field label"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Field Type
                  </label>
                  <select
                    value={field.type}
                    onChange={(e) => updateCustomField(field.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="select">Dropdown</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="textarea">Text Area</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>

                <div className="flex items-end space-x-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${field.id}`}
                      checked={field.required}
                      onChange={(e) => updateCustomField(field.id, 'required', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <label htmlFor={`required-${field.id}`} className="ml-2 text-sm text-text-primary">
                      Required
                    </label>
                  </div>
                  <button
                    onClick={() => removeCustomField(field.id)}
                    className="p-2 text-error hover:bg-error-50 rounded-lg transition-colors duration-200 ease-out"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {eventData.customFields.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              <Icon name="FormInput" size={48} className="mx-auto mb-4 opacity-50" />
              <p>No custom fields added yet</p>
              <p className="text-sm">Add custom fields to collect additional information from attendees</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Tags */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Event Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {eventData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-2 text-primary-500 hover:text-primary-700"
              >
                <Icon name="X" size={14} />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tags (press Enter to add)"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(e.target.value.trim());
              e.target.value = '';
            }
          }}
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
        />
        <p className="mt-1 text-xs text-text-secondary">
          Tags help attendees discover your event. Press Enter to add each tag.
        </p>
      </div>

      {/* Notification Settings */}
      <div>
        <h4 className="font-medium text-text-primary mb-4">Notification Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
            <div>
              <span className="font-medium text-text-primary">Registration Confirmations</span>
              <p className="text-sm text-text-secondary">Send confirmation emails to new registrants</p>
            </div>
            <button
              onClick={() => onNestedInputChange('notifications', 'registration', !eventData.notifications.registration)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-out ${
                eventData.notifications.registration ? 'bg-primary' : 'bg-secondary-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                  eventData.notifications.registration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
            <div>
              <span className="font-medium text-text-primary">Event Reminders</span>
              <p className="text-sm text-text-secondary">Send reminder emails before the event</p>
            </div>
            <button
              onClick={() => onNestedInputChange('notifications', 'reminder', !eventData.notifications.reminder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-out ${
                eventData.notifications.reminder ? 'bg-primary' : 'bg-secondary-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                  eventData.notifications.reminder ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
            <div>
              <span className="font-medium text-text-primary">Event Updates</span>
              <p className="text-sm text-text-secondary">Notify attendees of event changes</p>
            </div>
            <button
              onClick={() => onNestedInputChange('notifications', 'updates', !eventData.notifications.updates)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-out ${
                eventData.notifications.updates ? 'bg-primary' : 'bg-secondary-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                  eventData.notifications.updates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const stepComponents = [
    renderBasicInfo,
    renderScheduleLocation,
    renderRegistrationSettings,
    renderAdvancedOptions
  ];

  return (
    <div className="min-h-96">
      {stepComponents[currentStep]()}
    </div>
  );
};

export default EventFormWizard;