import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-secondary-100 rounded-full flex items-center justify-center mb-6">
            <Icon name="AlertCircle" size={64} className="text-secondary-400" />
          </div>
          <h1 className="text-6xl font-bold text-text-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h2>
          <p className="text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => navigate('/login-register')}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out"
          >
            <Icon name="Home" size={20} />
            <span>Go to Home</span>
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-text-secondary mb-4">Need help?</p>
          <div className="flex justify-center space-x-6">
            <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 ease-out">
              Contact Support
            </button>
            <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 ease-out">
              FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;