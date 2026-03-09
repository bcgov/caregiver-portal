import React from 'react';
import Button from './Button';
import Family from '../assets/foster-hero2.png';
import { ExternalLink } from "lucide-react";

const FosterApplicationStart = ({onClick, disabled = false, showImage = true}) => {
    const [isStarting, setIsStarting] = React.useState(false);

    const handleStartClick = async () => {
        setIsStarting(true);
        try {
            await onClick();
        } finally {
            setIsStarting(false);      
        }
    };


    return (

            <div className="page-details-frame">

                <div className="image-frame">
                {showImage && (
                    <img src={Family} alt="Become a foster caregiver" className="hero-image" />
                )}
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Foster caregiving</h2>
                </div>
                
                <p className="page-content">Thank you for your interest in supporting children and youth who need a safe, stable, and nurturing home. Every child deserves care rooted in respect, belonging, and compassion. Your willingness to help makes a meaningful difference.</p>
                <p className="page-content">Learn more about welcoming a child or youth into your home until they can be reunited with family or community.</p>
                <div className="buttonGroup">
                <Button onClick={() => {
                    window.open(
                        "https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/fostercaregiving",
                        "_blank",
                        "noopener,noreferrer"
                    )
                    }} variant="learnmore">Learn more <ExternalLink className="buttonIcon" /></Button>
                    {!disabled && (
                      <><Button onClick={handleStartClick} 
                        variant={isStarting ? "disabled" : "primary"}>Apply to become a foster caregiver</Button>
                      </>
                    )}
                    
                </div>
            </div>
    )
}

export default FosterApplicationStart;