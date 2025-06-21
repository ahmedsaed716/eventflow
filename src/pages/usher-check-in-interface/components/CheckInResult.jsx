import React, { useEffect } from 'react';
import Icon from 'components/AppIcon';

const CheckInResult = ({ result, onClose }) => {
  useEffect(() => {
    // Auto-close after 3 seconds for success, 5 seconds for others
    const timeout = setTimeout(() => {
      onClose();
    }, result.type === 'success' ? 3000 : 5000);

    return () => clearTimeout(timeout);
  }, [result, onClose]);

  const getResultConfig = () => {
    switch (result.type) {
      case 'success':
        return {
          bgColor: 'bg-success',
          textColor: 'text-white',
          icon: 'CheckCircle',
          iconSize: 64,
          animation: 'animate-scale-in'
        };
      case 'error':
        return {
          bgColor: 'bg-error',
          textColor: 'text-white',
          icon: 'XCircle',
          iconSize: 64,
          animation: 'animate-shake'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning',
          textColor: 'text-white',
          icon: 'AlertCircle',
          iconSize: 64,
          animation: 'animate-bounce'
        };
      default:
        return {
          bgColor: 'bg-secondary-600',
          textColor: 'text-white',
          icon: 'Info',
          iconSize: 64,
          animation: 'animate-fade-in'
        };
    }
  };

  const config = getResultConfig();

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Result Modal */}
      <div className={`
        relative w-full max-w-md mx-auto ${config.bgColor} ${config.textColor} 
        rounded-2xl shadow-2xl ${config.animation} transform transition-all duration-300 ease-out
      `}>
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <Icon 
              name={config.icon} 
              size={config.iconSize} 
              className={`mx-auto ${config.textColor} drop-shadow-lg`}
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-3">
            {result.title}
          </h2>

          {/* Message */}
          <p className="text-lg opacity-90 mb-6">
            {result.message}
          </p>

          {/* Attendee Info */}
          {result.attendee && (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} className={config.textColor} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{result.attendee.name}</div>
                  <div className="text-sm opacity-75">{result.attendee.email}</div>
                  <div className="text-xs opacity-60">ID: {result.attendee.id}</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 ease-out"
            >
              Continue
            </button>
            
            {result.type === 'success' && result.attendee && (
              <button
                onClick={() => {
                  // Handle print badge or additional actions
                  console.log('Print badge for:', result.attendee.name);
                  onClose();
                }}
                className="flex-1 bg-white text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-200 ease-out"
              >
                Print Badge
              </button>
            )}
          </div>

          {/* Auto-close indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2 opacity-75">
            <Icon name="Clock" size={14} />
            <span className="text-xs">
              Auto-closing in {result.type === 'success' ? '3' : '5'} seconds
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 ease-out"
        >
          <Icon name="X" size={16} className={config.textColor} />
        </button>

        {/* Success Confetti Effect */}
        {result.type === 'success' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white opacity-70 animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInResult;