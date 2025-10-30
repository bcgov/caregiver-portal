import React from 'react';
import Button from './Button';
import Family from '../assets/foster-couple-hero.png';
import { ExternalLink } from "lucide-react";

const FosterApplicationStart = ({onClick}) => {
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
                    <img src={Family} alt="Become a foster caregiver" className="hero-image" />
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Become a foster caregiver</h2>
                </div>
                <p className="page-content">Foster caregiving is about opening your home and sharing your love, nurturing and caring for children and youth in B.C. who are under the age of 19 and who temporarily cannot live with their own families.</p>
                <div className="buttonGroup">
                    <Button onClick={handleStartClick} 
                      variant={isStarting ? "disabled" : "primary"}>Start application</Button>
                    <Button onClick={() => {window.location.href="https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/fostercaregiving"}} variant="secondary">Learn more <ExternalLink className="buttonIcon" /></Button>
                </div>
            </div>
    )
}

export default FosterApplicationStart;