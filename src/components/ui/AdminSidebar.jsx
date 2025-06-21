import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/admin-event-management-dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and analytics'
    },
    {
      label: 'Event Management',
      path: '/event-creation-management',
      icon: 'Calendar',
      description: 'Create and manage events'
    },
    {
      label: 'Attendee Analytics',
      path: '/attendee-management-analytics',
      icon: 'Users',
      description: 'Attendee insights and reports'
    },
    {
      label: 'Check-in Monitor',
      path: '/usher-check-in-interface',
      icon: 'QrCode',
      description: 'Real-time check-in status'
    }
  ];

  const quickActions = [
    { label: 'New Event', icon: 'Plus', action: () => navigate('/event-creation-management') },
    { label: 'Export Data', icon: 'Download', action: () => console.log('Export data') },
    { label: 'Settings', icon: 'Settings', action: () => console.log('Settings') }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Check if current path matches admin routes
  const isAdminRoute = location.pathname.includes('admin') || 
                      location.pathname.includes('event-creation') || 
                      location.pathname.includes('attendee-management') ||
                      location.pathname.includes('usher-check-in');

  if (!isAdminRoute) {
    return null;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-900 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-20 left-4 z-1000 lg:hidden p-2 bg-surface border border-border rounded-md shadow-base"
      >
        <Icon name="Menu" size={20} />
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] bg-surface border-r border-border z-900
        transition-all duration-400 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        w-64
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Icon name="Shield" size={14} color="white" />
                </div>
                <span className="font-semibold text-text-primary">Admin Panel</span>
              </div>
            )}
            <button
              onClick={toggleCollapse}
              className="hidden lg:block p-1 text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-out group
                      ${isActive 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                      }
                      ${isCollapsed ? 'justify-center' : 'justify-start'}
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon 
                      name={item.icon} 
                      size={18} 
                      className={`flex-shrink-0 ${isActive ? 'text-white' : ''}`}
                    />
                    {!isCollapsed && (
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className={`text-xs ${isActive ? 'text-primary-100' : 'text-text-muted'}`}>
                          {item.description}
                        </div>
                      </div>
                    )}
                    {!isCollapsed && isActive && (
                      <div className="w-2 h-2 bg-white rounded-full animate-scale-in" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            {!isCollapsed && (
              <div className="pt-6">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Quick Actions
                </div>
                <div className="space-y-1">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-colors duration-200 ease-out"
                    >
                      <Icon name={action.icon} size={16} />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary">System Status</div>
                  <div className="text-xs text-success">All systems operational</div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} color="white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`
        hidden lg:block transition-all duration-400 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
      `} />
    </>
  );
};

export default AdminSidebar;