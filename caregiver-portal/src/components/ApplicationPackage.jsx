import React, {useState} from 'react';
import Application from './Application';
import Household from './Household';
import HouseholdSummary from './HouseholdSummary';
import Button from './Button';

const ApplicationPackage = ({ applicationId, onClose }) => {      // to do, make initial step a parameter
    const [currentStep, setCurrentStep] = useState('application');
    // possible steps: 'application', 'household', 'submission', 'review'

    const steps = [
        {key: 'application', label: 'Application Form'},
        {key: 'household', label: 'Household Information'},
        {key: 'submission', label: 'Review & Submit'},
    ];

    const handleStepChange = (step) => {
        setCurrentStep(step);
    }

    return (
        <div className="application-package">
            {/* step navigation header */}
            <div className="application-nav">

            <div className="step-indicator">
                <Button onClick={onClose} variant="secondary">
                    Back to Dashboard
                </Button>
                {steps.map((step) => (
                    <Button
                        key={step.key}
                        variant={`${currentStep === step.key ? 'disabled' : 'secondary'}`}
                        onClick={() => handleStepChange(step.key)}
                    >
                    {step.label}
                    </Button>
                ))}
            </div>
        </div>

        {/* content based on current step */}
        
        <div className="application-content">
            {currentStep === 'application' && (
                <Application
                    applicationId={applicationId}
                    onNext={() => handleStepChange('household')}
                />
            )}

            {currentStep === 'household' && (
                <Household
                    currentApplication={applicationId}
                    onNext={() => handleStepChange('submission')}
                    onBack={() => handleStepChange('application')}
                />
            )}

            {currentStep === 'submission' && (
                <HouseholdSummary applicationId={applicationId}></HouseholdSummary>
            )}

        </div>
        </div>
    );
};

export default ApplicationPackage;
