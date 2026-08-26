import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApplications } from '../hooks/useApplications';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { useUserProfile } from '../hooks/useUserProfile';
import { useDates } from '../hooks/useDates';
import FosterApplicationStart from '../components/FosterApplicationStart';
import OOCApplicationStart from '../components/OOCApplicationStart';
import TaskCard from '../components/cards/TaskCard';
import GenericTaskCard from '../components/cards/GenericTaskCard';
import TaskItem from '../components/TaskItem';
import ScreeningTaskCard from '../components/cards/ScreeningTaskCard';
import AccessCard from '../components/AccessCard';
import WelcomeCard from '../components/WelcomeCard';
import { Loader2, HandMetal, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [householdMemberships, setHouseholdMemberships] = React.useState([]);

  const KINSHIP_START_ON = import.meta.env.VITE_KINSHIP_START_ON === 'true' || false;
  const training_on = import.meta.env.VITE_TRAINING_ON === 'true' || false;

  const {
    createApplicationPackage,
    getApplicationPackages,
    loading: isLoading,
    //error
  } = useApplicationPackage();

  const { userProfile, getHouseholdMemberScreeningStatus } = useUserProfile();
  const [hasResourceCase, setHasResourceCase] = React.useState([]);
  const { calculateAge } = useDates();

  const [applicationPackages, setApplicationPackages] = React.useState([]);
  const [fosterApplications, setFosterApplications] = React.useState([]);
  const [kinshipApplications, setKinshipApplications] = React.useState([]);


  //

  const handleNavigateToApplication = useCallback((applicationPackageId) => {
    navigate(`/foster-application/${applicationPackageId}`);
  }, [navigate]);

  const handleNavigateToOOCApplication = useCallback((applicationPackageId) => {
    navigate(`/kinship-application/${applicationPackageId}`);
  }, [navigate]);

  const loadApplicationPackages = useCallback(async () => {
    try {
      const apps = await getApplicationPackages();
      const incompleteApps = apps.filter(app => app.srStage !== 'Completed')
      setApplicationPackages(incompleteApps);
      setFosterApplications(incompleteApps.filter(app => app.subtype === 'FCH'));
      setKinshipApplications(incompleteApps.filter(app => app.subtype === 'OOC'));
      //setHasResourceCase(userProfile?.resource_case_active_date);
      //console.log('foster applications:', apps.filter(app => app.subtype === 'FCH'));
      //console.log(userProfile);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  }, []);

  useEffect(() => {
    setHasResourceCase(userProfile?.resource_case_active_date);
  }, [userProfile]);

  const {
    getApplicationForms,
    applicationForms: screeningForms,
    isLoading: formsLoading
  } = useApplications();

  const loadApplicationForms = useCallback(() => {
    getApplicationForms();
  }, [getApplicationForms]);

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

  const handleCreateOOCApplication = async () => {
    try {
      const newPackage = await createApplicationPackage({
        subtype: 'OOC',
        subsubtype: 'EFP'
      });
      handleNavigateToOOCApplication(newPackage.applicationPackageId);
    } catch (err) {
      console.error('Failed to create application:', err);
    }
  };


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
              {hasResourceCase && (
                <div className="welcome-badge-container">
                  <ShieldCheck size={20} className="welcome-badge" />{' '}
                  Approved Foster Caregiver
                </div>
              )}
              </WelcomeCard>
            </div>
          </div>
          <div className="task-frame-main-body">
            <div className="task-content-row">
              <div className="task-list">
              
                {(applicationPackages?.length > 0 || householdMemberships?.length > 0) && (
                  <div className="image-frame">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Outstanding tasks</h2>
                  </div>
                )}


                {applicationPackages?.map((app) => (
                  <>
                    
                      <TaskCard subtype={app.subtype} applicationPackage={app} />
                    
                  </>
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

                {hasResourceCase && (
                  <div className="image-frame">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Completed tasks</h2>
                    <TaskItem></TaskItem>
                  </div>
                  
                )
              }
                { hasResourceCase && training_on && (
    <GenericTaskCard
    title="In-service training"
    
    buttonLabel="Continue"
    onClick={() => navigate('/caregiver-training')}
  />



              
                )
                
                  
                }
                {(fosterApplications?.length === 0 && !hasResourceCase) && (
                  <FosterApplicationStart onClick={handleCreateFCHApplication} disabled={calculateAge(userProfile?.date_of_birth) < 18} showImage={false}/>
                )}
                {(KINSHIP_START_ON && kinshipApplications?.length === 0) && (
                  <OOCApplicationStart onClick={handleCreateOOCApplication} disabled={calculateAge(userProfile?.date_of_birth) < 18} showImage={false}/>
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