import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const QRCodePreview = ({ eventData, registrationData }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Generate QR code data URL (mock implementation)
  const generateQRCode = () => {
    // In a real implementation, you would use a QR code library
    // For now, we'll use a placeholder QR code image
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      JSON.stringify({
        eventId: eventData.id,
        registrationId: registrationData.registrationId,
        attendeeName: `${registrationData.firstName} ${registrationData.lastName}`,
        eventTitle: eventData.title,
        eventDate: eventData.date
      })
    )}`;
  };

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = generateQRCode();
      link.download = `${eventData.title.replace(/\s+/g, '_')}_QR_Code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 1000);
  };

  const handleEmailQR = async () => {
    // Simulate email sending
    setTimeout(() => {
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }, 1000);
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(`${eventData.date}T09:00:00`);
    const endDate = new Date(`${eventData.date}T18:00:00`);
    
    const calendarEvent = {
      title: eventData.title,
      start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: eventData.description.substring(0, 200) + '...',
      location: eventData.address
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${calendarEvent.start}/${calendarEvent.end}&details=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="bg-success-50 border border-success-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
            <Icon name="CheckCircle" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-success-600">Registration Successful!</h3>
            <p className="text-sm text-success-600">Your spot has been confirmed</p>
          </div>
        </div>
        
        <div className="text-sm text-success-600">
          <p className="mb-2">
            <strong>Registration ID:</strong> {registrationData.registrationId}
          </p>
          <p>
            <strong>Registered for:</strong> {registrationData.firstName} {registrationData.lastName}
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
          Your Event QR Code
        </h3>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white border-2 border-secondary-200 rounded-lg">
            <img 
              src={generateQRCode()}
              alt="Event QR Code"
              className="w-48 h-48"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-text-secondary mb-2">
            Present this QR code at the event entrance for quick check-in
          </p>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent-50 text-accent-600 rounded-full text-xs font-medium">
            <Icon name="Shield" size={12} />
            <span>Secure Digital Ticket</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadQR}
            disabled={isDownloading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 ease-out disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Icon name="Download" size={16} />
                <span>Download QR</span>
              </>
            )}
          </button>

          <button
            onClick={handleEmailQR}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out"
          >
            <Icon name="Mail" size={16} />
            <span>{emailSent ? 'Email Sent!' : 'Email QR Code'}</span>
          </button>
        </div>
      </div>

      {/* Event Summary */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Event Summary</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="Calendar" size={16} className="text-text-secondary mt-1" />
            <div>
              <p className="font-medium text-text-primary">{eventData.title}</p>
              <p className="text-sm text-text-secondary">
                {new Date(eventData.date).toLocaleDateString()} • {eventData.time}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={16} className="text-text-secondary mt-1" />
            <div>
              <p className="font-medium text-text-primary">{eventData.location}</p>
              <p className="text-sm text-text-secondary">{eventData.address}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="User" size={16} className="text-text-secondary mt-1" />
            <div>
              <p className="font-medium text-text-primary">
                {registrationData.firstName} {registrationData.lastName}
              </p>
              <p className="text-sm text-text-secondary">{registrationData.email}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="CreditCard" size={16} className="text-text-secondary mt-1" />
            <div>
              <p className="font-medium text-text-primary">
                ${eventData.price} {eventData.currency}
              </p>
              <p className="text-sm text-text-secondary">Registration fee paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Next Steps</h3>
        
        <div className="space-y-3">
          <button
            onClick={handleAddToCalendar}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent-50 text-accent-600 rounded-lg hover:bg-accent-100 transition-colors duration-200 ease-out"
          >
            <Icon name="Calendar" size={16} />
            <span>Add to Calendar</span>
          </button>

          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out">
            <Icon name="Share" size={16} />
            <span>Share Event</span>
          </button>

          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-colors duration-200 ease-out">
            <Icon name="MessageCircle" size={16} />
            <span>Contact Organizer</span>
          </button>
        </div>
      </div>

      {/* Important Reminders */}
      <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={16} className="text-accent mt-1" />
          <div>
            <h4 className="font-medium text-accent-600 mb-2">Important Reminders</h4>
            <ul className="text-sm text-accent-600 space-y-1">
              <li>• Arrive 15 minutes early for check-in</li>
              <li>• Bring a valid ID for verification</li>
              <li>• Keep your QR code accessible on your phone</li>
              <li>• Check your email for event updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePreview;