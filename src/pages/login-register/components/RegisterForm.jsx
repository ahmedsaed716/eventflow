// src/pages/login-register/components/RegisterForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from 'components/AppIcon';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee',
    phone: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signUp, authError } = useAuth();

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const result = await signUp(
        formData.email, 
        formData.password, 
        {
          full_name: formData.fullName,
          role: formData.role,
          phone: formData.phone
        }
      );
      
      if (result.success) {
        setSuccessMessage('Registration successful! Please check your email to confirm your account.');
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (error) {
      console.log('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const roleOptions = [
    { value: 'attendee', label: 'Attendee', description: 'Register for events' },
    { value: 'usher', label: 'Usher', description: 'Help with event check-ins' },
    { value: 'manager', label: 'Manager', description: 'Manage events and users' }
  ];

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-3">
          <div className="flex items-center">
            <Icon name="CheckCircle" size={16} className="text-success mr-2" />
            <span className="text-sm text-success-600">{successMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="User" size={16} className="text-text-muted" />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out ${
                validationErrors.fullName ? 'border-error bg-error-50' : 'border-border bg-surface'
              }`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          {validationErrors.fullName && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {validationErrors.fullName}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Mail" size={16} className="text-text-muted" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out ${
                validationErrors.email ? 'border-error bg-error-50' : 'border-border bg-surface'
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
            Phone Number <span className="text-text-muted">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Phone" size={16} className="text-text-muted" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-border bg-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out"
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Role
          </label>
          <div className="space-y-2">
            {roleOptions.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={formData.role === option.value}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border"
                  disabled={isLoading}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{option.label}</div>
                  <div className="text-xs text-text-secondary">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Lock" size={16} className="text-text-muted" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out ${
                  validationErrors.password ? 'border-error bg-error-50' : 'border-border bg-surface'
                }`}
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Lock" size={16} className="text-text-muted" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ease-out ${
                  validationErrors.confirmPassword ? 'border-error bg-error-50' : 'border-border bg-surface'
                }`}
                placeholder="Confirm password"
                disabled={isLoading}
              />
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className={`mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded ${
                validationErrors.acceptTerms ? 'border-error' : ''
              }`}
              disabled={isLoading}
            />
            <span className="text-sm text-text-secondary">
              I agree to the{' '}
              <button type="button" className="text-primary hover:text-primary-700 underline">
                Terms and Conditions
              </button>
              {' '}and{' '}
              <button type="button" className="text-primary hover:text-primary-700 underline">
                Privacy Policy
              </button>
            </span>
          </label>
          {validationErrors.acceptTerms && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {validationErrors.acceptTerms}
            </p>
          )}
        </div>

        {/* Error Message */}
        {authError && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-3">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={16} className="text-error mr-2" />
              <span className="text-sm text-error">{authError}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            <>
              <Icon name="UserPlus" size={16} className="mr-2" />
              Create Account
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;