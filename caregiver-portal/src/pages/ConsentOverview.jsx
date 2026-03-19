import React from 'react';
import { Check, CircleDashed, CircleAlert, Flag, ExternalLink, BookText  } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDates } from '../hooks/useDates';
import { useState } from 'react';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import { useHousehold } from '../hooks/useHousehold';
import FileUpload from '../components/FileUpload';
import { useAttachments } from '../hooks/useAttachments';
import { useApplications } from '../hooks/useApplications';
import Declaration from '../components/Declaration';
import Button from '../components/Button';
import Modal from '../components/Modal';
import DateField from '../components/Date';
import { EMAIL_REGEX } from '../constants/household';

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
  const [accessCode, setAccessCode] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSpouse, setIsSpouse] = useState(false);
  const { formatSubmissionDate } = useDates();
  const { loadHouseholdMember, getAccessCode, updateHouseholdMemberInfo, resendMemberAccessCode } = useHousehold({ applicationPackageId });
  const { markScreeningDocumentsAttached } = useApplications();
  const  back = `/foster-application/application-package/${applicationPackageId}/consent-summary`

  // edit/resend states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ lastName: '', dateOfBirth: '', email: '' });
  const [editErrors, setEditErrors] = useState({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(null);
  const [resendsRemainingToday, setResendsRemainingToday] = useState(null);
  const [cooldownMinutesRemaining, setCooldownMinutesRemaining] = useState(0);

  const breadcrumbItems = [
    { label: 'Consents from household members', path: back },
    { label: `${householdMember?.householdMember?.firstName} ${householdMember?.householdMember?.lastName} consent for screening status`, path: back },
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

  const computeCooldown = (lastSent) => {
    if (!lastSent) return 0;
    const elapsed = (Date.now() - new Date(lastSent).getTime()) / 60000;
    return elapsed < 15 ? Math.ceil(15 - elapsed) : 0;
  };

  React.useEffect(() => {
    const fetchMember = async () => {
        if (householdMemberId) {
            setIsLoading(true);
            try {
                const member = await loadHouseholdMember(householdMemberId);
                console.log(member);
                setHouseholdMember(member);
                setCooldownMinutesRemaining(
                  computeCooldown(member?.householdMember?.invitationLastSent)
                );
                if( member?.applicationForms?.length > 0) {
                  const screeningForm = member.applicationForms.find(form => form.type === "Screening");
                  if (screeningForm) {
                    setScreeningFormId(screeningForm.applicationFormId);
                    setIsLocked(screeningForm.userAttachedForm);
                   }
                  const hasCompletedScreening = member.applicationForms.some(form => form.type === "Screening" && form.status === "Complete");
                  setScreeningStatus(hasCompletedScreening);
                }
                if( member?.householdMember?.relationshipToPrimary === 'Common law' || member?.householdMember?.relationshipToPrimary === 'Partner' || member?.householdMember?.relationshipToPrimary === 'Spouse') {
                  setIsSpouse(true);
                }

                const accessCodeData = await getAccessCode(householdMemberId);
                setAccessCode(accessCodeData);
            } catch (error) {
                console.error('Failed to load household member:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    fetchMember();
  }, [householdMemberId, loadHouseholdMember]);

  React.useEffect(() => {
    if (cooldownMinutesRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownMinutesRemaining(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [cooldownMinutesRemaining]);

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
        setManualScreeningStatus(attachments.length > 0);
        
        setUploadedFiles(attachments);
      } catch (error) {
        console.error('Failed to load attachments:', error);
      }
    }
  
    React.useEffect(() => {
      if (applicationPackageId) {
        loadAttachments();
      }
    }, []);

    const handleSubmitConsentForms = async () => {
      try {
        if(!householdMemberId || !applicationPackageId) {
          console.error('Missing required IDs');
          return;
        }
        
        await markScreeningDocumentsAttached(applicationPackageId, householdMemberId);
        navigate(back)
      } catch (error) {
        console.error('Failed to mark form as attached:', error);
      }
    };

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  const handleOpenEditModal = () => {
    setEditFormData({
      lastName: householdMember?.householdMember?.lastName || '',
      dateOfBirth: householdMember?.householdMember?.dateOfBirth || '',
      email: householdMember?.householdMember?.email || '',
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const accessCodeIsInvalid = () => {
    return accessCode && (accessCode.isUsed || new Date(accessCode.expiresAt) < new Date() || accessCode.attemptCount >= 5);
  }

  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.lastName || editFormData.lastName.trim().length === 0) {
      errors.lastName = 'Last name is required';
    } else if (editFormData.lastName.length > 50) {
      errors.lastName = 'Last name cannot exceed 50 characters';
    }
    if (!editFormData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    if (editFormData.email && !EMAIL_REGEX.test(editFormData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    return errors;
  };

  const handleSaveEdit = async () => {
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
    setIsSavingEdit(true);
    try {
      await updateHouseholdMemberInfo(householdMemberId, editFormData);
      const result = await resendMemberAccessCode(householdMemberId);                                                                                         
      setAccessCode({
        accessCode: result.accessCode,                                                                                                                        
        expiresAt: result.expiresAt,                                                                                                                          
        isUsed: false,                                                                                                                                        
        attemptCount: 0,                                                                                                                                      
      });
      setResendsRemainingToday(result.resendsRemainingToday);
      const updated = await loadHouseholdMember(householdMemberId);
      setHouseholdMember(updated);
      setIsEditModalOpen(false);
      setCooldownMinutesRemaining(15);
    } catch (error) {
      setEditErrors({ submit: error.message });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setResendError(null);
    try {
      const result = await resendMemberAccessCode(householdMemberId);
      setAccessCode({
        accessCode: result.accessCode,
        expiresAt: result.expiresAt,
        isUsed: false,
        attemptCount: 0,
      });
      setResendsRemainingToday(result.resendsRemainingToday);
      setResendSuccess(true);
      setCooldownMinutesRemaining(15);
    } catch (error) {
      setResendError(error.message);
    } finally {
      setIsResending(false);
    }
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
                  { householdMember?.householdMember?.screeningInfoProvided === false ? (
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
                  <p>We sent an invitation to <strong>{householdMember?.householdMember?.email}</strong> on {householdMember?.householdMember?.invitationLastSent ?
  formatSubmissionDate(householdMember.householdMember.invitationLastSent) : 'an unknown date'}</p>
                  <p>{householdMember?.householdMember?.firstName} has not yet logged in to complete their application information.</p>
                  <p>Note, {householdMember?.householdMember?.firstName}'s last name and date of birth must <strong>exactly</strong> match the information associated with their BC Services Card. 
                    If there is a difference you can <a href="#" onClick={handleOpenEditModal} className="hyperlink">update the household member's information</a>. Updating the information will automatically send a new Access Code email. </p>
                  { accessCodeIsInvalid() && (
                    <p><strong>The access code we sent has either expired or been used too many times by a user whose information did not exactly match the information you provided. You can send a new access code or update the information you provided so they can successfully continue.</strong> </p>
                  )}
                  { !accessCodeIsInvalid() && (
                  <p>Once they have logged into the portal with their BC Services Card, they can use acccess code: <strong>{accessCode?.accessCode || 'Loading...'}</strong> to complete their application activities. This access code was provided in the email we sent.</p>
                 )}


                { !householdMember?.householdMember?.screeningInfoProvided && (
                    <>
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 
                  'center' }}>
                        { accessCodeIsInvalid() && (
                          <Button variant={cooldownMinutesRemaining > 0 ? "disabled" : "primary"} onClick={handleResend} disabled={isResending || cooldownMinutesRemaining > 0}>
                                  {isResending
                                  ? 'Sending...'
                                  : cooldownMinutesRemaining > 0
                                    ? `New Access Code Available in ${cooldownMinutesRemaining} min`
                                    : 'Send New Access Code'}
                          </Button>
                        )}
                        { resendsRemainingToday !== null && (
                          <span className="caption">{resendsRemainingToday} of 3 resends remaining today</span>
                        )}
                      </div>
                      { resendSuccess && <p style={{ color: 'green' }}>Access code resent successfully.</p> }
                      { resendError && <p style={{ color: 'red' }}>{resendError}</p> }
                    </>
                  )}
                  </>
              )}

              { !isSpouse && (
                <>
                <p>If {householdMember?.householdMember?.firstName} is unable to complete these tasks via the Portal (for example, if they don’t have a BC Services Card), have them complete and sign these forms on paper then upload them below.</p>
                <p><a href="/Consent_for_Disclosure_of_Criminal_Record_Information.pdf" download className="bright">Consent for Disclosure of Criminal Record Information <ExternalLink size={16}/></a>.</p>
                <p><a href="/Consent_for_Prior_Contact_Check.pdf" download className="bright">Consent for Prior Contact Check <ExternalLink size={16}/></a>.</p>
                </>                
              )}
              { householdMember?.householdMember?.userId !== null && (
                  <>
                  <p>{ householdMember?.householdMember?.firstName} has logged into the Portal.</p>
                  </>
              )}
            </div>
          </div>
          </>
        )}

        {manualScreeningStatus && !isSpouse && (
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

    {!isSpouse && (

       <div className="page-details-row-small">       
        <div className="page-details-col">          
          <FileUpload
          attachmentType="_"
          onUpload={handleUpload}
          onDelete={handleDeleteAttachment}
          uploadedFiles={uploadedFiles}
          applicationPackageId={applicationPackageId}
          applicationFormId={screeningFormId}
          householdMemberId={householdMemberId}
          isLocked={isLocked}
          acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png']}
          maxSizeMB={5}
          description="_"
          />   
       </div>
      </div>
    )}

       
       </div>

       <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Household Member Information"
          showCloseButton={false}
          size="medium"
        >
    <div className="form-sub-group">
      <div>
        <label htmlFor="edit-lastName" className="form-control-label">Last name</label>
        <input
          id="edit-lastName"
          type="text"
          value={editFormData.lastName}
          maxLength={50}
          onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
          className={`form-control${editErrors.lastName ? ' form-control-error' : ''}`}
        />
        {editErrors.lastName && <span style={{ color: 'red' }}>{editErrors.lastName}</span>}
      </div>
      <div>
        <label htmlFor="edit-dob" className="form-control-label">Date of birth</label>
        <DateField
          id="edit-dob"
          variant="adult"
          value={editFormData.dateOfBirth}
          required
          onChange={(e) => setEditFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
        />
      {editErrors.dateOfBirth && (
        <label className="form-control-validation-label" style={{ color: '#D8292F' }}>
          {editErrors.dateOfBirth}
        </label>
      )}
      </div>
      <div>
        <label htmlFor="edit-email" className="form-control-label">Email</label>
        <input
          id="edit-email"
          type="email"
          value={editFormData.email}
          maxLength={255}
          onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
          className={`form-control${editErrors.email ? ' form-control-error' : ''}`}
        />
        {editErrors.email && (
        <label className="form-control-validation-label" style={{ color: '#D8292F' }}>
          {editErrors.email}
        </label>
      )}
      </div>
      {editErrors.submit && (
        <label className="form-control-validation-label" style={{ color: '#D8292F' }}>
          {editErrors.submit}
        </label>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button                                                                                                  
            variant={isSavingEdit || cooldownMinutesRemaining > 0 ? 'disabled' : 'primary'}                      
            onClick={handleSaveEdit}
            disabled={isSavingEdit || cooldownMinutesRemaining > 0}
          > 
          {isSavingEdit
            ? 'Saving...'                                                                                        
            : cooldownMinutesRemaining > 0                                                                     
              ? `Available in ${cooldownMinutesRemaining} min`                                                   
              : 'Save Changes and Send New Access Code'} 
        </Button>
        <Button variant="white" onClick={() => setIsEditModalOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  </Modal>
    </div>
  );

};

export default ConsentOverview;