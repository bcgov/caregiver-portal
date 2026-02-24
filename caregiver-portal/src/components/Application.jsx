import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw, Send, ArrowRight } from 'lucide-react';
import { useGetFormAccessToken } from '../hooks/useGetFormAccessToken';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
//import Button from './Button';
//import Breadcrumb from '../components/Breadcrumb';
import BreadcrumbBar from './BreadcrumbBar';



const Application = ({ applicationPackageId, applicationFormId, onClose, onSubmitComplete, submitPackage = false, householdMemberId, Context = 'Application' }) => {
    const [iframeUrl, setIframeUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [applicationForm, setApplicationForm] = useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [allForms, setAllForms] = React.useState([])
    const [nextUrl, setNextUrl] = React.useState('');
    const [formMessage, setFormMessage] = React.useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    
    const iframeRef = useRef(null);
    const iframeUrlRef = useRef(null);
    const navigationTargetRef = useRef(null);

    const navigate = useNavigate();

    const home = Context === 'Screening' && householdMemberId
    ? `/screening-package/${householdMemberId}`
    : Context === 'Referral'
    ? `/foster-application/referral-package/${applicationPackageId}`
    : `/foster-application/application-package/${applicationPackageId}`;
      
    const { getApplicationForm, submitApplicationPackage, getApplicationForms } = useApplicationPackage();

    useEffect(() => {
      if (applicationFormId) {
        //console.log('Loading application form for applicationFormId:', applicationFormId);
        setLoading(true);
        setError(null);
  
        getApplicationForm(applicationFormId)
        .then(setApplicationForm)
        .catch(err => {
          //console.error('Error fetching application form:', err);
          setError(err.message);
          setLoading(false);
        });
      }
    }, [applicationFormId, getApplicationForm]);

    // Load all forms to determine next form in sequence
  useEffect(() => {
/*
    console.log('=== FORMS USEEFFECT TRIGGERED ===', {
      applicationPackageId,
      applicationFormId,
      hasGetApplicationForms: !!getApplicationForms
    });
*/
    if (applicationPackageId) {
      getApplicationForms(applicationPackageId)
        .then(formsArray => {
          setAllForms(formsArray);

          //console.log('All forms:', formsArray.map(f => ({ id: f.applicationFormId, type: f.type })));
          // Find current form index
          const currentIndex = formsArray.findIndex(
            form => form.applicationFormId === applicationFormId
          );

          //console.log('Current form index:', currentIndex, 'applicationFormId:', applicationFormId);          

          // Get next form (skip Referral types)
          if (currentIndex !== -1 && currentIndex < formsArray.length - 1) {
            let nextIndex = currentIndex + 1;
            while (nextIndex < formsArray.length &&
                   formsArray[nextIndex].type === 'Referral') {
              nextIndex++;
            }

            //console.log('Final nextIndex:', nextIndex, 'formsArray.length:', formsArray.length);

            if (nextIndex < formsArray.length) {
              const nextForm = formsArray[nextIndex];
              //console.log('Next form found:', { id: nextForm.applicationFormId, type: nextForm.type });
              //console.log('screeningContext', isScreeningContext)
              //console.log('householdMemberId', householdMemberId)

              let nextFormUrl;
              if (Context === 'Screening' && householdMemberId) {
                nextFormUrl =`/screening-package/${householdMemberId}/screening-form/${nextForm.applicationFormId}`;
                //console.log(nextFormUrl)
              } else if (nextForm.type && nextForm.type.toLowerCase().includes('household')) {
                // Build URL based on form type (household vs regular)
                nextFormUrl = `/foster-application/application-package/${applicationPackageId}/household-form/${nextForm.applicationFormId}`;
              } else {
                nextFormUrl = `/foster-application/application-package/${applicationPackageId}/application-form/${nextForm.applicationFormId}`;
              }
              setNextUrl(nextFormUrl);
            } else {
              //console.log('No next form - this is the last form');
              setNextUrl('');
            }
          } else {
            // This is the last form in the array
            //console.log('Last form - clearing nextUrl');
            setNextUrl('');
          }
        })
        .catch(err => console.error('Error fetching forms:', err));
    }
  }, [applicationPackageId, applicationFormId, getApplicationForms]);

  const { getFormAccessToken, error: tokenError } = useGetFormAccessToken(applicationFormId);

  useEffect(() => {
    if (applicationForm && applicationFormId) {

      // skip if we already generated a URL for this form
      if (iframeUrlRef.current === applicationFormId) {
        return;
      }
      //console.log('getting form access token for form:', applicationForm);

      getFormAccessToken()
        .then((formAccessToken) => {
          const formServiceUrl = import.meta.env.VITE_KILN_URL || 'https://localhost:8080';
          //console.log('Application form status:', applicationForm?.status);
          const urlPath = applicationForm?.status === 'New' ? 'new' : 'edit';
          const url = `${formServiceUrl}/${urlPath}?id=${formAccessToken}`;
          //console.log('Setting iframe URL:', url);
          setIframeUrl(url);
          setLoading(false);
          iframeUrlRef.current = applicationFormId;
        })
        .catch(err => {
          //console.error('Error fetching form access token:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [applicationForm, applicationFormId, getFormAccessToken]);

    // Handle token errors
    useEffect(() => {
      if (tokenError) {
        setError(tokenError);
        setLoading(false);
      }
    }, [tokenError]);



/**
 * handleMessage responds to messages from the iFrame, which we can trigger interactively
 * save is being run on a timer set below ~ every 2 seconds
 * it will return errorOnSave or successOnSave; if successOnSave it means that all required information is provided on the form.
 * submit is run when we want to mark the form as complete, it should be run whenever we're leaving the page;
 * if there are errors on the page it will return errorOnComplete otherwise it will return 'submit' as a success
 */
    useEffect(() => {
      async function handleMessage(event) {

        console.log('Received message:', event.data);
        

        if (event.data === '{"event":"errorOnSave"}') {
          //alert("ERROR!");
          //setFormMessage("The form is missing required information.");
          setIsFormValid(false);

          
          setApplicationForm(prev => ({
            ...prev,
            status: 'Draft'
          }));
          
        }


        if (event.data === '{"event":"successOnSave"}') {
          setFormMessage(""); // clear error message
          setIsFormValid(true);

          
          setApplicationForm(prev => ({
            ...prev,
            status: 'Complete'
          }));
          
        }

        // user clicked COMPLETE but there were errors
        if (event.data === '{"event":"errorOnComplete"}' ) {
          setFormMessage("Please correct the errors below before continuing.");
          setIsFormValid(false);
          setApplicationForm(prev => ({
            ...prev,
            status: 'Error'
          }));
          return;
        }

        // user clicked COMPLETE and it was all G
        if (event.data?.event === 'submit' || event.data === '{"event":"submit"}') {
          setIsSubmitting(true);

          if (!submitPackage) {
            // Check if navigation was triggered from breadcrumb actions first
            const targetUrl = navigationTargetRef.current || nextUrl || onSubmitComplete || home;
            navigationTargetRef.current = null; // Reset after reading
            navigate(targetUrl);
            setIsSubmitting(false);
          } else {       
            try {
              const result = await submitApplicationPackage(applicationForm?.applicationPackageId);
              console.log('Submission successful:', result);
              if( onSubmitComplete ) {
                navigate(onSubmitComplete);
              } else {
                navigate(home)
              }
            } catch (error) {
              console.error('Submit failed:', error);
              alert('Failed to submit application. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
        }
        }
      }

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, [applicationForm, navigate, nextUrl, home]);

    useEffect(() => {
      if(!isIframeLoaded) return;

      const autoSaveInterval = setInterval(() => {
        console.log('Auto-saving form...');
        sendSave();
      }, 2000); // every 10 seconds

      return () => {
        clearInterval(autoSaveInterval); // cleanup interval on unmount
      };
    }, [isIframeLoaded]);
    
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

      const sendSave = () => {
        if (iframeRef.current?.contentWindow) {
          const message = iframeRef.current.contentWindow.postMessage({
            type: "CLICK_BUTTON_BY_TEXT",
            text: "Save"   
          },
          "*")

          console.log("Sending save:",message);
        }          
      }

  
      if (loading) {
        return (
          <div className="submission-overlay">
          <div className="submission-modal">
            <Loader2 className="submission-spinner" />
            <p className="submission-title">Loading application form</p>
            <p className="submission-text">Please wait while we load the application form...</p>
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
        <>

        <div className="iframe-container">

        {/* Top breadcrumb - aligned with page content */}
        <div className="breadcrumb-top">
          <div className="breadcrumb-top-content">
            <BreadcrumbBar home={home} next={nextUrl} applicationForm={applicationForm} isFormValid={isFormValid} iframeRef={iframeRef} message={formMessage} navigationTargetRef={navigationTargetRef}/>
          </div>
        </div>
          <div className="iframe-content">
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
            {/* Submission Overlay - appears over entire page including iframe */}
            {isSubmitting && (
              <div className="submission-overlay">
                <div className="submission-modal">
                  <Loader2 className="submission-spinner" />
                  <p className="submission-title">Submitting Form</p>
                  <p className="submission-text">Please wait while we process your submission...</p>
                </div>
              </div>
            )}
        </div>
      </>
      );
    };
    
    export default Application;