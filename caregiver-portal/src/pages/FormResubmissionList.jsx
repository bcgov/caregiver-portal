import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
//import { useHousehold } from '../hooks/useHousehold';
import { useDates } from '../hooks/useDates';
import { FilePlus, FileText, ArrowRight } from 'lucide-react';

const HOUSEHOLD_FORM_TYPES = [
  'About Me (Spouse)',
  'Consent for Disclosure of Criminal Record Information',
  'Consent for Prior Contact Check',
];

const FormResubmissionList = () => {
    const { applicationPackageId } = useParams();
    const navigate = useNavigate();
    const { getApplicationForms, getHouseholdMemberForms, cloneApplicationForm } = useApplicationPackage();
   // const { loadHousehold, partner, householdMembers } = useHousehold({ applicationPackageId });
    const { formatShortDate } = useDates();

    const [applicantForms, setApplicantForms] = React.useState([]);
    const [householdForms, setHouseholdForms] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [cloningId, setCloningId] = React.useState(null);

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
            //loadHousehold(),
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

    // After household members are populated, load their forms
    /*
    React.useEffect(() => {
      if (isLoading) return;
  
      const loadMemberForms = async () => {
        const allMembers = [];

        if (partner?.householdMemberId) {
          allMembers.push({
            id: partner.householdMemberId,
            label: `${partner.firstName} ${partner.lastName} (${partner.relationship})`,
          });
        }
        for (const m of householdMembers) {
          if (m.householdMemberId) {
            allMembers.push({
              id: m.householdMemberId,
              label: `${m.firstName} ${m.lastName} (${m.relationship})`,
            });
          }
        }

        if (allMembers.length === 0) return;

        const results = [];
        for (const member of allMembers) {
          try {
            const forms = await getHouseholdMemberForms(member.id);
            const filtered = forms.filter(f => HOUSEHOLD_FORM_TYPES.includes(f.type));
            if (filtered.length > 0) results.push({ member, forms: filtered });
          } catch (err) {
            console.error(`Failed to load forms for ${member.label}:`, err);
          }
        }
        setHouseholdForms(results);
      };

      loadMemberForms();
    }, [isLoading, partner?.householdMemberId, householdMembers.length]);
    */

    const renderFormRow = (form) => (
      <div key={form.applicationFormId} className="resubmission-form-row">
        <span className="resubmission-form-type"><FileText size="20" className="inline-icon" />{form.type}</span>
        <span className="resubmission-form-date">
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

              {householdForms.length > 0 && (
                <div className="page-details-row-small">
                  <h2>Household member forms</h2>
                  {householdForms.map(({ member, forms }) => (
                    <div key={member.id} className="resubmission-member-section">
                      <h3 className="resubmission-member-label">{member.label}</h3>
                      <div className="resubmission-group">
                        {forms.map(renderFormRow)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  export default FormResubmissionList;