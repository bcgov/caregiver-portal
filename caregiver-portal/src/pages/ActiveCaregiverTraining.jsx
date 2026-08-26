import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import Modal from '../components/Modal';
import { useAttachments } from '../hooks/useAttachments';
import { useDates } from '../hooks/useDates';
import { FilePlus, FileCheck, X } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';
import "../DesignTokens.css";

const IN_SERVICE_TRAINING_TYPE = 'In-Service Training Certificate';

const ActiveCaregiverTraining = () => {
  const navigate = useNavigate();
  const {
    uploadInServiceTraining,
    getInServiceTrainingAttachments,
    submitInServiceTraining,
    deleteAttachment,
  } = useAttachments();
  const { formatShortDate } = useDates();
  const { userProfile }  = useUserProfile();

  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [allPendingFiles, setAllPendingFiles] = React.useState([]);
  const [submittedAttachments, setSubmittedAttachments] = React.useState([]);
  const [fileRefreshKey, setFileRefreshKey] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'In-service training' },
  ];

  const handleBackClick = (item) => navigate(item.path);

  React.useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const all = await getInServiceTrainingAttachments();
        const training = all.filter(a => a.attachmentType === IN_SERVICE_TRAINING_TYPE);
        setSubmittedAttachments(training.filter(a => a.icmAttachmentId));
        setAllPendingFiles(training.filter(a => !a.icmAttachmentId));
      } catch (err) {
        console.error('Failed to load attachments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttachments();
  }, [fileRefreshKey]);

  React.useEffect(() => {
    if (!isModalOpen) return;
    const fetchPending = async () => {
      try {
        const all = await getInServiceTrainingAttachments();
        const pending = all.filter(
          a => a.attachmentType === IN_SERVICE_TRAINING_TYPE && !a.icmAttachmentId,
        );
        setAllPendingFiles(pending);
      } catch (err) {
        console.error('Failed to load attachments:', err);
      }
    };
    fetchPending();
  }, [isModalOpen, fileRefreshKey]);

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
    setAllPendingFiles([]);
    setSubmitError(null);
    setFileRefreshKey(k => k + 1);
  };

  const handleDocUpload = async (uploadData) => {
    const fileName = `${userProfile?.first_name}_${userProfile?.last_name}_${IN_SERVICE_TRAINING_TYPE}`;
    await uploadInServiceTraining({
      ...uploadData,
      fileName,
      attachmentType: IN_SERVICE_TRAINING_TYPE,
    });
    setFileRefreshKey(k => k + 1);
  };

  const handleDocDelete = async (attachmentId) => {
    await deleteAttachment(attachmentId);
    setFileRefreshKey(k => k + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitInServiceTraining();
      setFileRefreshKey(k => k + 1);
      handleModalClose(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit in-service training certificates');
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
          <h1 className="page-title">In-service training</h1>
        </div>

        <div className="resubmission-subtitle">
          <hr className="gold-underline-large" />
          <h2 className="page-heading">Upload in-service training certificates</h2>
          <div>
            <p>Upload your in-service training certificates here. Once submitted, your social worker will be notified.</p>
          </div>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="page-details-row-small">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <FilePlus size="16" />
                Submit a training certificate
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
              title="Submit a training certificate"
              size="large"
            >
              <div className="upload-docs-section">
                <FileUpload
                  attachmentType={IN_SERVICE_TRAINING_TYPE}
                  onUpload={handleDocUpload}
                  onDelete={handleDocDelete}
                  uploadedFiles={allPendingFiles}
                  isModal={true}
                />
              </div>

              {allPendingFiles.length > 0 && (
                <div className="upload-docs-section">
                  <h3 className="uploaded-files-title">Ready to submit</h3>
                  <div className="uploaded-files-list">
                    {allPendingFiles.map((file) => (
                      <div key={file.attachmentId} className="uploaded-file-item">
                        <FileCheck size="20" className="file-icon" />
                        <div className="uploaded-file-info">
                          <span className="uploaded-file-name">{file.fileName}</span>
                          <span className="uploaded-file-size">{formatShortDate(file.createdAt)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDocDelete(file.attachmentId)}
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

              <div className="upload-button-row">
                <Button
                  variant="secondary"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting || allPendingFiles.length === 0}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit File(s) to MCFD'}
                </Button>
              </div>
            </Modal>

            <div className="page-details-row-footer">
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Back to dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActiveCaregiverTraining;