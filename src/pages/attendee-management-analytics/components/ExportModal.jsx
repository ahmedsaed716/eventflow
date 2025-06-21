import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExportModal = ({ attendees, eventName, onClose, onExport }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    fields: {
      name: true,
      email: true,
      phone: true,
      company: true,
      registrationDate: true,
      checkInStatus: true,
      checkInTime: false,
      paymentStatus: true,
      ticketType: true,
      dietary: false,
      qrCode: false
    },
    filters: {
      checkedInOnly: false,
      paidOnly: false,
      includeNoShow: true
    }
  });

  const [isExporting, setIsExporting] = useState(false);

  const availableFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'email', label: 'Email Address', required: true },
    { key: 'phone', label: 'Phone Number', required: false },
    { key: 'company', label: 'Company', required: false },
    { key: 'registrationDate', label: 'Registration Date', required: false },
    { key: 'checkInStatus', label: 'Check-in Status', required: false },
    { key: 'checkInTime', label: 'Check-in Time', required: false },
    { key: 'paymentStatus', label: 'Payment Status', required: false },
    { key: 'ticketType', label: 'Ticket Type', required: false },
    { key: 'dietary', label: 'Dietary Requirements', required: false },
    { key: 'qrCode', label: 'QR Code', required: false }
  ];

  const exportFormats = [
    { value: 'csv', label: 'CSV (Comma Separated)', icon: 'FileText', description: 'Best for spreadsheet applications' },
    { value: 'excel', label: 'Excel (.xlsx)', icon: 'FileSpreadsheet', description: 'Native Excel format with formatting' },
    { value: 'pdf', label: 'PDF Report', icon: 'FileText', description: 'Formatted report for printing' },
    { value: 'json', label: 'JSON Data', icon: 'Code', description: 'Raw data for developers' }
  ];

  const handleFieldToggle = (fieldKey) => {
    setExportConfig(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldKey]: !prev.fields[fieldKey]
      }
    }));
  };

  const handleFilterToggle = (filterKey) => {
    setExportConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterKey]: !prev.filters[filterKey]
      }
    }));
  };

  const getFilteredAttendees = () => {
    return attendees.filter(attendee => {
      if (exportConfig.filters.checkedInOnly && attendee.checkInStatus !== 'checked-in') {
        return false;
      }
      if (exportConfig.filters.paidOnly && attendee.paymentStatus !== 'paid') {
        return false;
      }
      if (!exportConfig.filters.includeNoShow && attendee.checkInStatus === 'no-show') {
        return false;
      }
      return true;
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const filteredAttendees = getFilteredAttendees();
    const selectedFields = Object.entries(exportConfig.fields)
      .filter(([key, selected]) => selected)
      .map(([key]) => key);

    console.log('Exporting:', {
      format: exportConfig.format,
      attendees: filteredAttendees.length,
      fields: selectedFields,
      filters: exportConfig.filters
    });

    // In a real app, this would trigger the actual export
    const exportData = filteredAttendees.map(attendee => {
      const exportRow = {};
      selectedFields.forEach(field => {
        exportRow[field] = attendee[field];
      });
      return exportRow;
    });

    // Create and download file (mock)
    const fileName = `${eventName.replace(/\s+/g, '_')}_attendees_${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
    console.log('File would be downloaded as:', fileName);
    console.log('Export data:', exportData);

    setIsExporting(false);
    onExport();
  };

  const filteredCount = getFilteredAttendees().length;
  const selectedFieldsCount = Object.values(exportConfig.fields).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000 p-4">
      <div className="bg-surface rounded-lg shadow-floating w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Export Attendee Data</h2>
            <p className="text-sm text-text-secondary mt-1">
              Export {attendees.length} attendee records from {eventName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200 ease-out"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Format & Fields */}
            <div className="space-y-6">
              {/* Export Format */}
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-3">Export Format</h3>
                <div className="space-y-2">
                  {exportFormats.map((format) => (
                    <label key={format.value} className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors duration-200 ease-out">
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={exportConfig.format === format.value}
                        onChange={(e) => setExportConfig(prev => ({ ...prev, format: e.target.value }))}
                        className="mt-1 text-primary focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Icon name={format.icon} size={16} className="text-text-secondary" />
                          <span className="text-sm font-medium text-text-primary">{format.label}</span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1">{format.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Data Fields */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-primary">Data Fields</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const allFields = {};
                        availableFields.forEach(field => {
                          allFields[field.key] = true;
                        });
                        setExportConfig(prev => ({ ...prev, fields: allFields }));
                      }}
                      className="text-xs text-primary hover:text-primary-700 transition-colors duration-200 ease-out"
                    >
                      Select All
                    </button>
                    <span className="text-xs text-text-secondary">|</span>
                    <button
                      onClick={() => {
                        const requiredFields = {};
                        availableFields.forEach(field => {
                          requiredFields[field.key] = field.required;
                        });
                        setExportConfig(prev => ({ ...prev, fields: requiredFields }));
                      }}
                      className="text-xs text-primary hover:text-primary-700 transition-colors duration-200 ease-out"
                    >
                      Required Only
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableFields.map((field) => (
                    <label key={field.key} className="flex items-center space-x-3 p-2 hover:bg-secondary-50 rounded cursor-pointer transition-colors duration-200 ease-out">
                      <input
                        type="checkbox"
                        checked={exportConfig.fields[field.key]}
                        onChange={() => handleFieldToggle(field.key)}
                        disabled={field.required}
                        className="text-primary focus:ring-primary-500 disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-text-primary">{field.label}</span>
                        {field.required && (
                          <span className="text-xs text-error ml-1">*</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  {selectedFieldsCount} field{selectedFieldsCount !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>

            {/* Right Column - Filters & Preview */}
            <div className="space-y-6">
              {/* Export Filters */}
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-3">Export Filters</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors duration-200 ease-out">
                    <input
                      type="checkbox"
                      checked={exportConfig.filters.checkedInOnly}
                      onChange={() => handleFilterToggle('checkedInOnly')}
                      className="text-primary focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-text-primary">Checked-in attendees only</span>
                      <p className="text-xs text-text-secondary">Export only attendees who have checked in</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors duration-200 ease-out">
                    <input
                      type="checkbox"
                      checked={exportConfig.filters.paidOnly}
                      onChange={() => handleFilterToggle('paidOnly')}
                      className="text-primary focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-text-primary">Paid attendees only</span>
                      <p className="text-xs text-text-secondary">Export only attendees with completed payments</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors duration-200 ease-out">
                    <input
                      type="checkbox"
                      checked={exportConfig.filters.includeNoShow}
                      onChange={() => handleFilterToggle('includeNoShow')}
                      className="text-primary focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-text-primary">Include no-show attendees</span>
                      <p className="text-xs text-text-secondary">Include attendees marked as no-show</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Export Preview */}
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-3">Export Preview</h3>
                <div className="bg-secondary-50 border border-border rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Records to export:</span>
                      <span className="text-sm font-medium text-text-primary">{filteredCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Fields included:</span>
                      <span className="text-sm font-medium text-text-primary">{selectedFieldsCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">File format:</span>
                      <span className="text-sm font-medium text-text-primary uppercase">{exportConfig.format}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Estimated size:</span>
                      <span className="text-sm font-medium text-text-primary">
                        {Math.round(filteredCount * selectedFieldsCount * 0.05)}KB
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Privacy Notice */}
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Icon name="Shield" size={16} className="text-warning-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-warning-800">Data Privacy Notice</h4>
                    <p className="text-xs text-warning-700 mt-1">
                      Exported data contains personal information. Please ensure compliance with data protection regulations and handle securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-secondary-50">
          <div className="text-sm text-text-secondary">
            Ready to export {filteredCount} record{filteredCount !== 1 ? 's' : ''} with {selectedFieldsCount} field{selectedFieldsCount !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-200 rounded-lg transition-colors duration-200 ease-out disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || selectedFieldsCount === 0 || filteredCount === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-out"
            >
              {isExporting ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Icon name="Download" size={16} />
                  <span>Export Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;