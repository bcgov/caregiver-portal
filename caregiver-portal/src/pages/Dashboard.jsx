import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
//import { useApplications,  } from '../hooks/useApplications';
//import { useCreateApplication } from '../hooks/useCreateApplication';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import FosterApplicationStart from '../components/FosterApplicationStart';
import TaskCard from '../components/TaskCard';
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

  //const { applications, isLoading, hasFosterApp, loadApplications } = getApplicationPackages();

  const [applicationPackages, setApplicationPackages] = React.useState([]);
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
    }
  }, [auth.loading, auth.user, loadApplicationPackages]);

  if (auth.loading) {
    return <div>Loading user information...</div>;
  }
  return (

    <div className="dashboard-container">
      
        {isLoading && <div>Loading applications...</div>}
      {applicationPackages.length > 0 ? (
        <div className="application-frame">
          <hr className="gold-underline-large" />
          <h2 className="page-heading">My tasks</h2>
          <div className="draft-applications">
            {applicationPackages.map((app) => (
              <div key={app.applicationFormId}>
                {app.subtype === "FCH" && (
                <TaskCard applicationPackage={app} />
                )}
              </div>
            ))}
          <AccessCard></AccessCard>
      </div>
        </div>
        ) 
      : (

        !hasFCHApp && (
          <>
          <FosterApplicationStart onClick={handleCreateApplication} />
          <AccessCard></AccessCard>
          </>
        )
      )
      }

    </div>
  );
};

export default Dashboard;