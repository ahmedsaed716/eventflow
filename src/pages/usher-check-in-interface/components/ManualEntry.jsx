import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const ManualEntry = ({ onSearch, attendees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Perform search when search term changes
    if (searchTerm.trim().length >= 2) {
      setIsSearching(true);
      const filtered = attendees.filter(attendee =>
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 10)); // Limit to 10 results
      setSelectedIndex(-1);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [searchTerm, attendees]);

  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectAttendee(searchResults[selectedIndex]);
        } else if (searchResults.length === 1) {
          handleSelectAttendee(searchResults[0]);
        } else if (searchTerm.trim()) {
          handleManualSearch();
        }
        break;
      case 'Escape': setSearchTerm('');
        setSearchResults([]);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectAttendee = (attendee) => {
    setSearchTerm(attendee.name);
    setSearchResults([]);
    setSelectedIndex(-1);
    onSearch(attendee.name);
  };

  const handleManualSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm('');
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'checked-in':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
            <Icon name="CheckCircle" size={12} className="mr-1" />
            Checked In
          </span>
        );
      case 'registered':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
            <Icon name="Clock" size={12} className="mr-1" />
            Registered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
            <Icon name="User" size={12} className="mr-1" />
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Manual Entry</h3>
        <p className="text-sm text-text-secondary">
          Search by name, email, or registration ID
        </p>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={20} className="text-text-secondary" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter attendee name, email, or ID..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
                setSelectedIndex(-1);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <Icon name="X" size={20} className="text-text-secondary hover:text-text-primary" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleManualSearch}
          disabled={!searchTerm.trim()}
          className="w-full mt-3 flex items-center justify-center space-x-2 py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors duration-200 ease-out"
        >
          <Icon name="UserPlus" size={20} />
          <span>Check In Attendee</span>
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border-t border-border">
          <div className="p-3 bg-secondary-50">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-secondary">
                {searchResults.length} attendee{searchResults.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {searchResults.map((attendee, index) => (
              <button
                key={attendee.id}
                onClick={() => handleSelectAttendee(attendee)}
                className={`w-full p-4 text-left hover:bg-secondary-50 transition-colors duration-150 ease-out border-b border-border last:border-b-0 ${
                  index === selectedIndex ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={16} className="text-text-secondary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {attendee.name}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {attendee.email}
                        </p>
                        <p className="text-xs text-text-muted">
                          ID: {attendee.id}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {getStatusBadge(attendee.status)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching && (
        <div className="p-8 text-center border-t border-border">
          <Icon name="UserX" size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-secondary font-medium">No attendees found</p>
          <p className="text-sm text-text-muted mt-1">
            Try searching with a different name, email, or ID
          </p>
        </div>
      )}

      {/* Search Tips */}
      <div className="p-4 bg-secondary-50 border-t border-border">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-primary-700">
            <p className="font-medium mb-1">Search Tips:</p>
            <ul className="text-xs space-y-1 text-primary-600">
              <li>• Use arrow keys to navigate results</li>
              <li>• Press Enter to select highlighted result</li>
              <li>• Search works with partial names and emails</li>
              <li>• Registration IDs are case-insensitive</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 py-2 px-3 bg-secondary-100 text-text-secondary rounded-md text-sm font-medium hover:bg-secondary-200 transition-colors duration-200 ease-out">
            <Icon name="Download" size={16} />
            <span>Export List</span>
          </button>
          <button className="flex items-center justify-center space-x-2 py-2 px-3 bg-secondary-100 text-text-secondary rounded-md text-sm font-medium hover:bg-secondary-200 transition-colors duration-200 ease-out">
            <Icon name="RefreshCw" size={16} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualEntry;