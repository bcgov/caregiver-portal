import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApplications } from '../hooks/useApplications';
import { useCreateApplication } from '../hooks/useCreateApplication';
import FosterApplicationStart from '../components/FosterApplicationStart';
import TaskCard from '../components/TaskCard';
import AccessCard from '../components/AccessCard';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { applications, isLoading, hasFosterApp, loadApplications } = useApplications();

  const handleNavigateToApplication = useCallback((applicationId) => {


    navigate(`/foster-application/${applicationId}`);
  }, [navigate]);

  const { createApplication } = useCreateApplication(handleNavigateToApplication);

  useEffect(() => {
    if (!auth.loading && auth.user) {
      loadApplications();
    }
  }, [auth.loading, auth.user, loadApplications]);

  if (auth.loading) {
    return <div>Loading user information...</div>;
  }


  return (

    <div className="dashboard-container">
      
        {isLoading && <div>Loading applications...</div>}
      {applications.length > 0 ? (
        <div className="application-frame">
          <hr className="gold-underline-large" />
          <h2 className="page-heading">My tasks</h2>
          <div className="draft-applications">
            {applications.map((app) => (
              <div key={app.applicationId}>
                {app.type === "Foster Caregiver" && (
                <TaskCard applicationId={app.applicationId} />
                )}
            </div>
            ))}
      </div>
        </div>
        ) 
      : (

        !hasFosterApp && (
          <FosterApplicationStart onClick={createApplication} />
        )
      )
      }  
    </div>
  );
};

export default Dashboard;