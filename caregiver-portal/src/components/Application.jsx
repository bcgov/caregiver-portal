import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

const Application = ({ applicationId, onClose }) => {
    const [iframeUrl, setIframeUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

    const loadApplication = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Replace with your actual middleware endpoint
          const response = await fetch(`/api/applications/${applicationId}/start`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error(`Failed to load application: ${response.status}`);
          }
    
          const data = await response.json();
          
          // Assuming the middleware returns an object with a url property
          if (data.url) {
            setIframeUrl(data.url);
          } else {
            throw new Error('No URL returned from middleware');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        if (applicationId) {
          loadApplication();
        }
      }, [applicationId]);
    
      const handleIframeLoad = () => {
        setIsIframeLoaded(true);
      };
    
      const handleRetry = () => {
        setIsIframeLoaded(false);
        loadApplication();
      };
    
      if (loading) {
        return (
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading application...</p>
            </div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center max-w-md mx-auto p-6">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to Load Application
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-x-3">
                <button
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Retry
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }
    
      return (
        <div className="h-screen flex flex-col bg-gray-100">
          {/* Header */}
          <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              Application {applicationId}
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRetry}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
    
          {/* iFrame Container */}
          <div className="flex-1 relative">
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Loading content...</p>
                </div>
              </div>
            )}
            
            {iframeUrl && (
              <iframe
                src={iframeUrl}
                className="w-full h-full border-0"
                title={`Application ${applicationId}`}
                onLoad={handleIframeLoad}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                // Add additional security attributes as needed
              />
            )}
          </div>
        </div>
      );
    };
    
    export default Application;