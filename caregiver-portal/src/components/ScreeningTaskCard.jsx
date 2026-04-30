import React from 'react';
import Button from './Button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScreeningTaskCard = ({applicationFormSet, householdMembership}) => {
    const navigate = useNavigate();

    const householdMemberId = applicationFormSet?.[0]?.householdMemberId ?? householdMembership?.householdMemberId;
    // Get latest submission date
    const latestSubmittedAt = applicationFormSet
    ?.filter(form => form.submittedAt)
    .reduce((latest, form) => {
      const currentDate = new Date(form.submittedAt);
      return !latest || currentDate > new Date(latest) ? form.submittedAt : latest;
    }, null);

    const handleClick = () => {
      if (householdMemberId) {
        navigate(`/screening-package/${householdMemberId}`);
        }
    };

    return (
      <div className="task-card" onClick={() => householdMembership?.screeningInfoProvided ? null : handleClick()}>

      {householdMembership?.screeningInfoProvided && 
        <div className="task-card-content">
                
            <div className="task-card-title">Your household screening form was successfully submitted</div>
            <div className="caption-small">Submitted on {latestSubmittedAt}</div>

        </div>
      }
      {!householdMembership?.screeningInfoProvided && 
        <div className="task-card-content">
                
            <div className="task-card-title">Complete your foster caregiver household screening</div>

            <Button variant="primary">Continue<ArrowRight></ArrowRight></Button>
        </div>
      }
    </div>
    );
  };

export default ScreeningTaskCard;