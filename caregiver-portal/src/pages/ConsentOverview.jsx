import React from 'react';
import { Check, CircleDashed, CircleAlert } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import { useHousehold } from '../hooks/useHousehold';
import { useInviteHouseholdMember } from '../hooks/useInviteHouseholdMember';


const ConsentOverview = () => {
  const { applicationPackageId, householdMemberId } = useParams();
  const navigate = useNavigate();
  const [householdMember, setHouseholdMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loadHouseholdMember } = useHousehold({ applicationPackageId });


  const breadcrumbItems = [
    { label: 'Back', path: `/foster-application/application-package/${applicationPackageId}/consent-summary` },
  ];

  React.useEffect(() => {
    const fetchMember = async () => {
        if (householdMemberId) {
            setIsLoading(true);
            try {
                const member = await loadHouseholdMember(householdMemberId);
                setHouseholdMember(member);
                console.log('loaded household member:', member);
            } catch (error) {
                console.error('Failed to load household member:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    fetchMember();
  }, [householdMemberId, loadHouseholdMember]);

  //TODO: Load the access code for demo purposes.

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} /> 
       <div className="consent-overview-form">
       <h1>{householdMember?.firstName} {householdMember?.lastName}</h1>
       <div className="caption"><CircleAlert className='alert'></CircleAlert><span>0 of 3 tasks completed:</span></div>
       <div className="task-list">
        <div className="task-list-item">
            { householdMember?.userId  === null ? (
                <CircleDashed className="task-list-item-missing"></CircleDashed> )
             : ( 
                <Check className="task-list-item-check"></Check>
            )}
            
            <span className="task-list-item-supporting-text">Logged into portal and used Access Code</span>
        </div>
        <div className="task-list-item">
        { householdMember?.userId  === null ? (
                <CircleDashed className="task-list-item-missing"></CircleDashed> )
             : ( 
                <Check className="task-list-item-check"></Check>
            )}
            <span className="task-list-item-supporting-text">Completed Household Screening 'Application'</span>
        </div>
        <div className="task-list-item">
        { householdMember?.userId  === null ? (
                <CircleDashed className="task-list-item-missing"></CircleDashed> )
             : ( 
                <Check className="task-list-item-check"></Check>
            )}
            <span className="task-list-item-supporting-text">Provided Consent to Collection of Information</span>
        </div>
       </div>
       <div className="section-description">
        { householdMember?.userId === null && (
            <>
            <p>We sent an invitation to <strong>{householdMember?.email}</strong> on {householdMember?.invitationLastSent}</p>
            <p>{householdMember?.firstName} has not yet logged in to complete their application information.</p>
            <p>Once they have logged into the portal with their BC Services Card, they can use acccess code: <strong>ABCDE</strong> to complete their application activities. This access code was provided in the email we sent.</p>
            </>
        )}
       </div>
       </div>  
    </div>
  );

};

export default ConsentOverview;