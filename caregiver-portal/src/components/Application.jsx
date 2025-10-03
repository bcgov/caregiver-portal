import React, { useState, useEffect, useRef } from 'react';
//import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw, Send } from 'lucide-react';
import { useGetFormAccessToken } from '../hooks/useGetFormAccessToken';
import { useApplicationPackage } from '../hooks/useApplicationPackage';

const Application = ({ applicationId, onClose }) => {
    const [iframeUrl, setIframeUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [applicationForm, setApplicationForm] = useState(null);
    const iframeRef = useRef(null);

    const { getApplicationForm } = useApplicationPackage();
    /*
    const { getFormAccessToken, error: tokenError } = useGetFormAccessToken(applicationId,  (formAccessToken) => {
      const formServiceUrl = import.meta.env.VITE_KILN_URL || 'https://localhost:8080';
      console.log('Application form status:', applicationForm?.status); // Add this line
      const urlPath = applicationForm?.status === 'New' ? 'new' : 'edit';      
      const url = `${formServiceUrl}/${urlPath}?id=${formAccessToken}`;
      console.log('Setting iframe URL:', url);     
      setIframeUrl(url);
      setLoading(false);      
    });
    
    // get the application form metadata
    useEffect(() => {
      if (applicationId) {
        console.log('Loading application form for applicationId:', applicationId);
        setLoading(true);
        setError(null);

        getApplicationForm(applicationId)
        .then(setApplicationForm)
        .catch(err => {
          console.error('Error fetching application form:', err);
          setError(err.message);
          //setLoading(false);
        });
      }
    }, [applicationId, getApplicationForm]);

    // TODO: Handle onNext to move to next step in application process
    // TODO: Handle accessToken expiry and refresh
  
    // Fetch form access token and set iframe URL
    useEffect(() => {
      if (applicationForm && applicationId) {
        console.log('getting form access token for form:', applicationForm);
        // Only start getting the token after we have the form metadata
        getFormAccessToken().catch(err => {
          console.error('Error fetching form access token:', err);
          setError(err.message);
          setLoading(false);
        });
      }
    }, [applicationForm, applicationId, getFormAccessToken]);
    */

    useEffect(() => {
      if (applicationId) {
        console.log('Loading application form for applicationId:', applicationId);
        setLoading(true);
        setError(null);
  
        getApplicationForm(applicationId)
        .then(setApplicationForm)
        .catch(err => {
          console.error('Error fetching application form:', err);
          setError(err.message);
          setLoading(false);
        });
      }
    }, [applicationId, getApplicationForm]);

  // Remove the callback from useGetFormAccessToken
  const { getFormAccessToken, error: tokenError } = useGetFormAccessToken(applicationId);

  // Move the URL logic into the effect where you call getFormAccessToken
  useEffect(() => {
    if (applicationForm && applicationId) {
      console.log('getting form access token for form:', applicationForm);

      getFormAccessToken()
        .then((formAccessToken) => {
          const formServiceUrl = import.meta.env.VITE_KILN_URL || 'https://localhost:8080';
          console.log('Application form status:', applicationForm?.status);
          const urlPath = applicationForm?.status === 'New' ? 'new' : 'edit';
          const url = `${formServiceUrl}/${urlPath}?id=${formAccessToken}`;
          console.log('Setting iframe URL:', url);
          setIframeUrl(url);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching form access token:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [applicationForm, applicationId, getFormAccessToken]);

    // Handle token errors
    useEffect(() => {
      if (tokenError) {
        setError(tokenError);
        setLoading(false);
      }
    }, [tokenError]);

    
      const handleIframeLoad = () => {
        setIsIframeLoaded(true);
      };
    
      const handleRetry = () => {
        setError(null);
        setIsIframeLoaded(false);
        setApplicationForm(null);
        setIframeUrl('');
        //loadApplication();
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
             <p>{applicationForm?.status}</p>
            {iframeUrl && (
              <iframe
                ref={iframeRef}
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