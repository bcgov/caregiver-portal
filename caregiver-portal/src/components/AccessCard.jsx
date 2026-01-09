import React from 'react';
import Button from './Button';
import { useAccessCode } from '../hooks/useAccessCode';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const AccessCard = () => {
    const [accessCode, setAccessCode] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [showSuccess, setShowSuccess] = React.useState('');
    const { associateAccessCode, isLoading } = useAccessCode();
    const navigate = useNavigate();
    //const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = async(e) => {

        e.preventDefault();



        if (!accessCode.trim()) {
            setMessage('Please enter a valid access code.');
            return;
        }

        try {
            const result = await associateAccessCode(accessCode.trim());
            setShowSuccess('Access code associated successfully, opening screening form...');
            //setMessage('Access code associated successfully, opening screening form...');
            console.log("Access code associated, result:", result);
            // navigate to the application page using the returned applicationId
            setTimeout(() => {
                navigate(`/screening-package/${result.householdMemberId}`);
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
                        maxLength={6}
                        />

                        {message && !showSuccess && (
                            <p style={{ color: message.includes('verified') ? 'green' : 'red', margin: '10px 0'}}>
                                {message}
                            </p>
                        )}

                        
                    
                        <Button 
                            variant="lowkey" 
                            onClick={handleClick}
                            >
                            {isLoading ? 'Verifying...' : 'Submit'}
                            <ArrowRight className="minor"></ArrowRight>
                            </Button>                    

                        
                    
                        {/* Access Code Verification Overlay */}
                        {isLoading && !showSuccess && (
                            <div className="submission-overlay">
                            <div className="submission-modal">
                                <Loader2 className="submission-spinner" />
                                <p className="submission-title">Verifying Access Code</p>
                                <p className="submission-text">{message}</p>
                            </div>
                            </div>
                        )}
        

              {showSuccess && (
                  <div className="submission-overlay" style={{ 
                      backgroundColor: 'rgba(46, 133, 64, 0.05)' 
                  }}>
                      <div className="submission-modal success-modal">
                          {/* Success Icon with Animation */}
                          <div className="success-icon-wrapper">
                              <CheckCircle2 
                                  className="success-icon" 
                                  size={64} 
                                  strokeWidth={2}
                              />
                              <Sparkles 
                                  className="sparkle-icon sparkle-1" 
                                  size={24}
                              />
                              <Sparkles 
                                  className="sparkle-icon sparkle-2" 
                                  size={20}
                              />
                              <Sparkles 
                                  className="sparkle-icon sparkle-3" 
                                  size={18}
                              />
                          </div>

                          {/* Success Message */}
                          <p className="submission-title" style={{ 
                              color: '#2E8540',
                              fontSize: '1.75rem',
                              marginTop: '1.5rem'
                          }}>
                              Access code verified
                          </p>
                          <p className="submission-text" style={{ 
                              color: '#606060',
                              fontSize: '1.1rem'
                          }}>
                              Opening your screening package...
                          </p>

                          {/* Progress Bar */}
                          <div className="success-progress-bar">
                              <div className="success-progress-fill"></div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };



export default AccessCard;