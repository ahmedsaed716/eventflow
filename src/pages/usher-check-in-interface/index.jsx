import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import QRScanner from './components/QRScanner';
import RecentCheckIns from './components/RecentCheckIns';
import EventSummaryCard from './components/EventSummaryCard';
import CheckInResult from './components/CheckInResult';
import ManualEntry from './components/ManualEntry';

const UsherCheckInInterface = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState('tech-conference-2024');
  const [isScanning, setIsScanning] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [eventStats, setEventStats] = useState({
    totalCapacity: 500,
    checkedIn: 187,
    remaining: 313
  });

  // Mock events data
  const events = [
    { id: 'tech-conference-2024', name: 'Tech Conference 2024', date: '2024-12-15', status: 'active' },
    { id: 'workshop-react', name: 'React Workshop', date: '2024-12-16', status: 'upcoming' },
    { id: 'networking-event', name: 'Networking Event', date: '2024-12-17', status: 'upcoming' }
  ];

  // Mock attendees data
  const attendees = [
    { id: 'ATT001', name: 'John Smith', email: 'john@example.com', status: 'registered', qrCode: 'QR001' },
    { id: 'ATT002', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'checked-in', qrCode: 'QR002' },
    { id: 'ATT003', name: 'Mike Wilson', email: 'mike@example.com', status: 'registered', qrCode: 'QR003' },
    { id: 'ATT004', name: 'Emily Davis', email: 'emily@example.com', status: 'registered', qrCode: 'QR004' },
    { id: 'ATT005', name: 'David Brown', email: 'david@example.com', status: 'checked-in', qrCode: 'QR005' }
  ];

  useEffect(() => {
    // Initialize recent check-ins
    setRecentCheckIns([
      { id: 1, name: 'Sarah Johnson', time: '2 min ago', status: 'success', attendeeId: 'ATT002' },
      { id: 2, name: 'David Brown', time: '5 min ago', status: 'success', attendeeId: 'ATT005' },
      { id: 3, name: 'Mike Wilson', time: '8 min ago', status: 'duplicate', attendeeId: 'ATT003' }
    ]);

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleQRScan = (qrCode) => {
    // Find attendee by QR code
    const attendee = attendees.find(att => att.qrCode === qrCode);
    
    if (!attendee) {
      setCheckInResult({
        type: 'error',
        title: 'Invalid QR Code',
        message: 'This QR code is not valid for this event.',
        attendee: null
      });
      return;
    }

    if (attendee.status === 'checked-in') {
      setCheckInResult({
        type: 'warning',
        title: 'Already Checked In',
        message: `${attendee.name} has already been checked in.`,
        attendee: attendee
      });
      return;
    }

    // Successful check-in
    attendee.status = 'checked-in';
    setEventStats(prev => ({
      ...prev,
      checkedIn: prev.checkedIn + 1,
      remaining: prev.remaining - 1
    }));

    // Add to recent check-ins
    const newCheckIn = {
      id: Date.now(),
      name: attendee.name,
      time: 'Just now',
      status: 'success',
      attendeeId: attendee.id
    };
    setRecentCheckIns(prev => [newCheckIn, ...prev.slice(0, 9)]);

    setCheckInResult({
      type: 'success',
      title: 'Welcome!',
      message: `${attendee.name} has been successfully checked in.`,
      attendee: attendee
    });

    // Play success sound (if available)
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  const handleManualCheckIn = (searchTerm) => {
    const attendee = attendees.find(att => 
      att.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (attendee) {
      handleQRScan(attendee.qrCode);
    } else {
      setCheckInResult({
        type: 'error',
        title: 'Attendee Not Found',
        message: 'No attendee found matching your search criteria.',
        attendee: null
      });
    }
  };

  const clearResult = () => {
    setCheckInResult(null);
  };

  const currentEvent = events.find(event => event.id === selectedEvent);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-16 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="QrCode" size={18} color="white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">Check-in Interface</h1>
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-error'}`} />
                  <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
                </div>
              </div>
            </div>

            {/* Event Selector */}
            <div className="flex items-center space-x-3">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => navigate('/login-register')}
                className="p-2 text-text-secondary hover:text-error transition-colors duration-200 ease-out"
                title="Logout"
              >
                <Icon name="LogOut" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 max-w-6xl mx-auto">
        {/* Event Summary Card */}
        <div className="mb-6">
          <EventSummaryCard 
            event={currentEvent}
            stats={eventStats}
          />
        </div>

        {/* Scanner and Manual Entry Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setShowManualEntry(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out ${
                !showManualEntry 
                  ? 'bg-primary text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
              }`}
            >
              <Icon name="QrCode" size={16} />
              <span>QR Scanner</span>
            </button>
            <button
              onClick={() => setShowManualEntry(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out ${
                showManualEntry 
                  ? 'bg-primary text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
              }`}
            >
              <Icon name="Search" size={16} />
              <span>Manual Entry</span>
            </button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner/Manual Entry Section */}
          <div className="space-y-6">
            {!showManualEntry ? (
              <QRScanner 
                isScanning={isScanning}
                onScan={handleQRScan}
                onToggleScanning={setIsScanning}
              />
            ) : (
              <ManualEntry 
                onSearch={handleManualCheckIn}
                attendees={attendees}
              />
            )}

            {/* Offline Notice */}
            {!isOnline && (
              <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="WifiOff" size={16} className="text-warning-600" />
                  <span className="text-sm text-warning-700 font-medium">
                    Offline Mode Active
                  </span>
                </div>
                <p className="text-xs text-warning-600 mt-1">
                  Check-ins are being cached and will sync when connection is restored.
                </p>
              </div>
            )}
          </div>

          {/* Recent Check-ins Section */}
          <div>
            <RecentCheckIns 
              checkIns={recentCheckIns}
              onViewAll={() => navigate('/attendee-management-analytics')}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin-event-management-dashboard')}
            className="flex flex-col items-center space-y-2 p-4 bg-surface border border-border rounded-lg hover:bg-secondary-50 transition-colors duration-200 ease-out"
          >
            <Icon name="LayoutDashboard" size={24} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/attendee-management-analytics')}
            className="flex flex-col items-center space-y-2 p-4 bg-surface border border-border rounded-lg hover:bg-secondary-50 transition-colors duration-200 ease-out"
          >
            <Icon name="Users" size={24} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">Attendees</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex flex-col items-center space-y-2 p-4 bg-surface border border-border rounded-lg hover:bg-secondary-50 transition-colors duration-200 ease-out"
          >
            <Icon name="RefreshCw" size={24} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">Refresh</span>
          </button>
          <button
            className="flex flex-col items-center space-y-2 p-4 bg-surface border border-border rounded-lg hover:bg-secondary-50 transition-colors duration-200 ease-out"
          >
            <Icon name="Download" size={24} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">Export</span>
          </button>
        </div>
      </div>

      {/* Check-in Result Modal */}
      {checkInResult && (
        <CheckInResult 
          result={checkInResult}
          onClose={clearResult}
        />
      )}
    </div>
  );
};

export default UsherCheckInInterface;