import React from 'react';

const AboutCard = () => {


    return (

            <div className="page-details-frame">

                <div className="image-frame">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">About the BC Caregiver Portal</h2>
                </div>
                
                <p className="page-content">Thank you for your interest in supporting children and youth who need safe, stable, and nurturing homes. This portal guides you through the steps to apply to become a caregiver in British Columbia.</p>
                <p className="page-content">Every child deserves care rooted in respect, belonging, and compassion. Your willingness to help makes a meaningful difference. Before applying, please refer to the BC Government’s <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/fostercaregiving" target="_blank" className="hyperlink">Foster Caregiving</a> and <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/kinshipcare" className="hyperlink">Kinship Care</a> pages for detailed information.</p>
                <p className="page-content">The use of the portal requires a BC Service Card to verify your identity and securely transfer information.</p>
            </div>
    )
}

export default AboutCard;