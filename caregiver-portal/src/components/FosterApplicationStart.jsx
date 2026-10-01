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

            <div className="page-details-frame foster-care-frame">

                <div className="image-frame">
                {showImage && (
                    <img src={Family} alt="Become a foster caregiver" className="hero-image" />
                )}
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Foster Care</h2>
                </div>
                
                <p className="page-content">As a foster caregiver, you provide a safe and supportive home for a child or youth until they can be reunited with family or community.</p>
                <div className="buttonGroup">
                    <Button onClick={() => {
                        window.open(
                            "https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/fostercaregiving",
                            "_blank",
                            "noopener,noreferrer"
                        )
                    }} variant="learnmore">Learn more about foster care<ExternalLink className="buttonIcon" /></Button>
                    {!disabled && (
                      <><Button onClick={handleStartClick} 
                        variant={isStarting ? "disabled" : "primary"}>Start application</Button>
                      </>
                    )}
                    {disabled && (
                      <p>To begin your application to become a foster caregiver, please <a className="inline-link">create an account / log in</a>.</p>
                    )}
                </div>
            </div>
    )
}

export default FosterApplicationStart;