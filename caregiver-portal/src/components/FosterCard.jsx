import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { useAuth } from "../hooks/useAuth";

const FosterCard = ({ variant = 'login', onStartApplication, loading = false, ...props }) => {
    const { login } = useAuth();


    const startApplication = () => {
        alert("start application!");
    }

    const handleClick = () => {
        if(variant === 'login') {
            login();
        } else if (variant === 'startapplication') {
            onStartApplication();
        }
    };

    return (
                <div className={variant === 'inprogress' ? 'inprogress-card' : 'card'}>
                    {variant !== 'inprogress' ? (                   
                    <h2>Apply to be a Foster Caregiver</h2>
                    ) : (
                      <h2>Foster Caregiver Application in progress</h2>
                    )}

                    {variant !== 'inprogress' ? (                   
                    <p>
                    Foster caregiving is about opening your home and sharing your love, nurturing and caring for children and youth in B.C. who
                    are under the age of 19 and who temporarily cannot live with their own families.
                    </p>
                    ) : (
                      <p>
                      Latest activity: June 16, 2025
                      </p>
                    )}

                    <div className="buttonGroup">

                    {(variant === 'login' || variant === 'startapplication') && (                     
                      <Button 
                        variant="primary" 
                        onClick={handleClick}
                        disabled={loading}
                        >
                          {loading ? 'Creating Application...' : 'Start application'}
                        </Button>

                      )}

                    {(variant === 'inprogress') && (                     
                      <Button 
                        variant="inprogress" 
                        onClick={handleClick}
                        disabled={loading}
                        >
                          {loading ? 'Creating Application...' : 'Continue'}
                        </Button>

                      )}

                      <br/><br/>
                      {(variant === 'login' || variant === 'startapplication') && (                      
                       <Button 
                        variant="secondary" 
                        onClick={() => { window.location.href="https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/fostercaregiving"}}
                        >Learn more</Button>
                      )}

                      {(variant === 'inprogress') && (                     
                      <Button 
                        variant="tertiary" 
                        disabled={loading}
                        >
                          {loading ? 'Creating Application...' : 'Cancel application'}
                        </Button>

                      )}                      

                    </div>
                  </div>
        
    );
  };

FosterCard.propTypes = {
  variant: PropTypes.oneOf(['login', 'startapplication','inprogress']),
  children: PropTypes.node.isRequired,
};

export default FosterCard;