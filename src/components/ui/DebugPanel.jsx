// src/components/ui/DebugPanel.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import debugService from '../../utils/debugService';

const DebugPanel = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    if (isVisible && debugService.isEnabled()) {
      loadSuggestions();
    }
  }, [isVisible]);

  const loadSuggestions = async () => {
    const result = debugService.getQuickFixSuggestions();
    if (result.success) {
      setSuggestions(result.data);
    }
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const result = await debugService.generateTroubleshootingReport();
      if (result.success) {
        setReportData(result.data);
        setActiveTab('report');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testCredentials = async () => {
    setIsLoading(true);
    try {
      const result = await debugService.testAllDemoCredentials();
      if (result.success) {
        setReportData(prev => ({
          ...prev,
          sections: {
            ...prev?.sections,
            credentialsTest: result
          }
        }));
      }
    } catch (error) {
      console.error('Failed to test credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible || !debugService.isEnabled()) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'suggestions', label: 'Quick Fixes', icon: 'Tool' },
    { id: 'report', label: 'Detailed Report', icon: 'FileText' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Icon name="Bug" size={20} className="text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Login Debug Panel</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <Icon name={tab.icon} size={16} className="mr-2" />
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  🚨 Login Troubleshooting Mode
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  This debug panel helps identify and resolve login issues in development mode.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={generateReport}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800 mr-2"></div>
                    ) : (
                      <Icon name="Search" size={14} className="mr-2" />
                    )}
                    Run Full Diagnostic
                  </button>
                  <button
                    onClick={testCredentials}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200 disabled:opacity-50"
                  >
                    <Icon name="Key" size={14} className="mr-2" />
                    Test Demo Credentials
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Demo Credentials</h5>
                  <div className="space-y-2 text-sm">
                    <div>👑 Admin: admin@eventflow.com / admin123</div>
                    <div>📊 Manager: manager@eventflow.com / manager123</div>
                    <div>🎫 Usher: usher@eventflow.com / usher123</div>
                    <div>👤 Attendee: attendee@eventflow.com / attendee123</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Common Issues</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Database not properly seeded</li>
                    <li>• Environment variables missing</li>
                    <li>• Supabase project paused</li>
                    <li>• Network connectivity issues</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {suggestions?.map((suggestion, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Icon name="AlertTriangle" size={16} className="text-orange-500 mr-2" />
                    {suggestion.issue}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Things to Check:</h5>
                      <ul className="space-y-1">
                        {suggestion.checks.map((check, checkIndex) => (
                          <li key={checkIndex} className="text-sm text-gray-600 flex items-start">
                            <Icon name="CheckCircle" size={12} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {check}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Potential Fixes:</h5>
                      <ul className="space-y-1">
                        {suggestion.fixes.map((fix, fixIndex) => (
                          <li key={fixIndex} className="text-sm text-gray-600 flex items-start">
                            <Icon name="Wrench" size={12} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            {fix}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'report' && (
            <div className="space-y-4">
              {!reportData ? (
                <div className="text-center py-8">
                  <Icon name="FileText" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No diagnostic report generated yet.</p>
                  <button
                    onClick={generateReport}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Icon name="Play" size={16} className="mr-2" />
                    )}
                    Generate Report
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      📊 Diagnostic Report - {new Date(reportData.timestamp).toLocaleString()}
                    </h4>
                  </div>

                  {Object.entries(reportData.sections).map(([section, data]) => (
                    <div key={section} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <h5 className="font-medium text-gray-900 capitalize">
                          {section.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </h5>
                      </div>
                      <div className="p-4">
                        <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                          {JSON.stringify(data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(reportData, null, 2)], {
                          type: 'application/json'
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `eventflow-debug-report-${Date.now()}.json`;
                        a.click();
                      }}
                      className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
                    >
                      <Icon name="Download" size={14} className="mr-2" />
                      Download Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;