// src/pages/login-register/components/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from 'components/AppIcon';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { signIn, authError } = useAuth();

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success && result.data?.user) {
        // Get user profile to determine role
        const userMetadata = result.data.user.user_metadata || {};
        const role = userMetadata.role || 'attendee';
        onSuccess?.(role);
      }
    } catch (error) {
      console.log('Login error:', error);
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

  // Demo credentials for testing
  const demoCredentials = [
    { email: 'admin@eventflow.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@eventflow.com', password: 'manager123', role: 'Manager' },
    { email: 'usher@eventflow.com', password: 'usher123', role: 'Usher' },
    { email: 'attendee@eventflow.com', password: 'attendee123', role: 'Attendee' }
  ];

  const fillDemoCredentials = (email, password) => {
    setFormData(prev => ({ ...prev, email, password }));
    setValidationErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Demo Credentials */}
      <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-accent-800 mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2" />
          Demo Credentials
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {demoCredentials.map((cred, index) => (
            <button
              key={index}
              type="button"
              onClick={() => fillDemoCredentials(cred.email, cred.password)}
              className="text-xs text-left p-2 bg-white border border-accent-200 rounded hover:bg-accent-50 transition-colors"
            >
              <div className="font-medium text-accent-700">{cred.role}</div>
              <div className="text-accent-600">{cred.email}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-text-secondary">Remember me</span>
          </label>
          
          <button
            type="button"
            className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 ease-out"
            disabled={isLoading}
          >
            Forgot password?
          </button>
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
              Signing in...
            </>
          ) : (
            <>
              <Icon name="LogIn" size={16} className="mr-2" />
              Sign In
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;