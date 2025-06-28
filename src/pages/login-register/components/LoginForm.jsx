// src/pages/login-register/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { checkNetworkStatus } from '../../../utils/supabase';
import Icon from 'components/AppIcon';
import DebugPanel from '../../../components/ui/DebugPanel';
import debugService from '../../../utils/debugService';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [networkError, setNetworkError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(checkNetworkStatus());
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  const { signIn, authError } = useAuth();
  const isDevelopment = debugService.isEnabled();

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(checkNetworkStatus());
      setNetworkError(null);
    };
    
    const handleOffline = () => {
      setNetworkStatus(checkNetworkStatus());
      setNetworkError({
        title: 'Connection Lost',
        message: 'You appear to be offline. Please check your internet connection.',
        suggestions: [
          'Check your internet connection',
          'Try connecting to a different network',
          'Contact your network administrator if using corporate wifi'
        ]
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
    
    // Check network status before attempting login
    if (!networkStatus.online) {
      setNetworkError({
        title: 'No Internet Connection',
        message: 'You must be online to sign in.',
        suggestions: [
          'Check your internet connection',
          'Try connecting to Wi-Fi or mobile data',
          'Try again once you have a stable connection'
        ]
      });
      return;
    }
    
    setIsLoading(true);
    setNetworkError(null);
    
    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success && result.data?.user) {
        // Get user profile to determine role
        const userMetadata = result.data.user.user_metadata || {};
        const role = userMetadata.role || 'attendee';
        onSuccess?.(role);
      } else if (result.code === 'NETWORK_ERROR' || result.code === 'TIMEOUT_ERROR' || result.code === 'CONNECTION_FAILED') {
        setNetworkError({
          title: result.code === 'TIMEOUT_ERROR' ? 'Connection Timeout' : 'Connection Error',
          message: result.error,
          details: result.details,
          suggestions: [
            'Check your internet connection',
            'Try refreshing the page',
            'Wait a moment and try again',
            'Contact support if the problem persists'
          ]
        });
      } else if (result.code === 'OFFLINE_ERROR') {
        setNetworkError({
          title: 'Offline',
          message: result.error,
          suggestions: [
            'Check your internet connection',
            'Try connecting to Wi-Fi or mobile data',
            'Try again once you have a stable connection'
          ]
        });
      } else if (result.code === 'INVALID_CREDENTIALS' && isDevelopment) {
        // Enhanced error for development mode
        setNetworkError({
          title: 'Invalid Credentials - Debug Info Available',
          message: result.error,
          debugInfo: result.debug,
          suggestions: [
            'Try using the demo credentials provided',
            'Verify the database is properly seeded',
            'Check the debug panel for detailed diagnostics',
            'Ensure Supabase project is active'
          ]
        });
      }
    } catch (error) {
      console.log('Login error:', error);
      setNetworkError({
        title: 'Unexpected Error',
        message: 'Something went wrong. Please try again.',
        suggestions: [
          'Refresh the page and try again',
          'Clear your browser cache',
          'Try using a different browser'
        ]
      });
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
    
    // Clear network error when user makes changes
    if (networkError) {
      setNetworkError(null);
    }
  };

  // Retry connection function
  const retryConnection = () => {
    setNetworkError(null);
    setNetworkStatus(checkNetworkStatus());
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
    setNetworkError(null);
  };

  return (
    <div className="space-y-6">
      {/* Development Debug Section */}
      {isDevelopment && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="Bug" size={20} className="text-red-500 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Development Debug Mode</h4>
                <p className="text-xs text-red-700">Troubleshooting tools available for login issues</p>
              </div>
            </div>
            <button
              onClick={() => setShowDebugPanel(true)}
              className="px-3 py-1.5 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200 transition-colors"
            >
              Open Debug Panel
            </button>
          </div>
        </div>
      )}

      {/* Network Status Indicator */}
      {!networkStatus.online && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-center">
            <Icon name="WifiOff" size={20} className="text-warning mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-warning-800">Offline</h4>
              <p className="text-xs text-warning-700">You are currently offline. Internet connection is required to sign in.</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Network Error Alert with Debug Info */}
      {networkError && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex items-start">
            <Icon name="AlertTriangle" size={20} className="text-error mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-error mb-1">{networkError.title}</h4>
              <p className="text-sm text-error-700 mb-2">{networkError.message}</p>
              {networkError.details && (
                <p className="text-xs text-error-600 mb-2">{networkError.details}</p>
              )}
              {networkError.debugInfo && isDevelopment && (
                <div className="bg-error-100 border border-error-200 rounded p-2 mb-2">
                  <p className="text-xs font-medium text-error-800">Debug Information:</p>
                  <pre className="text-xs text-error-700 mt-1">
                    {JSON.stringify(networkError.debugInfo, null, 2)}
                  </pre>
                </div>
              )}
              <div className="text-xs text-error-600">
                <p className="font-medium mb-1">Try the following:</p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  {networkError.suggestions?.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={retryConnection}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-error-700 bg-error-100 border border-error-300 rounded hover:bg-error-200 transition-colors"
                  >
                    <Icon name="RefreshCw" size={12} className="mr-1" />
                    Retry Connection
                  </button>
                  {isDevelopment && (
                    <button
                      type="button"
                      onClick={() => setShowDebugPanel(true)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded hover:bg-red-200 transition-colors"
                    >
                      <Icon name="Settings" size={12} className="mr-1" />
                      Debug Tools
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              disabled={isLoading}
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
        {authError && !networkError && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-3">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={16} className="text-error mr-2" />
              <span className="text-sm text-error">{authError}</span>
            </div>
          </div>
        )}

        {/* Submit Button with enhanced disabled state */}
        <button
          type="submit"
          disabled={isLoading || !networkStatus.online}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          ) : !networkStatus.online ? (
            <>
              <Icon name="WifiOff" size={16} className="mr-2" />
              Offline
            </>
          ) : (
            <>
              <Icon name="LogIn" size={16} className="mr-2" />
              Sign In
            </>
          )}
        </button>

        {/* Connection Status Info */}
        {networkStatus.online && (
          <div className="text-center">
            <div className="inline-flex items-center text-xs text-success">
              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
              Connected
            </div>
          </div>
        )}
      </form>

      {/* Debug Panel */}
      <DebugPanel
        isVisible={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
      />
    </div>
  );
};

export default LoginForm;