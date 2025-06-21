import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const QRScanner = ({ isScanning, onScan, onToggleScanning }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(0);

  // Mock QR codes for testing
  const mockQRCodes = ['QR001', 'QR002', 'QR003', 'QR004', 'QR005'];

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setHasCamera(true);
        setCameraError(null);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setHasCamera(false);
      setCameraError('Camera access denied or not available');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleScanClick = () => {
    if (!isScanning) {
      onToggleScanning(true);
    } else {
      // Simulate QR code scan for demo
      const now = Date.now();
      if (now - lastScanTime > 2000) { // Prevent rapid scanning
        const randomQR = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
        onScan(randomQR);
        setLastScanTime(now);
      }
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Scanner Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">QR Code Scanner</h3>
          <div className="flex items-center space-x-2">
            {isScanning && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs text-success font-medium">Scanning</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scanner Viewport */}
      <div className="relative bg-black aspect-video">
        {isScanning && hasCamera ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {/* Scanner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanner Frame */}
                <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                  {/* Corner indicators */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                  
                  {/* Scanning line animation */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary opacity-75 animate-bounce" />
                </div>
                
                {/* Instructions */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="text-white text-sm font-medium">Position QR code within frame</p>
                  <p className="text-white text-xs opacity-75">Tap to scan manually</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              {cameraError ? (
                <>
                  <Icon name="CameraOff" size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Camera Not Available</p>
                  <p className="text-sm opacity-75 mb-4">{cameraError}</p>
                </>
              ) : (
                <>
                  <Icon name="Camera" size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Camera Ready</p>
                  <p className="text-sm opacity-75 mb-4">Tap to start scanning</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Scan Button Overlay */}
        <button
          onClick={handleScanClick}
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 ease-out"
        >
          <span className="sr-only">
            {isScanning ? 'Scan QR Code' : 'Start Camera'}
          </span>
        </button>
      </div>

      {/* Scanner Controls */}
      <div className="p-4 bg-secondary-50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onToggleScanning(!isScanning)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out ${
              isScanning 
                ? 'bg-error text-white hover:bg-error-600' :'bg-primary text-white hover:bg-primary-700'
            }`}
          >
            <Icon name={isScanning ? "Square" : "Play"} size={16} />
            <span>{isScanning ? 'Stop Scanner' : 'Start Scanner'}</span>
          </button>

          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Zap" size={14} />
              <span>Auto-scan enabled</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Volume2" size={14} />
              <span>Audio feedback on</span>
            </div>
          </div>
        </div>

        {/* Scanner Tips */}
        <div className="mt-3 p-3 bg-primary-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-primary-700">
              <p className="font-medium mb-1">Scanner Tips:</p>
              <ul className="text-xs space-y-1 text-primary-600">
                <li>• Hold device steady and ensure good lighting</li>
                <li>• Position QR code within the frame guides</li>
                <li>• Keep QR code flat and unobstructed</li>
                <li>• Use manual entry if scanning fails</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;