import React from 'react';
import Button from './Button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScreeningTaskCard = ({applicationFormSet}) => {
    const navigate = useNavigate();
      // Guard: return null if no forms provided
      if (!applicationFormSet || applicationFormSet.length === 0) {
        return null;
      }

    const householdMemberId = applicationFormSet[0]?.householdMemberId;
    const numberOfForms = applicationFormSet.length;
    const numberOfCompleteForms = applicationFormSet.filter(form => form.status === "Complete").length;

    // Get latest submission date
    const latestSubmittedAt = applicationFormSet
    .filter(form => form.submittedAt)
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
      <div className="task-card" onClick={() => numberOfCompleteForms === numberOfForms ? null : handleClick()}>

      {numberOfCompleteForms === numberOfForms && 
        <div className="task-card-content">
                
            <div className="task-card-title">Your household screening form was successfully submitted</div>
            <div className="caption-small">Submitted on {latestSubmittedAt}</div>

        </div>
      }
      {numberOfCompleteForms < numberOfForms && 
        <div className="task-card-content">
                
            <div className="task-card-title">Complete your foster caregiver household screening</div>
            <div className="caption-small">{numberOfCompleteForms} of {numberOfForms} complete</div>
            <Button variant="primary">Continue<ArrowRight></ArrowRight></Button>
        </div>
      }
    </div>
    );
  };

export default ScreeningTaskCard;