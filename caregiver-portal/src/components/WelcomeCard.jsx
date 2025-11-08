import React from 'react';
import { ExternalLink } from 'lucide-react';
import Button from './Button';

const WelcomeCard = ({login}) => {

    return (
        <div className="welcome-card-container">
            <div className="welcome-card-element">
            <h1 className='welcome-card-header'>B.C. Caregiver Portal</h1>
            <p className='welcome-card-content'>Manage tasks as a registered caregiver in B.C.</p>
            </div>
            { login && (
            <div className="welcome-card-element">
            <Button variant="nav" onClick={login}>Create Account / Login</Button>
            <p className='welcome-card-content'>You need a <a className="welcome-link" href="https://id.gov.bc.ca/account/setup-instruction" target="_blank">BC Services Card Account <ExternalLink className="welcome-link-icon" /></a> to log in.</p>
            </div>
            )}
        </div>

    )
}

export default WelcomeCard;