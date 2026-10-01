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

            <div className="page-details-frame kinship-care-frame">
                <div className="image-frame">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Kinship Care</h2>
                </div>
                <p className="page-content">Kinship care helps children and youth live with people they already know and trust, such as extended family members, close family friends, or adults with a cultural or traditional connection.</p>
                <div className="buttonGroup">
                    <Button onClick={() => {
                        window.open(
                            "https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/kinshipcare",
                            "_blank",
                            "noopener,noreferrer"
                        )
                        }} variant="learnmore">Learn more about kinship care<ExternalLink className="buttonIcon" /></Button>
                </div>
                <p className="page-content">Applications to become a kinship care provider must be initiated by a worker from the Ministry of Children and Family Development or an Indigenous Child and Family Service Agency.  If a worker has invited you to apply, watch your email for an invitation and access code.</p>
            </div>
    )
}

export default OOCApplicationStart;