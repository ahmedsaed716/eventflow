import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const RoleBasedHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('guest'); // guest, user, admin, usher
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Determine user role based on current path
    const path = location.pathname;
    if (path.includes('admin') || path.includes('event-creation') || path.includes('attendee-management')) {
      setUserRole('admin');
    } else if (path.includes('usher') || path.includes('check-in')) {
      setUserRole('usher');
    } else if (path.includes('event-details')) {
      setUserRole('user');
    } else {
      setUserRole('guest');
    }
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login-register');
    setIsMenuOpen(false);
  };

  const getNavigationItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin-event-management-dashboard', icon: 'LayoutDashboard' },
          { label: 'Create Event', path: '/event-creation-management', icon: 'Plus' },
          { label: 'Attendee Analytics', path: '/attendee-management-analytics', icon: 'Users' },
        ];
      case 'user':
        return [
          { label: 'Browse Events', path: '/event-details-registration', icon: 'Calendar' },
        ];
      case 'usher':
        return [
          { label: 'Check-in', path: '/usher-check-in-interface', icon: 'QrCode' },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-surface border-b border-border shadow-base">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer transition-transform duration-200 ease-out hover:scale-105"
            onClick={() => handleNavigation('/')}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary font-heading">
                EventFlow
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {navigationItems.length > 0 && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-out ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {userRole !== 'guest' && (
              <>
                {/* Notifications (Admin only) */}
                {userRole === 'admin' && (
                  <button className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out">
                    <Icon name="Bell" size={20} />
                  </button>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-colors duration-200 ease-out"
                  >
                    <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} />
                    </div>
                    <Icon name="ChevronDown" size={16} />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-floating z-1100 animate-fade-in">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-text-secondary border-b border-border">
                          <div className="font-medium text-text-primary">
                            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} User
                          </div>
                          <div className="text-xs">user@eventflow.com</div>
                        </div>
                        <button
                          onClick={() => handleNavigation('/profile')}
                          className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-colors duration-150 ease-out"
                        >
                          <Icon name="Settings" size={16} className="mr-3" />
                          Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error-50 transition-colors duration-150 ease-out"
                        >
                          <Icon name="LogOut" size={16} className="mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Login Button for Guests */}
            {userRole === 'guest' && (
              <button
                onClick={() => handleNavigation('/login-register')}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200 ease-out"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            {navigationItems.length > 0 && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out"
              >
                <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && navigationItems.length > 0 && (
          <div className="md:hidden border-t border-border bg-surface animate-slide-in">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center w-full space-x-3 px-4 py-3 text-sm font-medium transition-colors duration-200 ease-out ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary-50 border-r-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default RoleBasedHeader;