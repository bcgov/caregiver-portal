import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { useHousehold } from '../hooks/useHousehold';
import { useAttachments } from '../hooks/useAttachments';
import { useDates } from '../hooks/useDates';
import { FilePlus, FileText, ArrowRight } from 'lucide-react';

const DOC_TYPES_BY_ROLE = {
  primary: [
    'Medical Assessment',
    'International Criminal Record Check',
    'Other Document',
  ],
  spouse: [
    'About Me (Spouse)',
    'Consent for Disclosure of Criminal Record Information',
    'Consent for Prior Contact Check',
    'Medical Assessment',
    'International Criminal Record Check',
    'Other Document',
  ],
  adult: [
    'Consent for Disclosure of Criminal Record Information',
    'Consent for Prior Contact Check',
    'Medical Assessment',
    'Other Document',
  ],
};

const FormResubmissionList = () => {
    const { applicationPackageId } = useParams();
    const navigate = useNavigate();
    const { getApplicationForms, cloneApplicationForm } = useApplicationPackage();
    const { loadHousehold, partner, householdMembers, primaryApplicant } = useHousehold({ applicationPackageId });
    const { uploadAttachment, getAttachmentsByHouseholdId, getAttachmentsByApplicationPackageId, deleteAttachment, uploadDocuments } = useAttachments();
    const { formatShortDate } = useDates();

    const [applicantForms, setApplicantForms] = React.useState([]);
    //const [householdForms, setHouseholdForms] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [cloningId, setCloningId] = React.useState(null);

    // upload documents section states
    const [selectedMember, setSelectedMember] = React.useState(null);
    const [selectedDocType, setSelectedDocType] = React.useState('');
    const [sectionFiles, setSectionFiles] = React.useState([]);
    const [fileRefreshKey, setFileRefreshKey] = React.useState(0);
    const [isSubmittingToICM, setIsSubmittingToICM] = React.useState(false);
    const [submitResult, setSubmitResult] = React.useState(null);

    const location = useLocation();
    const basePath = location.pathname.replace(/\/resubmit$/, '');  
    const isKinship = location.pathname.startsWith('/kinship-application');

    const EXCLUDED_TYPES = !isKinship ? ['Referral', 'Adults in household', 'Indigenous Background and Preferences'] : ['Referral', 'Adults in household'];

    const breadcrumbItems = [
      { label: isKinship ? 'Become a kinship caregiver' : 'Become a foster caregiver', path: basePath },
      { label: 'Update Application Forms' },
  ];

    const handleBackClick = (item) => navigate(item.path);

    const handleResubmit = async (form) => {
    setCloningId(form.applicationFormId);
    try {
        const { applicationFormId: newId } = await cloneApplicationForm(form.applicationFormId);
        const prefix = isKinship ? 'kinship-application' : 'foster-application';
        navigate(`/${prefix}/${applicationPackageId}/resubmit/${newId}`);
    } catch (err) {
        console.error('Failed to clone form:', err);
        setCloningId(null);
    }
    };

    // Load applicant forms and household member list together
    React.useEffect(() => {
      const load = async () => {
        try {
          setIsLoading(true);
          const [forms] = await Promise.all([
            getApplicationForms(applicationPackageId),
            loadHousehold(),
          ]);
          const filtered  = forms.filter(f => !EXCLUDED_TYPES.includes(f.type));
          // keep the newest form per type, in the original form's position
          const positionByType = new Map(); // type -> index in de-duped array
          const deduped = [];
          for (const form of filtered) {
            if (positionByType.has(form.type)) {
              const idx = positionByType.get(form.type);
              if (new Date(form.createdAt) > new Date(deduped[idx].createdAt)) {
                deduped[idx] = form;
              }
            } else {
              positionByType.set(form.type, deduped.length);
              deduped.push(form);
            }
          }
          setApplicantForms(deduped);
        } catch (err) {
          console.error('Failed to load forms:', err);
        } finally {
          setIsLoading(false);
        }
      };
      load();
    }, []);

    // Build member dropdown options
    const memberOptions = React.useMemo(() => {
      const opts = [{ 
        householdMemberId: primaryApplicant?.householdMemberId ?? null, 
        role: 'primary', 
        label: primaryApplicant?.firstName + " " + primaryApplicant?.lastName + " (You)", 
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
      for (const m of householdMembers) {
        if (m.householdMemberId) { 
          opts.push({
            householdMemberId: m.householdMemberId,
            role: 'adult',
            label: `${m.firstName} ${m.lastName} (${m.relationship})`,
            firstName: m.firstName,
            lastName: m.lastName,
          });
        }
      }
      return opts;
    }, [primaryApplicant, partner, householdMembers]);

    // Reload uploaded files when member, doc type, or refresh key changes
    React.useEffect(() => {
      if (!selectedMember || !selectedDocType) {
        setSectionFiles([]);
        return;
      }
      const fetchFiles = async () => {
        try {
          let files;
          if (selectedMember.householdMemberId === null) {
            const all = await getAttachmentsByApplicationPackageId(applicationPackageId);
            files = all.filter( 
              f => f.householdMemberId === null && f.attachmentType === selectedDocType,
            );
          } else {
            const all = await getAttachmentsByHouseholdId(selectedMember.householdMemberId);
            files = all.filter(f => f.attachmentType === selectedDocType);
          } 
          setSectionFiles(files);
        } catch (err) {
          console.error('Failed to load attachments:', err);
        }
      };    
      fetchFiles();
    }, [selectedMember, selectedDocType, fileRefreshKey]);

    const handleDocUpload = async (uploadData) => {
      const fileNumber = sectionFiles.length + 1;
      const memberName = `${selectedMember?.firstName ?? ''}_${selectedMember?.lastName ?? ''}`;
      const docTypeSafe = selectedDocType.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');
      const fileName = `${memberName}_${docTypeSafe}_${fileNumber}`;

      await uploadAttachment({  
        ...uploadData,
        fileName,
        householdMemberId: selectedMember?.householdMemberId ?? null,
        attachmentType: selectedDocType,
        applicationPackageId,   
      });
      setFileRefreshKey(k => k + 1);
    };
  
    const handleDocDelete = async (attachmentId) => {
      await deleteAttachment(attachmentId);
      setSectionFiles(prev => prev.filter(f => f.attachmentId !== attachmentId));
    };

    const handleSubmitToICM = async () => {
      setIsSubmittingToICM(true);
      setSubmitResult(null);
      try {
        const result = await uploadDocuments(
          applicationPackageId,
          selectedMember?.householdMemberId ?? null,
          selectedDocType,
        );
        setSubmitResult(result);
        setFileRefreshKey(k => k + 1);
      } catch (err) { 
        console.error('Failed to submit to ICM:', err);
      } finally {
        setIsSubmittingToICM(false);
      }
    };

    const renderFormRow = (form) => {
      const isToday = form.submittedAt && new Date(form.submittedAt).toDateString() === new Date().toDateString();

      return (  
      <div key={form.applicationFormId} className="resubmission-form-row">
        <span className="resubmission-form-type"><FileText size="20" className="inline-icon" />{form.type}</span>
        <span className={`resubmission-form-date${isToday ? ' resubmission-form-date--today' : ''}`}>
          {form.submittedAt ? `Submitted on ${formatShortDate(form.submittedAt)}` : 'Not yet submitted'}
        </span>
        <span className="resubmission-form-button">
        <Button
          variant="secondary"
          onClick={() => handleResubmit(form)}
          disabled={!!cloningId}
        >
          {cloningId === form.applicationFormId ? 'Opening...' : 'Resubmit form'}
          <ArrowRight size="16" />
        </Button>
        </span>
      </div>
    );
    }

    return (
      <div className="page">
        <div className="page-details">
          <div className="page-details-row-breadcrumb">
            <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
          </div>
          <div className="page-details-row-small">
            <h1 className="page-title">Add or resubmit forms</h1>
          </div>

          <div className="resubmission-subtitle">
            <hr className="gold-underline-large" />
            <h2 className="page-heading">Application package forms</h2>
          </div>
  
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="page-details-row-small">
                
                <div className="resubmission-group">
                  {applicantForms.map(renderFormRow)}
                </div>
              </div>
              {/* Upload Documents section */}
              <div className="resubmission-subtitle">
                <hr className="gold-underline-large" />
                <h2 className="page-heading">Upload Documents</h2>
              </div>
  
              <div className="page-details-row-col">
                <div className="upload-docs-controls">
                  <div className="upload-docs-field">
                  <label htmlFor="member-select" className="form-control-label">Household Member</label>
                  <select
                    id="member-select"
                    value={selectedMember?.householdMemberId ?? ''}
                    onChange={(e) => {
                      const opt = memberOptions.find(
                        o => (o.householdMemberId ?? '') === e.target.value,
                      );
                      setSelectedMember(opt ?? null);
                      console.log(selectedMember);
                      setSelectedDocType('');
                      setSubmitResult(null);
                    }}
                  >   
                    <option value="" disabled>Select a member</option>
                    {memberOptions.map(opt => (
                      <option key={opt.householdMemberId ?? 'primary'} value={opt.householdMemberId ?? ''}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  </div>

                  {selectedMember && (
                    <div className="upload-docs-field">
                      <label htmlFor="doctype-select" className="form-control-label">Document Type</label>
                      <select
                        id="doctype-select"
                        value={selectedDocType}
                        onChange={(e) => {
                          setSelectedDocType(e.target.value);
                          setSubmitResult(null);
                        }}
                      >
                        <option value="" disabled>Select a document type</option>
                        {DOC_TYPES_BY_ROLE[selectedMember.role].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      </div>
                  )}
                </div>
  
                {selectedMember && selectedDocType && (
                  <div className="upload-docs-section">
                    <FileUpload
                      attachmentType={selectedDocType}
                      onUpload={handleDocUpload}
                      onDelete={handleDocDelete}
                      uploadedFiles={sectionFiles}
                      applicationPackageId={applicationPackageId}
                      householdMemberId={selectedMember.householdMemberId}
                    />
  
                    <Button
                      variant="primary"
                      onClick={handleSubmitToICM}
                      disabled={isSubmittingToICM || sectionFiles.length === 0}
                    >
                      {isSubmittingToICM ? 'Submitting...' : 'Submit Documents to ICM'}
                      
                    </Button>   
  
                    {submitResult && (
                      <p className="submit-result">
                        {submitResult.attachmentsUploaded} document(s) submitted to ICM.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  export default FormResubmissionList;