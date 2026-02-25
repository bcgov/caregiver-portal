import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import Button from './Button';
import Breadcrumb from '../components/Breadcrumb';


// TODO: This set of parameters is OUT OF CONTROL
const BreadcrumbBar = ({home, next, applicationForm, label, iframeRef, message, isFormValid, navigationTargetRef, onNext, onBack}) => {
   const navigate = useNavigate();

    // Check if form is complete
    const isFormComplete = isFormValid || applicationForm?.status === 'Complete' || applicationForm?.status === 'Submitted';

    const handleBackClick = () => {
        //console.log("Back: isFormComplete()", isFormComplete);
        if (onBack) {
            onBack();
            return;
        }
        if (iframeRef && navigationTargetRef) {
            if (isFormComplete) {
                navigationTargetRef.current = home;
                sendComplete();
            } else {
                navigate(home);
            }
        } else {
        // for household-form or other non-FF forms
        navigate(home);
        }
    };

    const handleNextClick = () => {
        if (onNext) {
            onNext();
            return;
        }
       if (iframeRef && iframeRef.current?.contentWindow) {
        navigationTargetRef.current = next || home;
        sendComplete();
       } else {
        navigate(next || home);
       }
    }


    const sendComplete = () => {
        //if (!isFormComplete) {
        //    return; // Do nothing if form is not complete
       // }
        if (iframeRef && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
            type: "CLICK_BUTTON_BY_TEXT",
            text: "Complete"   
        },
        "*")
    }
    }

    // Get status message for tooltip
    const getStatusMessage = (status) => {
    switch(status) {
        case 'New':
            return 'Form is incomplete';
        case 'Draft':
            return 'Form is in progress';
        case 'Error':
            return 'Form has errors';
        case 'Complete':
            return 'Form is complete';
        case 'Submitted':
            return 'Form is submitted';
        default:
            return 'Form status unknown';
    }
    };

    // Get icon color based on status
    const getStatusColor = (status) => {
        switch(status) {
            case 'Error':
                return '#d32f2f';
            case 'New':
            case 'Draft':
                return '#f57c00';
            case 'Complete':
            case 'Submitted':
                return '#388e3c';
            default:
                return '#757575';
        }
    };

    // Create label with icon for current page
    const getCurrentPageLabel = () => {
        if (label) {
            return label; // For household page, just return the label without status
        }

        if (!applicationForm?.type) {
            return '';
        }

        const statusMessage = getStatusMessage(applicationForm.status);
        const statusColor = getStatusColor(applicationForm.status);

        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {applicationForm.type}
                <span 
                    title={statusMessage}
                    style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        cursor: 'help',
                        color: statusColor
                    }}
                >
                    {isFormComplete ? (
                        <AlertCircle size={16} />
                    ) : (
                        <AlertCircle size={16} />
                    )}

                   { message && (
                    <p className='formError'>{message}</p>
                    )}
                     
                    
                </span>
            </span>
        );
    };


    const breadcrumbItems = [
        { label: 'Foster Caregiver Application Package', path: home},
        { label: getCurrentPageLabel(), path: next}
    ];


    

    return (
        <div className="page-details-row-breadcrumb">
            <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
  
            <Button 
                variant='next' 
                onClick={handleNextClick}
                //disabled={!isFormComplete && applicationForm?.status}
                disable={!!message}
                style={{
                    //opacity: (!isFormComplete && applicationForm?.status) ? 0.5 : 1,
                    //cursor: (!isFormComplete && applicationForm?.status) ? 'not-allowed' : 'pointer'
                    opacity: message ? 0.5 : 1,
                    cursor: message ? 'not-allowed' : 'pointer'
                }}
            >
                Next section <ArrowRight/>
            </Button>
        </div>
      );
    }

export default BreadcrumbBar;