import React from "react";
import { ArrowRight, CircleAlert, CircleCheck, CircleArrowRight, ChevronRight, Clock } from "lucide-react";
import Button from "./Button";


const ApplicationProcessStep = ({step, index, onContinue}) => {

      // Function to render the appropriate icon
      const renderStepIcon = () => {
        if (index === 0) {
            if (step.iconType === 'waiting') {
                return (
                    <div className="application-step-indicator">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="18" fill="#013366"/> {/* Blue color for waiting */}
                            <Clock transform="translate(6,6)" color="white" />
                        </svg>
                    </div>
                );
            } else {
                return (
                    <div className="application-step-indicator">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="18" fill="#FCBA19"/>
                            <ArrowRight transform="translate(6,6)" />
                        </svg>
                    </div>
                );
            }
        } else {
            return (
                <div className="application-step-later">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0C5.364 0 0 5.364 0 12C0 18.636 5.364 24 12 24C18.636 24 24 18.636 24 12C24 5.364 18.636 
0 12 0ZM12 21.6C6.696 21.6 2.4 17.304 2.4 12C2.4 6.696 6.696 2.4 12 2.4C17.304 2.4 21.6 6.696 21.6 12C21.6 17.304 17.304 21.6 
12 21.6Z" 
                        fill="#D1CFCD"
                        />
                    </svg>
                </div>
            );
        }
    };    

    return (

        <section className="application-step" key={step.key}>

            <div className="application-step-left">
                {/* Step Indicator */}

                    {/* Icon based on step status */}
                    {renderStepIcon()}
                 


                {/* Timeline Rail */}
                <div className="application-timeline-rail" aria-hidden />
            </div>


            {/* Step Content */}
            <div className="application-step-content">
                <p className="application-step-label">Step {index + 1}</p>
                <h2 className="application-step-title">{`${step.label}`}</h2>
                <p className="application-step-description">{step.description}</p>
                {index === 0 && onContinue && !step.disabled && (
                <Button onClick={() => onContinue()} variant="primary">Register for Info Session <ArrowRight className="buttonIcon" /></Button>
                )}
            </div>


        </section>

    );

};

export default ApplicationProcessStep;