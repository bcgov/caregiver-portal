import React from 'react';
import Button from './Button';
import { useAccessCode } from '../hooks/useAccessCode';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';

const AccessCard = () => {
    const [accessCode, setAccessCode] = React.useState('');
    const [message, setMessage] = React.useState('');
    const { associateAccessCode, isLoading } = useAccessCode();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = React.useState(false);
    //const [isLoading, setIsLoading] = React.useState(false);

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
                case 'Error: Invalid or expired access code':
                    setMessage('Error: This access code is invalid or expired. Please check the code and try again, or contact the primary applicant for a new code.');
                    break;
                default:
                    setMessage(`Error: ${err.message}`);
            }
            setMessage(`Error: ${err.message}`);
        }
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
                
                        <div className="task-card-minor-container">
                        <p className="task-card-content">
                        Access code
                        </p>
                        <input type="text" 
                        placeholder="Enter Access Code" 
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        disabled={isLoading}
                        className='access-form-control'
                        />

                        {message && (
                            <p style={{ color: message.includes('verified') ? 'green' : 'red', margin: '10px 0'}}>
                                {message}
                            </p>
                        )}

                        
                    
                        <Button 
                            variant="lowkey" 
                            onClick={handleClick}
                            >
                            {isLoading ? 'Verifying...' : 'Submit'}
                            <ArrowRight class="minor"></ArrowRight>
                            </Button>                    

                        
                    
                        {/* Access Code Verification Overlay */}
                        {isLoading && (
                            <div className="submission-overlay">
                            <div className="submission-modal">
                                <Loader2 className="submission-spinner" />
                                <p className="submission-title">Verifying Access Code</p>
                                <p className="submission-text">{message}</p>
                            </div>
                            </div>
                        )}
                        </div>
                        
                
        
    );
  };


export default AccessCard;