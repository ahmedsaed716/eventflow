import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import EventHero from './components/EventHero';
import EventDescription from './components/EventDescription';
import RegistrationForm from './components/RegistrationForm';
import RelatedEvents from './components/RelatedEvents';
import QRCodePreview from './components/QRCodePreview';

const EventDetailsRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState('details');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // Mock event data
  const eventData = {
    id: 'evt_001',
    title: 'Tech Innovation Summit 2024',
    category: 'Technology',
    date: '2024-03-15',
    time: '09:00 AM - 06:00 PM',
    location: 'Convention Center, Downtown',
    address: '123 Main Street, City Center, State 12345',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    capacity: 500,
    registered: 347,
    price: 149,
    currency: 'USD',
    registrationDeadline: '2024-03-10',
    description: `Join us for the most anticipated technology event of the year! The Tech Innovation Summit 2024 brings together industry leaders, innovative startups, and technology enthusiasts for a full day of inspiring talks, networking opportunities, and hands-on workshops.

This year's summit focuses on emerging technologies that are reshaping our world, including artificial intelligence, blockchain, sustainable tech solutions, and the future of work. You'll have the opportunity to learn from renowned speakers, participate in interactive sessions, and connect with like-minded professionals from around the globe.

Whether you're a seasoned tech professional, an entrepreneur looking for the next big opportunity, or simply curious about the future of technology, this event offers valuable insights and networking opportunities that will help advance your career and expand your knowledge.`,
    agenda: [
      { time: '09:00 AM', title: 'Registration & Welcome Coffee', speaker: '' },
      { time: '09:30 AM', title: 'Opening Keynote: The Future of AI', speaker: 'Dr. Sarah Chen, AI Research Director' },
      { time: '10:30 AM', title: 'Panel: Sustainable Technology Solutions', speaker: 'Industry Leaders Panel' },
      { time: '11:30 AM', title: 'Networking Break', speaker: '' },
      { time: '12:00 PM', title: 'Workshop: Blockchain Fundamentals', speaker: 'Mark Rodriguez, Blockchain Expert' },
      { time: '01:00 PM', title: 'Lunch & Networking', speaker: '' },
      { time: '02:00 PM', title: 'Startup Pitch Competition', speaker: 'Emerging Startups' },
      { time: '03:30 PM', title: 'Coffee Break', speaker: '' },
      { time: '04:00 PM', title: 'The Future of Remote Work', speaker: 'Lisa Thompson, HR Innovation Lead' },
      { time: '05:00 PM', title: 'Closing Remarks & Networking', speaker: '' }
    ],
    speakers: [
      {
        name: 'Dr. Sarah Chen',title: 'AI Research Director',company: 'TechCorp',image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',bio: 'Leading AI researcher with 15+ years of experience in machine learning and neural networks.'
      },
      {
        name: 'Mark Rodriguez',title: 'Blockchain Expert',company: 'CryptoSolutions',image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',bio: 'Blockchain pioneer and consultant helping enterprises adopt distributed ledger technologies.'
      },
      {
        name: 'Lisa Thompson',title: 'HR Innovation Lead',company: 'FutureWork Inc',image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',bio: 'Expert in remote work strategies and digital transformation in human resources.'
      }
    ],
    requirements: [
      'Laptop or tablet for workshop participation','Business attire recommended','Valid ID for registration check-in','Networking materials (business cards, etc.)'
    ],
    organizer: {
      name: 'TechEvents Global',email: 'info@techevents.com',phone: '+1 (555) 123-4567',website: 'www.techevents.com',image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'
    },
    cancellationPolicy: `Full refund available until 7 days before the event. 50% refund available until 3 days before the event. No refunds available within 3 days of the event date.`,
    tags: ['Technology', 'AI', 'Blockchain', 'Innovation', 'Networking']
  };

  const relatedEvents = [
    {
      id: 'evt_002',
      title: 'Digital Marketing Masterclass',
      date: '2024-03-22',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
      price: 99,
      location: 'Online Event'
    },
    {
      id: 'evt_003',
      title: 'Startup Funding Workshop',
      date: '2024-03-28',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop',
      price: 75,
      location: 'Business Hub'
    },
    {
      id: 'evt_004',
      title: 'UX/UI Design Conference',
      date: '2024-04-05',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=300&h=200&fit=crop',
      price: 129,
      location: 'Design Center'
    }
  ];

  useEffect(() => {
    const step = searchParams.get('step');
    if (step) {
      setCurrentStep(step);
    }
  }, [searchParams]);

  const handleRegistration = (formData) => {
    setRegistrationData(formData);
    setIsRegistered(true);
    setShowQRCode(true);
    setCurrentStep('confirmation');
    
    // Update URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('step', 'confirmation');
    navigate(`/event-details-registration?${newSearchParams.toString()}`, { replace: true });
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('step', step);
    navigate(`/event-details-registration?${newSearchParams.toString()}`, { replace: true });
  };

  const calculateDaysUntilDeadline = () => {
    const deadline = new Date(eventData.registrationDeadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeadline = calculateDaysUntilDeadline();
  const availableSpots = eventData.capacity - eventData.registered;
  const registrationProgress = (eventData.registered / eventData.capacity) * 100;

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => navigate('/login-register')}
              className="text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out"
            >
              Browse
            </button>
            <Icon name="ChevronRight" size={14} className="text-text-muted" />
            <span className="text-text-secondary">{eventData.category}</span>
            <Icon name="ChevronRight" size={14} className="text-text-muted" />
            <span className="text-text-primary font-medium">{eventData.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Hero */}
            <EventHero 
              eventData={eventData}
              availableSpots={availableSpots}
              registrationProgress={registrationProgress}
              daysUntilDeadline={daysUntilDeadline}
              onRegisterClick={() => handleStepChange('register')}
            />

            {/* Event Description */}
            <EventDescription eventData={eventData} />

            {/* Social Sharing */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Share This Event</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 ease-out">
                  <Icon name="Facebook" size={16} />
                  <span>Facebook</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 ease-out">
                  <Icon name="Twitter" size={16} />
                  <span>Twitter</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 ease-out">
                  <Icon name="MessageCircle" size={16} />
                  <span>WhatsApp</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-text-secondary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out">
                  <Icon name="Link" size={16} />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>

            {/* Related Events */}
            <RelatedEvents events={relatedEvents} />
          </div>

          {/* Right Column - Registration */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {!isRegistered ? (
                <RegistrationForm 
                  eventData={eventData}
                  onSubmit={handleRegistration}
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                />
              ) : (
                <QRCodePreview 
                  eventData={eventData}
                  registrationData={registrationData}
                />
              )}

              {/* Event Organizer */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Event Organizer</h3>
                <div className="flex items-start space-x-4">
                  <Image 
                    src={eventData.organizer.image}
                    alt={eventData.organizer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{eventData.organizer.name}</h4>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <Icon name="Mail" size={14} />
                        <span>{eventData.organizer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <Icon name="Phone" size={14} />
                        <span>{eventData.organizer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <Icon name="Globe" size={14} />
                        <span>{eventData.organizer.website}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Deadline */}
              {daysUntilDeadline > 0 && (
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Clock" size={16} className="text-accent" />
                    <span className="font-medium text-accent-600">Registration Deadline</span>
                  </div>
                  <p className="text-sm text-accent-600">
                    {daysUntilDeadline} days remaining to register
                  </p>
                  <div className="mt-2 text-xs text-accent-500">
                    Deadline: {new Date(eventData.registrationDeadline).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Cancellation Policy */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-3">Cancellation Policy</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {eventData.cancellationPolicy}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsRegistration;