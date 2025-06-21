import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RegistrationForm = ({ eventData, onSubmit, currentStep, onStepChange }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    specialRequests: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit({
        ...formData,
        registrationId: `REG_${Date.now()}`,
        eventId: eventData.id,
        registrationDate: new Date().toISOString(),
        qrCode: `QR_${Date.now()}_${eventData.id}`
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Event Registration</h2>
        <div className="text-sm text-text-secondary">
          ${eventData.price} {eventData.currency}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary">Personal Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out ${
                  errors.firstName ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out ${
                  errors.lastName ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out ${
                errors.email ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out ${
                errors.phone ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary">Professional Information</h3>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-text-primary mb-2">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out"
              placeholder="Enter your job title"
            />
          </div>
        </div>

        {/* Special Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary">Special Requirements</h3>
          
          <div>
            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-text-primary mb-2">
              Dietary Restrictions
            </label>
            <textarea
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out"
              placeholder="Please specify any dietary restrictions or allergies"
            />
          </div>

          <div>
            <label htmlFor="accessibilityNeeds" className="block text-sm font-medium text-text-primary mb-2">
              Accessibility Needs
            </label>
            <textarea
              id="accessibilityNeeds"
              name="accessibilityNeeds"
              value={formData.accessibilityNeeds}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out"
              placeholder="Please specify any accessibility requirements"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-text-primary mb-2">
                Contact Name
              </label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out"
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-text-primary mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                id="emergencyPhone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out"
                placeholder="Emergency contact phone"
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-text-secondary">
              I agree to the{' '}
              <button type="button" className="text-primary hover:text-primary-700 underline">
                terms and conditions
              </button>{' '}
              and{' '}
              <button type="button" className="text-primary hover:text-primary-700 underline">
                privacy policy
              </button>
              *
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors.agreeToTerms}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="subscribeNewsletter"
              name="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label htmlFor="subscribeNewsletter" className="text-sm text-text-secondary">
              Subscribe to our newsletter for future event updates
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 ease-out ${
            isSubmitting
              ? 'bg-secondary-200 text-text-muted cursor-not-allowed' :'bg-primary text-white hover:bg-primary-700 hover:shadow-md transform hover:scale-105'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
              <span>Processing Registration...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Icon name="CreditCard" size={16} />
              <span>Complete Registration - ${eventData.price}</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;