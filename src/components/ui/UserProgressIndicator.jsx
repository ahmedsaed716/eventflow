import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const UserProgressIndicator = () => {
  const location = useLocation();

  // Define progress steps for user workflow
  const progressSteps = [
    {
      id: 'browse',
      label: 'Browse Events',
      path: '/event-details-registration',
      icon: 'Search',
      description: 'Discover events'
    },
    {
      id: 'details',
      label: 'Event Details',
      path: '/event-details-registration',
      icon: 'Info',
      description: 'Review information'
    },
    {
      id: 'register',
      label: 'Registration',
      path: '/event-details-registration',
      icon: 'UserPlus',
      description: 'Complete signup'
    },
    {
      id: 'confirmation',
      label: 'Confirmation',
      path: '/event-details-registration',
      icon: 'CheckCircle',
      description: 'Registration complete'
    }
  ];

  // Determine current step based on URL parameters or state
  const getCurrentStep = () => {
    const searchParams = new URLSearchParams(location.search);
    const step = searchParams.get('step');
    
    switch (step) {
      case 'details':
        return 1;
      case 'register':
        return 2;
      case 'confirmation':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getCurrentStep();

  // Only show on user-related pages
  const isUserFlow = location.pathname.includes('event-details-registration');
  
  if (!isUserFlow) {
    return null;
  }

  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
          <span>Home</span>
          <Icon name="ChevronRight" size={14} />
          <span>Events</span>
          <Icon name="ChevronRight" size={14} />
          <span className="text-text-primary">Registration</span>
        </nav>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          {progressSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex items-center">
                  <div className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ease-out
                    ${isCompleted 
                      ? 'bg-success border-success text-white' 
                      : isCurrent 
                        ? 'bg-primary border-primary text-white animate-scale-in' :'bg-surface border-secondary-300 text-text-muted'
                    }
                  `}>
                    {isCompleted ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step.icon} size={16} />
                    )}
                    
                    {/* Pulse animation for current step */}
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full bg-primary opacity-25 animate-ping" />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium transition-colors duration-200 ease-out ${
                      isCompleted || isCurrent ? 'text-text-primary' : 'text-text-muted'
                    }`}>
                      {step.label}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < progressSteps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-0.5 transition-colors duration-300 ease-out ${
                      isCompleted ? 'bg-success' : 'bg-secondary-200'
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Step Labels */}
        <div className="sm:hidden mt-4">
          <div className="text-center">
            <div className="text-sm font-medium text-text-primary">
              {progressSteps[currentStep]?.label}
            </div>
            <div className="text-xs text-text-secondary">
              Step {currentStep + 1} of {progressSteps.length}
            </div>
          </div>
        </div>

        {/* Progress Bar (Mobile) */}
        <div className="sm:hidden mt-3">
          <div className="w-full bg-secondary-200 rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / progressSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Estimated Time */}
        {currentStep < progressSteps.length - 1 && (
          <div className="mt-4 flex items-center justify-center text-xs text-text-secondary">
            <Icon name="Clock" size={12} className="mr-1" />
            <span>Estimated time: {3 - currentStep} minutes remaining</span>
          </div>
        )}

        {/* Success Message */}
        {currentStep === progressSteps.length - 1 && (
          <div className="mt-4 p-3 bg-success-50 border border-success-100 rounded-lg">
            <div className="flex items-center">
              <Icon name="CheckCircle" size={16} className="text-success mr-2" />
              <span className="text-sm text-success-600 font-medium">
                Registration completed successfully!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProgressIndicator;