import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApplications } from '../hooks/useApplications';
//import { useCreateApplication } from '../hooks/useCreateApplication';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import FosterApplicationStart from '../components/FosterApplicationStart';
import TaskCard from '../components/TaskCard';
import ScreeningTaskCard from '../components/ScreeningTaskCard';
import AccessCard from '../components/AccessCard';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const {
    createApplicationPackage,
    getApplicationPackages,
    loading: isLoading,
    //error
  } = useApplicationPackage();

  //const {
  //  getApplicationForms
  //} = useApplicationForms();

  //const { applications, isLoading, hasFosterApp, loadApplications } = getApplicationPackages();

  const [applicationPackages, setApplicationPackages] = React.useState([]);
 // const [screeningForms, setScreeningForms] = React.useState([]);
  const [hasFCHApp, setHasFCHApp] = React.useState(false);

  const handleNavigateToApplication = useCallback((applicationPackageId) => {
    navigate(`/foster-application/${applicationPackageId}`);
  }, [navigate]);

  const loadApplicationPackages = useCallback(async () => {
    try {
      const apps = await getApplicationPackages();
      setApplicationPackages(apps);
      setHasFCHApp(apps.some(app => app.subtype === "FCH"));
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  }, []);


  const {
    getApplicationForms,
    applicationForms: screeningForms,
    isLoading: formsLoading
  } = useApplications();

  const loadApplicationForms = useCallback(() => {
    getApplicationForms();
  }, [getApplicationForms]);
  /*
    try {
      const forms = await getApplicationForms();
      setScreeningForms(forms || []);
    } catch (err) {
      console.error('Failed to load screening forms');
    }
  }, [getApplicationForms])
*/
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
    return <div>Loading user information...</div>;
  }
  return (

    <div className="page">
      
        {isLoading && <div>Loading applications...</div>}
        {applicationPackages.length > 0 && (
          <div className="task-frame">
            <div className="task-content">
              <hr className="gold-underline-large" />
              <h2 className="page-heading">My tasks</h2>
              <div className="draft-applications">
                {applicationPackages.map((app) => (
                  <div key={app.applicationPackageId}>
                  {app.subtype === "FCH" && (
                    <TaskCard applicationPackage={app} />
                  )}
                  </div>
                ))}
                {screeningForms.map((app) => (
                  <div key={app.applicationFormId}>
                    <ScreeningTaskCard applicationForm={app} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="page-details">
          <div className="page-details-row">
            <div className="page-details-content"> 
          <FosterApplicationStart onClick={handleCreateApplication} disabled={applicationPackages.length > 0}/>
          <AccessCard></AccessCard>
          </div>
        </div>
        </div>
    </div>
  );
};

export default Dashboard;