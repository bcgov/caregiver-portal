import React from "react";
import { ArrowRight, CircleAlert, CircleCheck, CircleArrowRight, ChevronRight } from "lucide-react";
import Button from "./Button";


const ApplicationPackageStep = ({step, index, onContinue}) => {

    return (
        <button className="application-package-step" key={index} onClick={onContinue}>
            <span className="application-package-left">
                <CircleAlert className="application-package-icon-alert" />
                <span className="application-package-label">{step.type}</span>
            </span>
            <ChevronRight className="application-package-chevron" />
        </button>
    );
    
};

export default ApplicationPackageStep;