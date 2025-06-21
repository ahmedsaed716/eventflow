import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import EventFormWizard from './components/EventFormWizard';
import EventPreview from './components/EventPreview';



const EventCreationManagement = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [eventData, setEventData] = useState({
    // Basic Info
    title: '',
    description: '',
    category: '',
    image: null,
    imagePreview: '',
    
    // Schedule & Location
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: 'UTC',
    venue: '',
    address: '',
    isOnline: false,
    meetingLink: '',
    
    // Registration Settings
    capacity: '',
    price: 0,
    currency: 'USD',
    registrationDeadline: '',
    requiresApproval: false,
    enableWaitlist: false,
    
    // Advanced Options
    customFields: [],
    notifications: {
      registration: true,
      reminder: true,
      updates: true
    },
    tags: [],
    isRecurring: false,
    recurringPattern: 'weekly'
  });

  const [errors, setErrors] = useState({});
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Corporate Conference",
      description: "Professional conference template with networking sessions",
      category: "business",
      thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Workshop Series",
      description: "Educational workshop with hands-on activities",
      category: "education",
      thumbnail: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Community Meetup",
      description: "Casual networking event for community building",
      category: "networking",
      thumbnail: "https://images.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg?w=300&h=200&fit=crop"
    }
  ]);

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: 'Info' },
    { id: 'schedule', label: 'Schedule & Location', icon: 'Calendar' },
    { id: 'registration', label: 'Registration', icon: 'Users' },
    { id: 'advanced', label: 'Advanced', icon: 'Settings' }
  ];

  const categories = [
    { value: 'business', label: 'Business & Professional' },
    { value: 'education', label: 'Education & Learning' },
    { value: 'technology', label: 'Technology & Innovation' },
    { value: 'networking', label: 'Networking & Social' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'other', label: 'Other' }
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (eventData.title || eventData.description) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [eventData]);

  const handleAutoSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const handleInputChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setEventData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEventData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    
    switch (stepIndex) {
      case 0: // Basic Info
        if (!eventData.title.trim()) newErrors.title = 'Event title is required';
        if (!eventData.description.trim()) newErrors.description = 'Event description is required';
        if (!eventData.category) newErrors.category = 'Please select a category';
        break;
        
      case 1: // Schedule & Location
        if (!eventData.startDate) newErrors.startDate = 'Start date is required';
        if (!eventData.startTime) newErrors.startTime = 'Start time is required';
        if (!eventData.endDate) newErrors.endDate = 'End date is required';
        if (!eventData.endTime) newErrors.endTime = 'End time is required';
        if (!eventData.isOnline && !eventData.venue.trim()) newErrors.venue = 'Venue is required for in-person events';
        if (eventData.isOnline && !eventData.meetingLink.trim()) newErrors.meetingLink = 'Meeting link is required for online events';
        break;
        
      case 2: // Registration
        if (!eventData.capacity || eventData.capacity <= 0) newErrors.capacity = 'Valid capacity is required';
        if (!eventData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= currentStep || validateStep(currentStep)) {
      setCurrentStep(stepIndex);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastSaved(new Date());
    setIsSaving(false);
    alert('Draft saved successfully!');
  };

  const handlePublish = async () => {
    // Validate all steps
    let allValid = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setCurrentStep(i);
        break;
      }
    }
    
    if (allValid) {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSaving(false);
      alert('Event published successfully!');
      navigate('/admin-event-management-dashboard');
    }
  };

  const handleTemplateSelect = (template) => {
    setEventData(prev => ({
      ...prev,
      title: template.name,
      description: template.description,
      category: template.category,
      imagePreview: template.thumbnail
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-16 lg:pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
          <button 
            onClick={() => navigate('/admin-event-management-dashboard')}
            className="hover:text-text-primary transition-colors duration-200 ease-out"
          >
            Dashboard
          </button>
          <Icon name="ChevronRight" size={14} />
          <span>Events</span>
          <Icon name="ChevronRight" size={14} />
          <span className="text-text-primary">Create New Event</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Create New Event</h1>
            <p className="text-text-secondary">
              Set up your event with comprehensive details and registration settings
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Auto-save Status */}
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              {isSaving ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Icon name="Check" size={16} className="text-success" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </>
              ) : null}
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out"
              >
                <Icon name="Eye" size={16} />
                <span>Preview</span>
              </button>
              
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors duration-200 ease-out disabled:opacity-50"
              >
                <Icon name="Save" size={16} />
                <span>Save Draft</span>
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out disabled:opacity-50"
              >
                <Icon name="Send" size={16} />
                <span>Publish Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        {!eventData.title && (
          <div className="mb-8 p-6 bg-surface border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Start with a Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left p-4 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 ease-out group"
                >
                  <div className="aspect-video mb-3 overflow-hidden rounded-md">
                    <Image
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ease-out"
                    />
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">{template.name}</h4>
                  <p className="text-sm text-text-secondary">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="xl:col-span-3">
            <div className="bg-surface border border-border rounded-lg shadow-base">
              {/* Step Progress */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => handleStepClick(index)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ease-out ${
                          index === currentStep
                            ? 'bg-primary text-white'
                            : index < currentStep
                            ? 'bg-success text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
                        }`}
                      >
                        <Icon 
                          name={index < currentStep ? 'Check' : step.icon} 
                          size={16} 
                        />
                        <span className="hidden sm:inline">{step.label}</span>
                      </button>
                      
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-2 ${
                          index < currentStep ? 'bg-success' : 'bg-secondary-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <EventFormWizard
                  currentStep={currentStep}
                  eventData={eventData}
                  errors={errors}
                  categories={categories}
                  onInputChange={handleInputChange}
                  onNestedInputChange={handleNestedInputChange}
                  onImageUpload={handleImageUpload}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-6 border-t border-border">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="ChevronLeft" size={16} />
                  <span>Previous</span>
                </button>

                <div className="text-sm text-text-secondary">
                  Step {currentStep + 1} of {steps.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <Icon name="ChevronRight" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <EventPreview eventData={eventData} />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-1000 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">Event Preview</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="p-6">
              <EventPreview eventData={eventData} isFullPreview={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCreationManagement;