import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApplications } from '../hooks/UseApplications';
import { useCreateApplication } from '../hooks/UseCreateApplication';
import FosterApplicationStart from '../components/FosterApplicationStart';
import FosterCard from '../components/FosterCard';
import AccessCard from '../components/AccessCard';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { applications, isLoading, hasExistingSampleApp, loadApplications } = useApplications();

  const handleNavigateToApplication = useCallback((token) => {

    console.log("Navigating to application with token:", token);

    navigate(`/foster-application/${token}`);
  }, [navigate]);

  const { createApplication, isCreating } = useCreateApplication(handleNavigateToApplication);

  const handleOpenApplication = useCallback((applicationId) => {
    navigate(`/application/${applicationId}`);
  }, [navigate]);

  useEffect(() => {
    if (!auth.loading && auth.user) {
      loadApplications();
    }
  }, [auth.loading, auth.user, loadApplications]);

  if (auth.loading) {
    return <div>Loading user information...</div>;
  }

  // {!hasExistingSampleApp && (
  // )}
  return (
    <div className="card-container">
      
      {isLoading && <div>Loading applications...</div>}

      

        <FosterApplicationStart onClick={createApplication} />
      

      <div className="draft-applications">
        {applications.map((app) => (
          <div key={app.applicationId}>
            <FosterCard
              variant="inprogress" 
              onClick={() => handleOpenApplication(app.applicationId)}
              loading={isCreating}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;