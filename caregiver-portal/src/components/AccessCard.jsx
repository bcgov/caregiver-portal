import React from 'react';
import Button from './Button';
import { useAccessCode } from '../hooks/useAccessCode';
import { useNavigate } from 'react-router-dom';

const AccessCard = () => {
    const [accessCode, setAccessCode] = React.useState('');
    const [message, setMessage] = React.useState('');
    const { associateAccessCode, isLoading } = useAccessCode();
    const navigate = useNavigate();

    const handleClick = async(e) => {

        e.preventDefault();

        if (!accessCode.trim()) {
            setMessage('Please enter a valid access code.');
            return;
        }

        try {
            const result = await associateAccessCode(accessCode.trim());
            setMessage('Access code associated successfully, opening screening form...');
            console.log("Access code associated, result:", result);
            // navigate to the application page using the returned applicationId
            setTimeout(() => {
                navigate(`/screening-form/${result.applicationFormId}`);
            }, 1500);
        } catch (err) {
            
            switch (err.message.trim()) {
                case 'No match':
                    setMessage('Error: Your BC Service Card information does not match the details supplied by the primary applicant. Did they give you the correct access code?');    
                    break;
                case 'Invalid or expired access code':
                    setMessage('Error: This access code is invalid or expired. Please check the code and try again, or contact the primary applicant for a new code.');
                    break;
                default:
                    setMessage(`Error: ${err.message}`);
            }
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
                <div className="task-card">
                  
                    <h2 className='task-card-title'>Caregiver Screening Access Code</h2>
                    <p>
                    If you have been sent an access code to complete a caregiver screening application, please enter it below.
                    </p>
                    <input type="text" 
                    placeholder="Enter Access Code" 
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    disabled={isLoading}
                    className='form-control'
                    />

                    {message && (
                        <p style={{ color: message.includes('verified') ? 'green' : 'red', margin: '10px 0'}}>
                            {message}
                        </p>
                    )}

                    <div className="buttonGroup">
                  
                      <Button 
                        variant="secondary" 
                        onClick={handleClick}
                        >
                        {isLoading ? 'Verifying...' : 'Continue with Access Code'}
                        </Button>                    

                    </div>
                  </div>
        
    );
  };


export default AccessCard;