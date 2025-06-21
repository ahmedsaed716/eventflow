import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

import QuickStatsCards from './components/QuickStatsCards';
import EventsTable from './components/EventsTable';
import RecentActivity from './components/RecentActivity';
import QuickEventForm from './components/QuickEventForm';
import FilterToolbar from './components/FilterToolbar';

const AdminEventManagementDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table'); // table or calendar
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    category: 'all',
    status: 'all',
    capacity: 'all'
  });

  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Tech Conference 2024",
      date: "2024-03-15",
      time: "09:00",
      category: "Technology",
      capacity: 500,
      registrations: 387,
      status: "published",
      location: "Convention Center",
      description: `Join us for the biggest technology conference of the year featuring industry leaders, innovative workshops, and networking opportunities.

This comprehensive event will cover emerging technologies, AI developments, and digital transformation strategies that are shaping the future of business.`,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      createdAt: "2024-01-15",
      lastUpdated: "2024-02-20"
    },
    {
      id: 2,
      name: "Marketing Summit",
      date: "2024-03-22",
      time: "10:00",
      category: "Business",
      capacity: 300,
      registrations: 245,
      status: "published",
      location: "Business Center",
      description: `Discover the latest marketing trends and strategies from industry experts. Learn about digital marketing, content creation, and brand building.

Network with marketing professionals and gain insights into successful campaign strategies that drive real business results.`,
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400&h=250&fit=crop",
      createdAt: "2024-01-20",
      lastUpdated: "2024-02-18"
    },
    {
      id: 3,
      name: "Design Workshop",
      date: "2024-03-28",
      time: "14:00",
      category: "Creative",
      capacity: 150,
      registrations: 89,
      status: "draft",
      location: "Creative Studio",
      description: `Hands-on design workshop covering UI/UX principles, design thinking methodologies, and practical design tools.

Perfect for designers, developers, and anyone interested in creating better user experiences through thoughtful design.`,
      image: "https://images.pixabay.com/photo/2016/11/19/14/00/code-1839406_960_720.jpg?w=400&h=250&fit=crop",
      createdAt: "2024-02-01",
      lastUpdated: "2024-02-25"
    },
    {
      id: 4,
      name: "Healthcare Innovation Forum",
      date: "2024-04-05",
      time: "09:30",
      category: "Healthcare",
      capacity: 400,
      registrations: 312,
      status: "published",
      location: "Medical Center",
      description: `Explore the future of healthcare through innovative technologies, telemedicine, and patient care improvements.

Connect with healthcare professionals, researchers, and technology innovators working to transform the healthcare industry.`,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      createdAt: "2024-02-10",
      lastUpdated: "2024-02-28"
    },
    {
      id: 5,
      name: "Startup Pitch Competition",
      date: "2024-04-12",
      time: "18:00",
      category: "Business",
      capacity: 200,
      registrations: 156,
      status: "published",
      location: "Innovation Hub",
      description: `Watch emerging startups pitch their innovative ideas to a panel of investors and industry experts.

Network with entrepreneurs, investors, and business leaders while discovering the next generation of groundbreaking companies.`,
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=400&h=250&fit=crop",
      createdAt: "2024-02-15",
      lastUpdated: "2024-03-01"
    }
  ]);

  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 5,
    activeEvents: 4,
    totalRegistrations: 1189,
    avgAttendanceRate: 78,
    upcomingEvents: 3,
    draftEvents: 1
  });

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedEvents.length === 0) return;

    switch (action) {
      case 'publish':
        setEvents(prev => prev.map(event => 
          selectedEvents.includes(event.id) 
            ? { ...event, status: 'published' }
            : event
        ));
        break;
      case 'cancel':
        setEvents(prev => prev.map(event => 
          selectedEvents.includes(event.id) 
            ? { ...event, status: 'cancelled' }
            : event
        ));
        break;
      case 'export':
        console.log('Exporting events:', selectedEvents);
        break;
      case 'delete':
        setEvents(prev => prev.filter(event => !selectedEvents.includes(event.id)));
        break;
    }
    setSelectedEvents([]);
  };

  // Handle event actions
  const handleEventAction = (eventId, action) => {
    switch (action) {
      case 'edit': navigate('/event-creation-management', { state: { eventId } });
        break;
      case 'duplicate':
        const eventToDuplicate = events.find(e => e.id === eventId);
        if (eventToDuplicate) {
          const newEvent = {
            ...eventToDuplicate,
            id: Date.now(),
            name: `${eventToDuplicate.name} (Copy)`,
            status: 'draft',
            registrations: 0,
            createdAt: new Date().toISOString().split('T')[0]
          };
          setEvents(prev => [newEvent, ...prev]);
        }
        break;
      case 'delete':
        setEvents(prev => prev.filter(event => event.id !== eventId));
        break;
      case 'view-attendees': navigate('/attendee-management-analytics', { state: { eventId } });
        break;
      case 'toggle-status':
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                status: event.status === 'published' ? 'draft' : 'published' 
              }
            : event
        ));
        break;
    }
  };

  // Filter events based on current filters
  const filteredEvents = events.filter(event => {
    if (filters.category !== 'all' && event.category !== filters.category) return false;
    if (filters.status !== 'all' && event.status !== filters.status) return false;
    
    if (filters.dateRange !== 'all') {
      const eventDate = new Date(event.date);
      const now = new Date();
      const daysDiff = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case 'upcoming':
          if (daysDiff < 0) return false;
          break;
        case 'this-week':
          if (daysDiff < 0 || daysDiff > 7) return false;
          break;
        case 'this-month':
          if (daysDiff < 0 || daysDiff > 30) return false;
          break;
        case 'past':
          if (daysDiff >= 0) return false;
          break;
      }
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background pt-16 lg:pl-64">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Event Management Dashboard
              </h1>
              <p className="text-text-secondary">
                Manage your events, track registrations, and monitor performance
              </p>
            </div>
            
            {/* Primary Actions */}
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-text-secondary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out"
              >
                <Icon name={viewMode === 'table' ? 'Calendar' : 'Table'} size={16} />
                <span>{viewMode === 'table' ? 'Calendar View' : 'Table View'}</span>
              </button>
              
              <button
                onClick={() => navigate('/event-creation-management')}
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out"
              >
                <Icon name="Plus" size={16} />
                <span>Create Event</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <QuickStatsCards stats={dashboardStats} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Primary Content Area */}
          <div className="xl:col-span-8 space-y-6">
            {/* Filter Toolbar */}
            <FilterToolbar 
              filters={filters}
              onFiltersChange={setFilters}
              selectedCount={selectedEvents.length}
              onBulkAction={handleBulkAction}
            />

            {/* Events Table */}
            <EventsTable
              events={filteredEvents}
              selectedEvents={selectedEvents}
              onSelectionChange={setSelectedEvents}
              onEventAction={handleEventAction}
              viewMode={viewMode}
            />
          </div>

          {/* Secondary Panel */}
          <div className="xl:col-span-4 space-y-6">
            {/* Quick Event Creation */}
            <QuickEventForm onEventCreate={(newEvent) => {
              setEvents(prev => [{ ...newEvent, id: Date.now() }, ...prev]);
            }} />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventManagementDashboard;