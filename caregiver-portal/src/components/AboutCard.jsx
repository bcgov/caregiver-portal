import React from 'react';

const AboutCard = () => {


    return (

            <div className="page-details-frame">

                <div className="image-frame">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">About this site</h2>
                </div>
                
                <p className="page-content">Thank you for your interest in supporting children and youth who need a safe, stable, and nurturing home. Every child deserves care rooted in respect, belonging, and compassion. Your willingness to help makes a meaningful difference.</p>
                <p className="page-content">This Portal guides you through the steps to apply to become a care provider in British Columbia. Before you apply, please refer to the B.C. government’s <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/fostercaregiving" target="_blank" className="hyperlink">Foster Caregiving</a> and <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/kinshipcare" target="_blank" className="hyperlink">Kinship Care</a> pages for detailed information.</p>
                <p className="page-content">Using the Portal requires a <a href="https://id.gov.bc.ca/account/setup-instruction" target="_blank" className="hyperlink">BC Services Card Account</a> to verify your identity and keep your information secure.</p>
            </div>
    )
}

export default AboutCard;