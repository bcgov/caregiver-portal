import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useApplications } from '../hooks/UseApplications';
import { useCreateApplication } from '../hooks/UseCreateApplication';
import FosterCard from '../components/FosterCard';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { applications, isLoading, hasExistingSampleApp, loadApplications } = useApplications();

  const handleNavigateToApplication = useCallback((token) => {
    navigate(`/application/${token}`);
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

  return (
    <div className="card-container">
      <h1>Welcome, {auth.user.name}</h1>

      {isLoading && <div>Loading applications...</div>}

      {!hasExistingSampleApp && (
        <FosterCard 
          variant="startapplication" 
          onStartApplication={createApplication}
          loading={isCreating}
        />
      )}

      <div className="draft-applications">
        {applications.map((app) => (
          <div key={app.id} onClick={() => handleOpenApplication(app.id)}>
            <FosterCard
              variant="inprogress" 
              onStartApplication={createApplication}
              loading={isCreating}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;