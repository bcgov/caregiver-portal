import React from 'react';
import { ExternalLink } from 'lucide-react';
import Button from './Button';
import { useCommon } from '../hooks/useCommon';

const WelcomeCard = ({login, user}) => {

    const {toTitleCase} = useCommon();

    return (
        <div className="welcome-card-container">
            <div className="welcome-card-element">
            <h1 className='welcome-card-header'>Foster &amp; Care Provider Portal</h1>
            </div>
            { login && (
            <>
            <p className='welcome-card-content'>Apply to become a foster caregiver in B.C.</p>                
            <div className="welcome-card-element">

            <Button variant="nav" onClick={login}>Create Account / Login</Button>
            <p className='welcome-card-content'>You need a <a className="welcome-link" href="https://id.gov.bc.ca/account/setup-instruction" target="_blank">BC Services Card Account <ExternalLink className="welcome-link-icon" /></a> to log in.</p>
            </div>
            </>
            )}
            { !login && user && (
            <p className='welcome-card-content'>Welcome, {toTitleCase(user.name)}!</p>    
            )}

        </div>

    )
}

export default WelcomeCard;