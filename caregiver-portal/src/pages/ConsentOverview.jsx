import React from 'react';
import { Check, CircleDashed, CircleAlert, Flag, ExternalLink, BookText  } from 'lucide-react';
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
  const [screeningStatus, setScreeningStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loadHouseholdMember } = useHousehold({ applicationPackageId });


  const breadcrumbItems = [
    { label: 'Back', path: `/foster-application/application-package/${applicationPackageId}/consent-summary` },
  ];



  const getCurrentStep = () => {
    let step = 0;
    if(householdMember?.householdMember?.userId){
      step++;
    }
    if(screeningStatus) {
      step++;
    }
    return step
  };

  React.useEffect(() => {
    const fetchMember = async () => {
        if (householdMemberId) {
            setIsLoading(true);
            try {
                const member = await loadHouseholdMember(householdMemberId);
                setHouseholdMember(member);
                if( member?.applicationForms?.length > 0) {
                  const hasCompletedScreening = member.applicationForms.some(form => form.type === "Screening" && (form.status === "DRAFT" || form.status === "SAVED"));
                  setScreeningStatus(hasCompletedScreening);
                }
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
    <div className="page">
      <div className="page-details">
        <div className="page-details-row-breadcrumb">
          <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} /> 
        </div>
        <div className="page-details-row-small">
          <h1>{householdMember?.householdMember?.firstName} {householdMember?.householdMember?.lastName}</h1>
        </div>
        <div className="page-details-row-small">
        <div className="page-details-content-col">
          <div className="caption"><span> {getCurrentStep()} of 2 tasks completed:</span></div>
          <div className="task-list">
          <div className="task-list-item">
            { householdMember?.householdMember?.userId  === null ? (
                <CircleAlert className="task-list-item-missing"></CircleAlert> )
             : ( 
                <Check className="task-list-item-check"></Check>
            )}
            <span className="task-list-item-supporting-text">Logged into portal and used Access Code</span>
          </div>
          <div className="task-list-item">
            { !screeningStatus ? (
                <CircleAlert className="task-list-item-missing"></CircleAlert> )
             : ( 
                <Check className="task-list-item-check"></Check>
            )}
            <span className="task-list-item-supporting-text">Completed Household Screening Form</span>
          </div>

          </div>
      <div className="page-details-row">
       <div className="section-description">
        { householdMember?.householdMember?.userId === null && (
            <>
            <p>We sent an invitation to <strong>{householdMember?.householdMember?.email}</strong> on {householdMember?.householdMember?.invitationLastSent}</p>
            <p>{householdMember?.householdMember?.firstName} has not yet logged in to complete their application information.</p>
            <p>Once they have logged into the portal with their BC Services Card, they can use acccess code: <strong>ABCDE</strong> to complete their application activities. This access code was provided in the email we sent.</p>
            </>
        )}
        { householdMember?.householdMember?.userId !== null && (
            <>
            <p>{ householdMember?.householdMember?.firstName} has logged into the Caregiver Portal.</p>
            </>
        )}
        { !screeningStatus && (
          <>
          <p>If {householdMember?.householdMember?.firstName} is unable to complete these tasks via the Portal (for example, if they don’t have a BC Services Card), complete and sign these forms on paper then upload them below.</p>

          </>
        )} 
        </div>
        
       </div>
       { !screeningStatus && (
        <div className="upload-container">
          
          <div className="upload-form-name">
           <BookText/>
            Household Screening Form
            <ExternalLink/>
            </div>
            <div className="upload-form"></div>
          
          </div>
       )}
       
       </div>
    </div>
    </div>
    </div>
  );

};

export default ConsentOverview;