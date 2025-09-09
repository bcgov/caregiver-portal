import React from 'react';

const Footer = () => {

    return (
        <div className="footer-container">
        <div className="footer-banner">
            <div className="footer-banner-content">
                The B.C. Public Service acknowledges the territories of First Nations around B.C. and is grateful to carry out our work on these lands. We acknowledge the rights, interests, priorities, and concerns of all Indigenous Peoples - First Nations, Métis, and Inuit - respecting and acknowledging their distinct cultures, histories, rights, laws, and governments.
            </div>
        </div>
        <div className="footer-links-container">
            <div className="footer-links">
            <div className="footer-links-header">
                B.C. Caregiver Portal
            </div>
            <div className="footer-links-row">
                <a href="#">Home</a>
                <a href="#">Privacy</a>
                <a href="#">Contact us</a>
            </div>
            <div className="footer-links-header">
                More Information
            </div>
            <div className="footer-links-row">
                <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth" target="blank">Caring for children and youth in B.C.</a>
            </div>
            </div>

        </div>
        </div>
    );

};

export default Footer;