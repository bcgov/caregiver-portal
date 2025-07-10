import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { useAuth } from "../auth/useAuth";

const FosterCard = ({ variant = 'login', children, ...props }) => {
    const { login } = useAuth();


    const startApplication = () => {
        alert("start application!");
    }

    const handleClick = () => {
        if(variant === 'login') {
            alert("log in!");
            login();
        } else if (variant === 'startapplication') {
            startApplication();
        }
    };

    return (
                <div className="card">
                    <h2>Apply to be a Foster Caregiver</h2>
                    <p>
                      Foster caregiving is about opening your home and sharing your love, nurturing and caring for children and youth in B.C. who
                      are under the age of 19 and who temporarily cannot live with their own families.
                    </p>
                    <div className="buttonGroup">
                      <Button variant="secondary" onClick={() => { window.location.href="https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/fostercaregiving"}}>Learn more</Button>
                      <br/><br/>
                      <Button variant="primary" onClick={handleClick}>Start application</Button>
                    </div>
                  </div>
        
    );
  };

FosterCard.propTypes = {
  variant: PropTypes.oneOf(['login', 'startapplication']),
  children: PropTypes.node.isRequired,
};

export default FosterCard;