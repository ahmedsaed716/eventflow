// src/pages/user-management/components/UserModal.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'attendee',
    timezone: 'Africa/Cairo',
    preferred_currency: 'EGP',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'attendee',
        timezone: user.timezone || 'Africa/Cairo',
        preferred_currency: user.preferred_currency || 'EGP',
        is_active: user.is_active ?? true
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await onSave?.(formData);
    } catch (error) {
      console.log('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const roleOptions = [
    { value: 'attendee', label: 'Attendee', description: 'Can register for events' },
    { value: 'usher', label: 'Usher', description: 'Can check-in attendees' },
    { value: 'manager', label: 'Manager', description: 'Can manage events and users' },
    { value: 'admin', label: 'Admin', description: 'Full system access' }
  ];

  const timezoneOptions = [
    { value: 'Africa/Cairo', label: 'Cairo (GMT+2)' },
    { value: 'Europe/London', label: 'London (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' }
  ];

  const currencyOptions = [
    { value: 'EGP', label: 'Egyptian Pound (EGP)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {isEditing ? 'Edit User' : 'Add New User'}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {isEditing ? 'Update user information and settings' : 'Create a new user account'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} className="text-text-muted" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-text-primary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.full_name ? 'border-error bg-error-50' : 'border-border bg-surface'
                  }`}
                  placeholder="Enter full name"
                  disabled={loading}
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-error">{errors.full_name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.email ? 'border-error bg-error-50' : 'border-border bg-surface'
                  }`}
                  placeholder="Enter email address"
                  disabled={loading || isEditing} // Don't allow email changes for existing users
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-border bg-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter phone number"
                  disabled={loading}
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-border bg-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  disabled={loading}
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-4">Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Timezone */}
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-text-primary mb-2">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-border bg-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    disabled={loading}
                  >
                    {timezoneOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency */}
                <div>
                  <label htmlFor="preferred_currency" className="block text-sm font-medium text-text-primary mb-2">
                    Preferred Currency
                  </label>
                  <select
                    id="preferred_currency"
                    name="preferred_currency"
                    value={formData.preferred_currency}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-border bg-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    disabled={loading}
                  >
                    {currencyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Status */}
            {isEditing && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-text-primary">Account is active</span>
                </label>
                <p className="mt-1 text-xs text-text-secondary">
                  Inactive users cannot sign in to the system
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-secondary-100 hover:bg-secondary-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Save" size={16} />
                    <span>{isEditing ? 'Update User' : 'Create User'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;