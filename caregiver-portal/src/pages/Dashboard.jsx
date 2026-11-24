import React, { useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApplications } from '../hooks/useApplications';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { useReliefProviders } from '../hooks/useReliefProviders';
import { useUserProfile } from '../hooks/useUserProfile';
import { useDates } from '../hooks/useDates';
import FosterApplicationStart from '../components/FosterApplicationStart';
import OOCApplicationStart from '../components/OOCApplicationStart';
import TaskCard from '../components/cards/TaskCard';
import GenericTaskCard from '../components/cards/GenericTaskCard';
import TaskItem from '../components/TaskItem';
import CompletedTaskItem from '../components/CompletedTaskItem';
import ScreeningTaskCard from '../components/cards/ScreeningTaskCard';
import AccessCard from '../components/cards/AccessCard';
import WelcomeCard from '../components/cards/WelcomeCard';
import { useAdditionalAdultMembers } from '../hooks/useAdditionalAdultMembers';
import { Loader2, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [householdMemberships, setHouseholdMemberships] = React.useState([]);

  const KINSHIP_START_ON = import.meta.env.VITE_KINSHIP_START_ON === 'true' || false;
  const TRAINING_ON = import.meta.env.VITE_TRAINING_ON === 'true' || false;
  const RELIEF_ON = import.meta.env.VITE_RELIEF_PROVIDERS_ON === 'true' || false;
  const NOT_OWN_TASKS = ['Additional Adult', 'Relief Provider'];

  const {
    createApplicationPackage,
    getApplicationPackages,
    loading: isLoading,
    //error
  } = useApplicationPackage();

  const { userProfile, getHouseholdMemberScreeningStatus } = useUserProfile();

  const { calculateAge, formatShortDate } = useDates();
  const { submitted: submittedMembers } = useAdditionalAdultMembers();

  const { providers: reliefProviders } = useReliefProviders({ enabled: RELIEF_ON} );
  const submittedReliefProviders = reliefProviders.filter((p) => p.submitted);

  const [applicationPackages, setApplicationPackages] = React.useState([]);
  const [fosterApplications, setFosterApplications] = React.useState([]);
  const [kinshipApplications, setKinshipApplications] = React.useState([]);
  const [additionalAdultPackages, setAdditionalAdultPackages] = React.useState([]);
  const [isApprovedFch, setIsApprovedFch] = React.useState(false);

  const caseSubType = userProfile?.resource_case_sub_type ?? null;
  const hasFchCase = caseSubType === 'FCH' || caseSubType === 'FCH/Out of Care';
  const hasOutOfCareCase = caseSubType === 'Out of Care' || caseSubType === 'FCH/Out of Care';
  const [hasResourceCase, setHasResourceCase] = React.useState(false);


  //

  const handleNavigateToApplication = useCallback((applicationPackageId) => {
    navigate(`/foster-application/${applicationPackageId}`);
  }, [navigate]);

  const loadApplicationPackages = useCallback(async () => {
    try {
      const norm = v => (v ?? '').trim().toLowerCase();
      const apps = (await getApplicationPackages()).filter(app => (app.subtype !== 'OOC')); //ooc is a legacy name, it will not be there in production but it's annoying in test data.
      const incompleteApps = apps.filter(app => norm(app.srStage) !== 'completed' && norm(app.srResolution) !== 'not approved')
      setApplicationPackages(incompleteApps.filter(app => !NOT_OWN_TASKS.includes(app.subtype)));
      setAdditionalAdultPackages(
        incompleteApps.filter(app => app.subtype === 'Additional Adult' && app.status !== 'Withdrawn'),
      );
      setFosterApplications(incompleteApps.filter(app => app.subtype === 'FCH'));
      setKinshipApplications(incompleteApps.filter(app => app.subtype === 'Kinship'));
      setIsApprovedFch(apps.some(app => app.subtype === 'FCH' && norm(app.srStage) === 'completed' && norm(app.srResolution) === 'approved'));
      //setIsApprovedKinship(apps.some(app => app.subtype === 'Kinship' && app.srStage === 'Completed' && app.srResolution === 'Approved'));

      //const approvedFch = apps.some(app => app.subtype === 'FCH' && app.srStage === 'Completed' && app.srResolution === 'Approved');
      //const approvedKinship = apps.some(app => app.subtype === 'Kinship' && app.srStage === 'Completed' && app.srResolution === 'Approved');
      console.log('apps:', apps);
      //console.log('incompleteApps:', incompleteApps);
      //console.log('approvedFch:', approvedFch, 'approvedKinship:', approvedKinship);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  }, []);

  useEffect(() => {
    setHasResourceCase(!!userProfile?.resource_case_active_date);
    //console.log('hasResourceCase:',hasResourceCase);
  }, [userProfile]);

  const {
    getApplicationForms,
    applicationForms: screeningForms,
    isLoading: formsLoading
  } = useApplications();

  const loadApplicationForms = useCallback(() => {
    getApplicationForms();
  }, [getApplicationForms]);

  // a submitted package is a completed activity, not an outstanding task
  const submittedPackageIds = new Set(submittedMembers.map((m) => m.applicationPackageId));
  const outstandingAdditionalAdults = additionalAdultPackages.filter(
    (pkg) => !submittedPackageIds.has(pkg.applicationPackageId),
  );

  const handleCreateFCHApplication = async () => {
    try {
      const newPackage = await createApplicationPackage({
        subtype: 'FCH',
        subsubtype: 'FCH'
      });
      handleNavigateToApplication(newPackage.applicationPackageId);
    } catch (err) {
      console.error('Failed to create application:', err);
    }
  };

  /*
  const handleCreateOOCApplication = async () => {
    try {
      const newPackage = await createApplicationPackage({
        subtype: 'Kinship',
        subsubtype: ''
      });
      handleNavigateToOOCApplication(newPackage.applicationPackageId);
    } catch (err) {
      console.error('Failed to create application:', err);
    }
  };
  */


  useEffect(() => {
    if (!auth.loading && auth.user) {
      getHouseholdMemberScreeningStatus().then(setHouseholdMemberships);
      loadApplicationPackages();
      loadApplicationForms();
    }

  }, [auth.loading, auth.user, loadApplicationPackages, loadApplicationForms, getHouseholdMemberScreeningStatus]);

    if (auth.loading) {
    return (
        <div className="submission-overlay">
          <div className="submission-modal">
            <Loader2 className="submission-spinner" />
            <p className="submission-title">Processing authentication</p>
            <p className="submission-text">Please wait while we process your submission...</p>
          </div>
        </div>
      );
  }
  return (

    <div className="page">

        {(isLoading || formsLoading) &&
          <div className="submission-overlay">
            <div className="submission-modal">
              <Loader2 className="submission-spinner" />
              <p className="submission-title">Processing authentication</p>
              <p className="submission-text">Please wait while we process your submission...</p>
            </div>
          </div>
        }


          <>
          <div className="task-frame-image">
            <div className="task-content">
              <WelcomeCard user={auth.user}>
              {(hasFchCase) && (
                <div className="welcome-badge-container">
                    <ShieldCheck size={20} className="welcome-badge" />{' '}
                        Approved Foster Caregiver
                    </div>
                )}
                {hasOutOfCareCase && (
                <div className="welcome-badge-container">
                    <ShieldCheck size={20} className="welcome-badge" />{' '}
                        Kinship Care Provider
                    </div>
                )}
              </WelcomeCard>
            </div>
          </div>
          <div className="task-frame-main-body">
            <div className="task-content-row">
              <div className="task-list">
                {hasResourceCase && (
                    <>
                    <div className="image-frame">
                        <Link className="hyperlink" to="/manage-household">Manage my household</Link>
                    </div>
                    {RELIEF_ON && (
                    <div className="image-frame">
                        <Link className="hyperlink" to="/manage-relief-providers">Manage relief providers</Link>
                    </div>
                    )}
                    </>
                )}

                {(applicationPackages?.length > 0 || outstandingAdditionalAdults.length > 0 || householdMemberships?.length > 0 || (hasResourceCase && TRAINING_ON)) && (
                  <div className="image-frame">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Outstanding tasks</h2>
                  </div>
                )}

                { hasResourceCase && TRAINING_ON && (
                    <GenericTaskCard
                    title="In-service training"

                    buttonLabel="Continue"
                    onClick={() => navigate('/caregiver-training')}
                  />)}


                {applicationPackages?.map((app) => (
                  <>
                      <TaskCard subtype={app.subtype} applicationPackage={app} />
                  </>
                ))}

                {outstandingAdditionalAdults.map((pkg) => (
                  <GenericTaskCard
                    key={pkg.applicationPackageId}
                    title="New Household Member Screening"
                    buttonLabel="Continue"
                    onClick={() =>
                      navigate(`/additional-adult/application-package/${pkg.applicationPackageId}/consent-summary/`)
                    }
                  />
                ))}
                {householdMemberships?.map((membership) => {
                  const formGroup = screeningForms?.find(group =>
                    group[0]?.householdMemberId === membership.householdMemberId
                  ) ?? [];
                  return (
                    <div key={membership.householdMemberId}>
                    <ScreeningTaskCard applicationFormSet={formGroup} householdMembership={membership} />
                    </div>
                  );
                })}

                {(isApprovedFch || submittedMembers.length > 0 || submittedReliefProviders.length > 0) && (
                  <div className="image-frame">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Completed tasks</h2>
                    {isApprovedFch && <TaskItem type={'FCH'}></TaskItem>}
                    {submittedMembers.map((m) => (
                      <CompletedTaskItem key={m.householdMemberId}>
                        Added new household member
                        {m.moveInDate ? ` on ${formatShortDate(`${m.moveInDate}T00:00:00`)}` : ''}
                      </CompletedTaskItem>
                    ))}
                    {submittedReliefProviders.map((p) => (
                      <CompletedTaskItem key={p.householdMemberId}>
                        Relief provider {p.firstName} {p.lastName} submitted their application
                      </CompletedTaskItem>
                    ))}
                  </div>
                )}


                {(fosterApplications?.length === 0 && !isApprovedFch) && (
                  <FosterApplicationStart onClick={handleCreateFCHApplication} disabled={calculateAge(userProfile?.date_of_birth) < 18} startLink={calculateAge(userProfile?.date_of_birth) > 17} showImage={false}/>
                )}


              </div>
              <AccessCard />
              </div>

            </div>
          </>
    </div>
  );
};

export default Dashboard;
