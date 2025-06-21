import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CommunicationModal = ({ selectedAttendees, onClose, onSend }) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    template: 'custom',
    sendTime: 'now'
  });

  const [previewMode, setPreviewMode] = useState(false);

  const emailTemplates = [
    {
      id: 'custom',
      name: 'Custom Message',
      subject: '',
      message: ''
    },
    {
      id: 'welcome',
      name: 'Welcome Message',
      subject: 'Welcome to Tech Conference 2024!',
      message: `Dear [Name],

Thank you for registering for Tech Conference 2024! We're excited to have you join us.

Event Details:
📅 Date: March 15, 2024
📍 Venue: Convention Center
🕘 Time: 9:00 AM - 6:00 PM

Please keep your QR code ready for quick check-in at the venue.

Best regards,
EventFlow Team`
    },
    {
      id: 'reminder',name: 'Event Reminder',subject: 'Reminder: Tech Conference 2024 Tomorrow',
      message: `Hi [Name],

This is a friendly reminder that Tech Conference 2024 is tomorrow!

Don't forget to:
✅ Bring your QR code (attached to this email)
✅ Arrive 30 minutes early for check-in
✅ Bring a valid ID for verification

We look forward to seeing you there!

Best regards,
EventFlow Team`
    },
    {
      id: 'checkin',
      name: 'Check-in Instructions',
      subject: 'Check-in Instructions for Tech Conference 2024',
      message: `Hello [Name],

Here are your check-in instructions for Tech Conference 2024:

🎫 Your QR Code: Please have it ready on your phone or printed
📍 Check-in Location: Main entrance, Registration Desk
⏰ Check-in Hours: 8:00 AM - 10:00 AM

For faster check-in, please have your ID ready along with your QR code.

See you soon!
EventFlow Team`
    }
  ];

  const handleTemplateChange = (templateId) => {
    const template = emailTemplates.find(t => t.id === templateId);
    setEmailData({
      ...emailData,
      template: templateId,
      subject: template.subject,
      message: template.message
    });
  };

  const handleSend = () => {
    if (!emailData.subject.trim() || !emailData.message.trim()) {
      alert('Please fill in both subject and message fields.');
      return;
    }
    
    // Simulate sending email
    console.log('Sending email to:', selectedAttendees.length, 'attendees');
    console.log('Email data:', emailData);
    
    onSend();
  };

  const getPreviewMessage = () => {
    if (!selectedAttendees.length) return emailData.message;
    
    const sampleAttendee = selectedAttendees[0];
    return emailData.message
      .replace(/\[Name\]/g, sampleAttendee.name)
      .replace(/\[Email\]/g, sampleAttendee.email)
      .replace(/\[Company\]/g, sampleAttendee.company);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000 p-4">
      <div className="bg-surface rounded-lg shadow-floating w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Send Email</h2>
            <p className="text-sm text-text-secondary mt-1">
              Sending to {selectedAttendees.length} selected attendee{selectedAttendees.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200 ease-out"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-8rem)]">
          {/* Left Panel - Email Composition */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Template
                </label>
                <select
                  value={emailData.template}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
                >
                  {emailTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  placeholder="Enter email subject..."
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Message
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  placeholder="Enter your message..."
                  rows={12}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-out resize-none"
                />
                <div className="mt-2 text-xs text-text-secondary">
                  <p>Available placeholders: [Name], [Email], [Company]</p>
                </div>
              </div>

              {/* Send Options */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Send Time
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sendTime"
                      value="now"
                      checked={emailData.sendTime === 'now'}
                      onChange={(e) => setEmailData({ ...emailData, sendTime: e.target.value })}
                      className="mr-2 text-primary focus:ring-primary-500"
                    />
                    <span className="text-sm text-text-primary">Send now</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sendTime"
                      value="schedule"
                      checked={emailData.sendTime === 'schedule'}
                      onChange={(e) => setEmailData({ ...emailData, sendTime: e.target.value })}
                      className="mr-2 text-primary focus:ring-primary-500"
                    />
                    <span className="text-sm text-text-primary">Schedule for later</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview & Recipients */}
          <div className="w-80 border-l border-border bg-secondary-50 overflow-y-auto">
            <div className="p-4">
              {/* Preview Toggle */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-primary">Preview & Recipients</h3>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ease-out ${
                    previewMode 
                      ? 'bg-primary text-white' :'bg-secondary-200 text-text-secondary hover:bg-secondary-300'
                  }`}
                >
                  {previewMode ? 'Show Recipients' : 'Show Preview'}
                </button>
              </div>

              {previewMode ? (
                /* Email Preview */
                <div className="space-y-4">
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="text-xs text-text-secondary mb-2">Subject:</div>
                    <div className="text-sm font-medium text-text-primary mb-4">
                      {emailData.subject || 'No subject'}
                    </div>
                    <div className="text-xs text-text-secondary mb-2">Message:</div>
                    <div className="text-sm text-text-primary whitespace-pre-wrap">
                      {getPreviewMessage() || 'No message'}
                    </div>
                  </div>
                  {selectedAttendees.length > 0 && (
                    <div className="text-xs text-text-secondary">
                      Preview shown with data from: {selectedAttendees[0].name}
                    </div>
                  )}
                </div>
              ) : (
                /* Recipients List */
                <div className="space-y-2">
                  <div className="text-xs text-text-secondary mb-3">
                    Recipients ({selectedAttendees.length})
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedAttendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center space-x-2 p-2 bg-surface border border-border rounded">
                        <div className="w-6 h-6 bg-secondary-200 rounded-full flex items-center justify-center">
                          <Icon name="User" size={12} className="text-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-text-primary truncate">
                            {attendee.name}
                          </div>
                          <div className="text-xs text-text-secondary truncate">
                            {attendee.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-secondary-50">
          <div className="text-sm text-text-secondary">
            Email will be sent to {selectedAttendees.length} attendee{selectedAttendees.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-200 rounded-lg transition-colors duration-200 ease-out"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!emailData.subject.trim() || !emailData.message.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-out"
            >
              <Icon name="Send" size={16} />
              <span>Send Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationModal;