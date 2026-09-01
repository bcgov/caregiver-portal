import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import Modal from '../components/Modal';
import { useHousehold } from '../hooks/useHousehold';
import { useAttachments } from '../hooks/useAttachments';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { useDates } from '../hooks/useDates';
import { FilePlus, FileCheck, X } from 'lucide-react';
import "../DesignTokens.css";

const TRAINING_CERTIFICATE_TYPE = 'PRIDE Certificate';

const ProspectiveCaregiverTraining = () => {
    const { applicationPackageId } = useParams();
    const navigate = useNavigate();
    const { loadHousehold, primaryApplicant, partner } = useHousehold({ applicationPackageId });
    const {
      uploadAttachment,
      getAttachmentsByApplicationPackageId,
      deleteAttachment,
      submitTrainingCertificates,
    } = useAttachments();
    const { getApplicationPackage } = useApplicationPackage();
    const { formatShortDate } = useDates();
  
    const [isLoadingData, setIsLoadingData] = React.useState(true);
    const [applicationPackage, setApplicationPackage] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedMember, setSelectedMember] = React.useState(null);
    const [allPendingFiles, setAllPendingFiles] = React.useState([]);
    const [submittedAttachments, setSubmittedAttachments] = React.useState([]);
    const [fileRefreshKey, setFileRefreshKey] = React.useState(0);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(null);
  
    const hasTrainingCertificates = applicationPackage?.hasTrainingCertificates === true;

  
    const breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Become a foster caregiver', path: `/foster-application/${applicationPackageId}` },
      { label: 'Training certificates' },
    ];
  
    const handleBackClick = (item) => navigate(item.path);
  
    const memberOptions = React.useMemo(() => {
      const opts = [{
        householdMemberId: primaryApplicant?.householdMemberId ?? null,
        role: 'primary',
        label: `${primaryApplicant?.firstName ?? ''} ${primaryApplicant?.lastName ?? ''} (You)`,
        firstName: primaryApplicant?.firstName ?? '',
        lastName: primaryApplicant?.lastName ?? '',
      }];
      if (partner?.householdMemberId) {
        opts.push({
          householdMemberId: partner.householdMemberId,
          role: 'spouse',
          label: `${partner.firstName} ${partner.lastName} (${partner.relationship})`,
          firstName: partner.firstName,
          lastName: partner.lastName,
        });
      }
      return opts;
    }, [primaryApplicant, partner]);

    const allMembersCovered = React.useMemo(() =>
      memberOptions.every(opt =>
        allPendingFiles.some(f => (f.householdMemberId ?? null) === (opt.householdMemberId ?? null))
      ),
      [memberOptions, allPendingFiles],
    );
  
    const getMemberLabel = (householdMemberId) => {
      const match = memberOptions.find(o => (o.householdMemberId ?? null) === (householdMemberId ?? null));
      return match?.label ?? 'Unknown';
    };
  
    React.useEffect(() => {
      const load = async () => {
        try {
          const [pkg] = await Promise.all([
            getApplicationPackage(applicationPackageId),
            loadHousehold(),
          ]);
          setApplicationPackage(pkg);
        } catch (err) {
          console.error('Failed to load data:', err);
        } finally {
          setIsLoadingData(false);
        }
      };
      load();
    }, []);
  
    React.useEffect(() => {
      if (isLoadingData) return;
      const fetchAttachments = async () => {
        try {
          const all = await getAttachmentsByApplicationPackageId(applicationPackageId);
          const training = all.filter(a => a.attachmentType === TRAINING_CERTIFICATE_TYPE);
          setSubmittedAttachments(training.filter(a => a.icmAttachmentId));
        } catch (err) {
          console.error('Failed to load attachments:', err);
        }
      };
      fetchAttachments();
    }, [isLoadingData, fileRefreshKey]);
  
    React.useEffect(() => {
      if (!isModalOpen) return;
      const fetchAll = async () => {
        try {
          const all = await getAttachmentsByApplicationPackageId(applicationPackageId);
          const pending = all.filter(
            a => a.attachmentType === TRAINING_CERTIFICATE_TYPE && !a.icmAttachmentId,
          );
          setAllPendingFiles(pending);
        } catch (err) {
          console.error('Failed to load attachments:', err);
        }
      };
      fetchAll();
    }, [isModalOpen, fileRefreshKey]);
  
    const sectionFiles = React.useMemo(() => {
      if (!selectedMember) return [];
      return allPendingFiles.filter(
        a => (a.householdMemberId ?? null) === (selectedMember.householdMemberId ?? null),
      );
    }, [allPendingFiles, selectedMember]);
  
    const handleModalClose = async (skipDelete = false) => {
      if (!skipDelete) {
        for (const f of allPendingFiles) {
          try {
            await deleteAttachment(f.attachmentId);
          } catch (err) {
            console.error('Failed to delete attachment on modal close:', err);
          }
        }
      }
      setIsModalOpen(false);
      setSelectedMember(null);
      setAllPendingFiles([]);
      setSubmitError(null);
    };
  
    const handleDocUpload = async (uploadData) => {
      const memberName = `${selectedMember?.firstName ?? ''}_${selectedMember?.lastName ?? ''}`;
      const docTypeSafe = TRAINING_CERTIFICATE_TYPE.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');
      const fileName = `${memberName}_${docTypeSafe}`;
      await uploadAttachment({
        ...uploadData,
        fileName,
        householdMemberId: selectedMember?.householdMemberId ?? null,
        attachmentType: TRAINING_CERTIFICATE_TYPE,
        applicationPackageId,
      });
      setFileRefreshKey(k => k + 1);
    };
  
    const handleDocDelete = async (attachmentId) => {
      await deleteAttachment(attachmentId);
      setFileRefreshKey(k => k + 1);
    };
  
    const handleRemovePending = async (attachmentId) => {
      await deleteAttachment(attachmentId);
      setFileRefreshKey(k => k + 1);
    };
  
    const handleSubmitToICM = async () => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await submitTrainingCertificates(applicationPackageId);
        const pkg = await getApplicationPackage(applicationPackageId);
        setApplicationPackage(pkg);
        setFileRefreshKey(k => k + 1);
        handleModalClose(true);
      } catch (err) {
        setSubmitError(err.message || 'Failed to submit training certificates');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className="page">
        <div className="page-details">
          <div className="page-details-row-breadcrumb">
            <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
          </div>
          <div className="page-details-row-small">
            <h1 className="page-title">Caregiver training</h1>
          </div>
  
          <div className="resubmission-subtitle">
            <hr className="gold-underline-large" />
            <h2 className="page-heading">Pre-service training</h2>
          </div>
      
  
          {isLoadingData ? (
            <p>Loading...</p>
          ) : hasTrainingCertificates ? (
            <>
              <div className="page-details-row-small">
                <div className="info-box" style={{ borderColor: 'green' }}>
                  Your training certificates have been submitted. A social worker will review them as part of your assessment.
                </div>
              </div>
  
              {submittedAttachments.length > 0 && (
                <>
                  <div className="resubmission-subtitle">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Submitted certificates</h2>
                  </div>
                  <div className="page-details-row-small">
                    <div className="resubmission-group">
                      {submittedAttachments.map(att => (
                        <div key={att.attachmentId} className="resubmission-form-row">
                          <span className="resubmission-form-download">
                            <FileCheck size="20" className="inline-icon" />
                            {att.fileName}
                          </span>
                          <span className="resubmission-form-date">
                            Submitted {formatShortDate(att.sentToICMAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
  
              <div className="page-details-row-footer">
                <Button variant="secondary" onClick={() => navigate(`/foster-application/${applicationPackageId}`)}>
                  Back to application
                </Button>
              </div>
            </>
          ) : (
            <>

            <div className="page-details-row">
              <p>Pre-Service training is required for all new prospective caregivers. Pre-Service is 35 hours of online training, facilitated by a group of specialized virtual facilitators, and is completed over a 12-week period. Your social worker has registered you for the training and will have forwarded you a link where you can complete it online.</p>

              <p>Once you have completed the training, upload the training certificate <strong>for yourself and for any other co-applicants</strong>. </p>
            </div>
          
              <div className="page-details-row-small">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  <FilePlus size="16" />
                  Submit your training certificate(s)
                </Button>
              </div>
  
              {submittedAttachments.length > 0 && (
                <>
                  <div className="resubmission-subtitle">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Submitted certificates</h2>
                  </div>
                  <div className="page-details-row-small">
                    <div className="resubmission-group">
                      {submittedAttachments.map(att => (
                        <div key={att.attachmentId} className="resubmission-form-row">
                          <span className="resubmission-form-download">
                            <FileCheck size="20" className="inline-icon" />
                            {att.fileName}
                          </span>
                          <span className="resubmission-form-date">
                            Submitted {formatShortDate(att.sentToICMAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
  
              <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title="Submit your training certificate(s)"
                size="large"
              >
                <div className="upload-docs-controls-list">
                  <div className="upload-docs-field">
                    {memberOptions.length == 2 && (<p>Upload training documents for every applicant</p>)}
                    <label htmlFor="member-select" className="form-control-label">
                      {allPendingFiles.length === 0 && ("Which person is this document for?")}
                      {allPendingFiles.length === 1 && memberOptions.length === 2 && ("Add another document")}
                      </label>
                    <select
                      id="member-select"
                      value={selectedMember?.householdMemberId ?? ''}
                      onChange={(e) => {
                        const opt = memberOptions.find(
                          o => (o.householdMemberId ?? '') === e.target.value,
                        );
                        setSelectedMember(opt ?? null);
                      }}
                    >
                      <option value="" disabled>Please select</option>
                      {memberOptions.map(opt => (
                        <option key={opt.householdMemberId ?? 'primary'} value={opt.householdMemberId ?? ''}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
  
                {selectedMember && (
                  <div className="upload-docs-section">
                    <FileUpload
                      attachmentType={TRAINING_CERTIFICATE_TYPE}
                      onUpload={handleDocUpload}
                      onDelete={handleDocDelete}
                      uploadedFiles={sectionFiles}
                      applicationPackageId={applicationPackageId}
                      householdMemberId={selectedMember.householdMemberId}
                      isModal={true}
                    />
                  </div>
                )}
  
                {allPendingFiles.length > 0 && (
                  <div className="upload-docs-section">
                    <h3 className="uploaded-files-title">Ready to submit</h3>
                    <div className="uploaded-files-list">
                      {allPendingFiles.map((file) => (
                        <div key={file.attachmentId} className="uploaded-file-item">
                          <FileCheck size="20" className="file-icon" />
                          <div className="uploaded-file-info">
                            <span className="uploaded-file-name">{file.fileName}</span>
                            <span className="uploaded-file-size">{getMemberLabel(file.householdMemberId)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePending(file.attachmentId)}
                            className="uploaded-file-remove"
                            aria-label="Remove file"
                          >
                            <X size="20" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                {submitError && (
                  <div className="file-upload-error">
                    <span>{submitError}</span>
                  </div>
                )}

                {allPendingFiles.length > 0 && !allMembersCovered && (
                  <div className="file-upload-error">
                    <span>Upload a training certificate for each applicant before submitting.</span>
                  </div>
                )}
  
                <div className="upload-button-row">
                  <Button
                    variant="secondary"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={isSubmitting || !allMembersCovered ? "disabled" : "primary"}
                    onClick={handleSubmitToICM}
                    disabled={isSubmitting || !allMembersCovered}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit File(s) to MCFD'}
                  </Button>
                </div>
              </Modal>
  
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default ProspectiveCaregiverTraining;