import React from 'react';
import Button from '../Button';
import { ArrowRight } from 'lucide-react';
import GenericTaskCard from './GenericTaskCard';
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
      <>
        {householdMembership?.screeningInfoProvided ? (
          <GenericTaskCard
            title="Your household screening form was successfully submitted"
            description={`Submitted on ${latestSubmittedAt}`}
          />
        ) : (
          <GenericTaskCard
            title="Complete your household screening"
            buttonLabel="Continue"
            onClick={handleClick}
          />
        )}
      </>
    );
  };

export default ScreeningTaskCard;