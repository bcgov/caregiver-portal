import React from 'react';
import Button from './Button';
import Family from '../assets/kinship-hero.png';
import { ExternalLink } from "lucide-react";

const OOCApplicationStart = ({onClick, disabled = false}) => {
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
                    <img src={Family} alt="Explore Out-of-Care (kinship)" className="hero-image" />
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Out-of-Care (kinship)</h2>
                </div>
                <p className="page-content">When a chid or youth is unable to live with their parents, it's best if they can live with someone they know.</p>
                <div className="buttonGroup">
                    {!disabled && (
                    <Button onClick={handleStartClick} 
                      variant={isStarting ? "disabled" : "primary"}>Start application</Button>
                    )}
                    <Button onClick={() => {window.location.href="https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/kinshipcare"}} variant="secondary">Learn more <ExternalLink className="buttonIcon" /></Button>
                </div>
            </div>
    )
}

export default OOCApplicationStart;