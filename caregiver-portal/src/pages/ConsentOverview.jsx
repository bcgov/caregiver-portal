import React from 'react';
import { Check, CircleDashed, CircleAlert, Flag, ExternalLink, BookText  } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import { useHousehold } from '../hooks/useHousehold';
import FileUpload from '../components/FileUpload';
import { useAttachments } from '../hooks/useAttachments';
import { useApplications } from '../hooks/useApplications';
import Declaration from '../components/Declaration';
import Button from '../components/Button';


const ConsentOverview = () => {
  const { applicationPackageId, householdMemberId } = useParams();
  const navigate = useNavigate();
  const [householdMember, setHouseholdMember] = useState(null);
  const [screeningFormId, setScreeningFormId] = useState(null);
  const [screeningStatus, setScreeningStatus] = useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [manualScreeningStatus, setManualScreeningStatus] = useState(false);
  const { uploadAttachment, getAttachmentsByHouseholdId, deleteAttachment } = useAttachments();
  const [uploadedFiles, setUploadedFiles ] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const { loadHouseholdMember } = useHousehold({ applicationPackageId });
  const { markScreeningDocumentsAttached } = useApplications();
  const  back = `/foster-application/application-package/${applicationPackageId}/consent-summary`


  const breadcrumbItems = [
    { label: 'Back', path: back },
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
                  const screeningForm = member.applicationForms.find(form => form.type === "Screening");
                  if (screeningForm) {
                    setScreeningFormId(screeningForm.applicationFormId);
                    setIsLocked(screeningForm.userAttachedForm);
                   }
                  const hasCompletedScreening = member.applicationForms.some(form => form.type === "Screening" && form.status === "Complete");
                  setScreeningStatus(hasCompletedScreening);
                }
                //console.log('loaded household member:', member);
            } catch (error) {
                console.error('Failed to load household member:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    fetchMember();
  }, [householdMemberId, loadHouseholdMember]);

    const handleUpload = async (uploadData) => {
      try {
        const fileExtension = uploadData.fileName.split('.').pop();
        const existingSequences = uploadedFiles.filter(
          file => file.attachmentType === uploadData.attachmentType
        ).map(file => {
          //extract sequence number from filename 
          const match = file.fileName.match(/_(\d{3})\.[^.]+$/);
          return match ? parseInt(match[1], 10) : 0;
        });

        const nextSequence = existingSequences.length > 0 ? Math.max(...existingSequences) + 1 : 1;
        const sequenceNumber = String(nextSequence).padStart(3, '0')
        const firstName = householdMember?.householdMember?.firstName || '';
        const lastName = householdMember?.householdMember?.lastName || '';
        const newFileName = `${firstName}_${lastName}_${uploadData.attachmentType}_${sequenceNumber}.${fileExtension}`;

        //override the filename
        const modifiedUploadData = {
          ...uploadData,
          fileName: newFileName,
        };

        await uploadAttachment(modifiedUploadData);
        loadAttachments();
        
      } catch (error) {
        
        console.error('Upload failed:', error.message);
      }
    };
  
    const handleDeleteAttachment = async (attachmentId) => {
      try {
        await deleteAttachment(attachmentId);
        await loadAttachments();
      } catch (error) {
        console.error('Delete failed:', error.message);
      }
    }
  
    const loadAttachments = async () => {
      try {
        const attachments = await getAttachmentsByHouseholdId(householdMemberId);
        console.info("getting attachments", attachments);

        
        setManualScreeningStatus(attachments.length > 0);
        
        setUploadedFiles(attachments);
      } catch (error) {
        console.error('Failed to load attachments:', error);
      }
    }
  
    React.useEffect(() => {
      if (applicationPackageId) {
        loadAttachments();
      } else {
        console.error("no bueno");
      }
    }, []);

    const handleSubmitConsentForms = async () => {
      try {
        if(!householdMemberId || !applicationPackageId) {
          console.error('Missing required IDs');
          return;
        }
        
        const result = await markScreeningDocumentsAttached(applicationPackageId, householdMemberId);
        console.log(`Marked ${result.formsUpdated} screening form(s) as attached`);
        navigate(back)
      } catch (error) {
        console.error('Failed to mark form as attached:', error);
      }
    };

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
          <h1>{householdMember?.householdMember?.firstName} {householdMember?.householdMember?.lastName} consent for screening status</h1>
        </div>
        
        { !manualScreeningStatus && (
          <>
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
            </div>
          </div>
          <div className="page-details-row">
            <div className="section-description">
              { householdMember?.householdMember?.userId === null && (
                  <>
                  <p>We sent an invitation to <strong>{householdMember?.householdMember?.email}</strong> on {householdMember?.householdMember?.invitationLastSent}</p>
                  <p>{householdMember?.householdMember?.firstName} has not yet logged in to complete their application information.</p>
                  <p>Once they have logged into the portal with their BC Services Card, they can use acccess code: <strong>ABCDE</strong> to complete their application activities. This access code was provided in the email we sent.</p>
                  <p>If {householdMember?.householdMember?.firstName} is unable to complete these tasks via the Portal (for example, if they don’t have a BC Services Card), have them complete and sign these forms on paper then upload them below.</p>
                  </>
              )}
              { householdMember?.householdMember?.userId !== null && (
                  <>
                  <p>{ householdMember?.householdMember?.firstName} has logged into the Caregiver Portal.</p>
                  </>
              )}
            </div>
          </div>
          </>
        )}

        {manualScreeningStatus && (
          <div className="page-details-row">
            <div className="section-description">
              <p>You have uploaded one or more files on behalf of {householdMember?.householdMember?.firstName}</p>
              { !isLocked && (
                <>
                <Declaration
                  checked={isDeclarationChecked}
                  onChange={setIsDeclarationChecked}
                >
                I declare that the information I have submitted has been signed by {householdMember?.householdMember?.firstName} {householdMember?.householdMember?.lastName}
                </Declaration>
                <Button
                  variant={isDeclarationChecked ? 'primary' : 'disabled'}
                  disabled={!isDeclarationChecked}
                  onClick={handleSubmitConsentForms}
                  >Submit Consent Forms</Button>
                </>
              )}
            </div>
          </div>
        )}

       <div className="page-details-row-small">       
        <div className="page-details-col">          
          <FileUpload
          attachmentType="Criminal Record Check"
          onUpload={handleUpload}
          onDelete={handleDeleteAttachment}
          uploadedFiles={uploadedFiles}
          applicationPackageId={applicationPackageId}
          applicationFormId={screeningFormId}
          householdMemberId={householdMemberId}
          isLocked={isLocked}
          acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png']}
          maxSizeMB={10}
          description="Criminal Record Check"
          />   
       </div>
      </div>

       
       </div>
    </div>
  );

};

export default ConsentOverview;