import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useGetFormAccessToken } from '../hooks/useGetFormAccessToken';

const Application = ({ applicationId, onNext, onClose }) => {
    const [iframeUrl, setIframeUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

    //const navigate = useNavigate();
    // TODO: Handle onNext to move to next step in application process

    // TODO: Handle accessToken expiry and refresh
  
    // Fetch form access token and set iframe URL

    const { getFormAccessToken } = useGetFormAccessToken(applicationId, (formAccessToken) => {
      console.log('Received formAccessToken:', formAccessToken); 
      const formServiceUrl = import.meta.env.VITE_KILN_URL || 'https://localhost:8080';
      const url = `${formServiceUrl}/new?id=${formAccessToken}`;
      console.log('Setting iframe URL:', url);     
      setIframeUrl(url);
      setLoading(false);
    });

    const loadApplication = async () => {
        try {
          setLoading(true);
          setError(null);
          await getFormAccessToken(); 
        } catch (err) {
          setError(err.message);
          setLoading(false);
        } 
      };

      useEffect(() => {
        console.log(`ApplicationID: ${applicationId}`);
        if (applicationId) {
          setLoading(true);
          setError(null);
          getFormAccessToken().catch(err => {
            setError(err.message);
            setLoading(false);  
          });
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
          <div className="application-frame">
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
                title={`Caregiver Application`}
                onLoad={handleIframeLoad}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                // Add additional security attributes as needed
              />
            )}
          </div>
        </div>
      );
    };
    
    export default Application;