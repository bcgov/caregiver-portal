import React from 'react';
import Button from './Button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScreeningTaskCard = ({applicationForm}) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (applicationForm.applicationFormId) {
        navigate(`/screening-form/${applicationForm.applicationFormId}`);
        }
    };

    const getStatusInfo = () => {
      if (!applicationForm){
        return {
          text: 'Loading...',
          className: 'task-card-status--loading'
        }
      }

      const {type} = applicationForm;

      if (type === 'Screening') {
        return {
          text: 'Screening Information Required',
          className: 'task-card-status--requested'
        }
      }


      return {
        text: 'In progress',
        className: ''
      };

    };

    const statusInfo = getStatusInfo();

    return (
      <div className="task-card" onClick={() => applicationForm.status === "Complete" ? null : handleClick()}>

      {applicationForm.status === "Complete" && 
        <div className="task-card-content">
                
            <div className="task-card-title">Your household screening form was successfully submitted</div>
            <div className="caption-small">Submitted on {applicationForm.submittedAt}</div>

        </div>
      }
      {applicationForm.status !== "Complete" && 
        <div className="task-card-content">
                
            <div className="task-card-title">Complete your foster caregiver household screening form</div>
            <Button variant="primary">Continue<ArrowRight></ArrowRight></Button>
        </div>
      }
    </div>
    );
  };

export default ScreeningTaskCard;