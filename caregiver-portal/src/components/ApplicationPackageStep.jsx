import React from "react";
import { ArrowRight, CircleAlert, CircleCheck, CircleArrowRight, ChevronRight } from "lucide-react";
import Button from "./Button";


const ApplicationPackageStep = ({step, index, onContinue, state = 'default'}) => {

    const getIcon = () => {
        switch (state) {
            case 'complete':
                return <CircleCheck className="application-package-icon-complete" />;
            case 'default':
            default:
                return <CircleAlert className="application-package-icon-alert" />;       
        }
    }

    return (
        <button className="application-package-step" key={index} onClick={onContinue}>
            <span className="application-package-left">
                {getIcon()}
                <span className="application-package-label">{step.type}</span>
            </span>
            <ChevronRight className="application-package-chevron" />
        </button>
    );
    
};

export default ApplicationPackageStep;