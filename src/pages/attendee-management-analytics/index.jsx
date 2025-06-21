import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import AttendeeTable from './components/AttendeeTable';
import AnalyticsPanel from './components/AnalyticsPanel';
import FilterToolbar from './components/FilterToolbar';
import BulkActionsBar from './components/BulkActionsBar';
import CommunicationModal from './components/CommunicationModal';
import ExportModal from './components/ExportModal';

const AttendeeManagementAnalytics = () => {
  const navigate = useNavigate();
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    registrationStatus: 'all',
    checkInStatus: 'all',
    paymentStatus: 'all'
  });
  const [sortConfig, setSortConfig] = useState({ key: 'registrationDate', direction: 'desc' });
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Mock event data
  const eventData = {
    id: 'evt-001',
    name: 'Tech Conference 2024',
    date: '2024-03-15',
    venue: 'Convention Center',
    capacity: 500,
    totalRegistrations: 387,
    checkedIn: 245,
    pending: 142
  };

  // Mock attendee data
  const [attendees, setAttendees] = useState([
    {
      id: 'att-001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      registrationDate: '2024-02-15T10:30:00Z',
      checkInStatus: 'checked-in',
      checkInTime: '2024-03-15T09:15:00Z',
      paymentStatus: 'paid',
      ticketType: 'VIP',
      company: 'Tech Corp',
      dietary: 'Vegetarian',
      qrCode: 'QR001234567890'
    },
    {
      id: 'att-002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0124',
      registrationDate: '2024-02-18T14:20:00Z',
      checkInStatus: 'pending',
      checkInTime: null,
      paymentStatus: 'paid',
      ticketType: 'Standard',
      company: 'Design Studio',
      dietary: 'None',
      qrCode: 'QR001234567891'
    },
    {
      id: 'att-003',
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      phone: '+1-555-0125',
      registrationDate: '2024-02-20T16:45:00Z',
      checkInStatus: 'checked-in',
      checkInTime: '2024-03-15T08:45:00Z',
      paymentStatus: 'pending',
      ticketType: 'Standard',
      company: 'Startup Inc',
      dietary: 'Vegan',
      qrCode: 'QR001234567892'
    },
    {
      id: 'att-004',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1-555-0126',
      registrationDate: '2024-02-22T11:15:00Z',
      checkInStatus: 'no-show',
      checkInTime: null,
      paymentStatus: 'paid',
      ticketType: 'VIP',
      company: 'Marketing Agency',
      dietary: 'Gluten-free',
      qrCode: 'QR001234567893'
    },
    {
      id: 'att-005',
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1-555-0127',
      registrationDate: '2024-02-25T09:30:00Z',
      checkInStatus: 'checked-in',
      checkInTime: '2024-03-15T10:20:00Z',
      paymentStatus: 'paid',
      ticketType: 'Standard',
      company: 'Consulting Group',
      dietary: 'None',
      qrCode: 'QR001234567894'
    }
  ]);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      setAttendees(prev => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        if (updated[randomIndex].checkInStatus === 'pending') {
          updated[randomIndex] = {
            ...updated[randomIndex],
            checkInStatus: 'checked-in',
            checkInTime: new Date().toISOString()
          };
        }
        return updated;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  // Filter attendees
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                         attendee.company.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesRegistration = filters.registrationStatus === 'all' || 
                               attendee.paymentStatus === filters.registrationStatus;
    
    const matchesCheckIn = filters.checkInStatus === 'all' || 
                          attendee.checkInStatus === filters.checkInStatus;
    
    const matchesPayment = filters.paymentStatus === 'all' || 
                          attendee.paymentStatus === filters.paymentStatus;

    return matchesSearch && matchesRegistration && matchesCheckIn && matchesPayment;
  });

  // Sort attendees
  const sortedAttendees = [...filteredAttendees].sort((a, b) => {
    if (sortConfig.key === 'registrationDate') {
      const aDate = new Date(a.registrationDate);
      const bDate = new Date(b.registrationDate);
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAttendees(sortedAttendees.map(a => a.id));
    } else {
      setSelectedAttendees([]);
    }
  };

  const handleSelectAttendee = (attendeeId, checked) => {
    if (checked) {
      setSelectedAttendees(prev => [...prev, attendeeId]);
    } else {
      setSelectedAttendees(prev => prev.filter(id => id !== attendeeId));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'email':
        setShowCommunicationModal(true);
        break;
      case 'check-in':
        // Handle bulk check-in
        setAttendees(prev => prev.map(attendee => 
          selectedAttendees.includes(attendee.id) 
            ? { ...attendee, checkInStatus: 'checked-in', checkInTime: new Date().toISOString() }
            : attendee
        ));
        setSelectedAttendees([]);
        break;
      case 'export':
        setShowExportModal(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 lg:pl-64">
      <div className="p-6">
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
          <span className="text-text-primary font-medium">{eventData.name}</span>
          <Icon name="ChevronRight" size={14} />
          <span className="text-text-primary">Attendees</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Attendee Management & Analytics
            </h1>
            <p className="text-text-secondary">
              Manage registrations and track attendance for {eventData.name}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Real-time toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-out ${
                  realTimeUpdates ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-out ${
                    realTimeUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-text-secondary">Real-time updates</span>
            </div>

            {/* Quick actions */}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out"
            >
              <Icon name="Download" size={16} />
              <span>Export</span>
            </button>
            
            <button
              onClick={() => setShowCommunicationModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out"
            >
              <Icon name="Mail" size={16} />
              <span>Send Email</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
          {/* Primary Panel - Attendee Table */}
          <div className="xl:col-span-7 space-y-6">
            <FilterToolbar 
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={attendees.length}
              filteredCount={filteredAttendees.length}
            />
            
            {selectedAttendees.length > 0 && (
              <BulkActionsBar
                selectedCount={selectedAttendees.length}
                onAction={handleBulkAction}
                onClear={() => setSelectedAttendees([])}
              />
            )}

            <AttendeeTable
              attendees={sortedAttendees}
              selectedAttendees={selectedAttendees}
              sortConfig={sortConfig}
              onSort={handleSort}
              onSelectAll={handleSelectAll}
              onSelectAttendee={handleSelectAttendee}
              onAttendeeUpdate={setAttendees}
            />
          </div>

          {/* Secondary Panel - Analytics */}
          <div className="xl:col-span-3">
            <AnalyticsPanel
              eventData={eventData}
              attendees={attendees}
              filteredAttendees={filteredAttendees}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCommunicationModal && (
        <CommunicationModal
          selectedAttendees={selectedAttendees.map(id => 
            attendees.find(a => a.id === id)
          ).filter(Boolean)}
          onClose={() => setShowCommunicationModal(false)}
          onSend={() => {
            setShowCommunicationModal(false);
            setSelectedAttendees([]);
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          attendees={selectedAttendees.length > 0 
            ? attendees.filter(a => selectedAttendees.includes(a.id))
            : filteredAttendees
          }
          eventName={eventData.name}
          onClose={() => setShowExportModal(false)}
          onExport={() => {
            setShowExportModal(false);
            setSelectedAttendees([]);
          }}
        />
      )}
    </div>
  );
};

export default AttendeeManagementAnalytics;