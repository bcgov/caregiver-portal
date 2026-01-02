import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApplications } from '../hooks/useApplications';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import FosterApplicationStart from '../components/FosterApplicationStart';
import OOCApplicationStart from '../components/OOCApplicationStart';
import TaskCard from '../components/TaskCard';
import ScreeningTaskCard from '../components/ScreeningTaskCard';
import AccessCard from '../components/AccessCard';
import WelcomeCard from '../components/WelcomeCard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const {
    createApplicationPackage,
    getApplicationPackages,
    loading: isLoading,
    //error
  } = useApplicationPackage();

  const [applicationPackages, setApplicationPackages] = React.useState([]);

  const handleNavigateToApplication = useCallback((applicationPackageId) => {
    navigate(`/foster-application/${applicationPackageId}`);
  }, [navigate]);

  const loadApplicationPackages = useCallback(async () => {
    try {
      const apps = await getApplicationPackages();
      setApplicationPackages(apps);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  }, []);


  const {
    getApplicationForms,
    applicationForms: screeningForms,
    isLoading: formsLoading
  } = useApplications();

  console.log('screeningforms:',screeningForms);

  const loadApplicationForms = useCallback(() => {
    getApplicationForms();
  }, [getApplicationForms]);

  const handleCreateApplication = async () => {
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

  useEffect(() => {
    if (!auth.loading && auth.user) {
      loadApplicationPackages();
      loadApplicationForms();
    }
  }, [auth.loading, auth.user, loadApplicationPackages, loadApplicationForms]);

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
      
        {isLoading || formsLoading && 
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
            <WelcomeCard></WelcomeCard>
            </div>
          </div>
          <div className="task-frame">

          <div className="task-content">
    <div className="task-content-list">
      {(applicationPackages?.length > 0 || screeningForms?.length > 0) && (
        <h2 className="page-heading">My tasks</h2>
      )}
      <div className="draft-applications">
        {applicationPackages?.map((app) => (
          <div key={app.applicationPackageId}>
            {app.subtype === "FCH" && (
              <TaskCard applicationPackage={app} />
            )}
          </div>
        ))}
        {screeningForms?.map((app, index) => (
          <div key={app[0]?.householdMemberId || index}>
            <ScreeningTaskCard applicationFormSet={app} />
          </div>
        ))}
        <AccessCard />
      </div>
    </div>
  </div>

          
          </div>
          </>
      

        <div className="page-details">
          <div className="page-details-row">
            <div className="page-details-content"> 
          <FosterApplicationStart onClick={handleCreateApplication} disabled={applicationPackages.length > 0}/>
          <OOCApplicationStart disabled={true}/>
          
          </div>
        </div>
        </div>
    </div>
  );
};

export default Dashboard;