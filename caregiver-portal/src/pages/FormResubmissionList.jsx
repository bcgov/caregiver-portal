import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
//import { useHousehold } from '../hooks/useHousehold';
import { useDates } from '../hooks/useDates';
import { FilePlus } from 'lucide-react';

const EXCLUDED_TYPES = ['Referral', 'Adults in household', 'Indigenous Background and Preferences'];
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

    const breadcrumbItems = [
        { label: 'Become a foster caregiver', path: `/foster-application/${applicationPackageId}` },
        { label: 'Update Application Forms' },
      ];

    const handleBackClick = (item) => navigate(item.path);

    const handleResubmit = async (form) => {
    setCloningId(form.applicationFormId);
    try {
        const { applicationFormId: newId } = await cloneApplicationForm(form.applicationFormId);
        navigate(`/foster-application/${applicationPackageId}/resubmit/${newId}`);
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
          setApplicantForms(forms.filter(f => !EXCLUDED_TYPES.includes(f.type)));
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
        <span className="resubmission-form-type">{form.type}</span>
        <span className="resubmission-form-date">
          {form.submittedAt ? `Submitted on ${formatShortDate(form.submittedAt)}` : 'Not yet submitted'}
        </span>
        <Button
          variant="white"
          onClick={() => handleResubmit(form)}
          disabled={!!cloningId}
        ><FilePlus size="16" />
          {cloningId === form.applicationFormId ? 'Opening...' : 'Resubmit'}
        </Button>
      </div>
    );

    return (
      <div className="page">
        <div className="page-details">
          <div className="page-details-row-breadcrumb">
            <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
          </div>
          <div className="page-details-row-small">
            <h1 className="page-title">Update Application Forms</h1>
          </div>
  
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="page-details-row-small">
                <div className="application-package">
                  {applicantForms.map(renderFormRow)}
                </div>
              </div>

              {householdForms.length > 0 && (
                <div className="page-details-row-small">
                  <h2>Household member forms</h2>
                  {householdForms.map(({ member, forms }) => (
                    <div key={member.id} className="resubmission-member-section">
                      <h3 className="resubmission-member-label">{member.label}</h3>
                      <div className="application-package">
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