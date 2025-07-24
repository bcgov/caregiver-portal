import React, {useState, useEffect} from 'react';
import "../App.css";
import FosterCard from '../components/FosterCard';
import { useAuth } from '../auth/useAuth';
import Application from '../components/Application';

const Dashboard = () => {
  const auth = useAuth();
  const [currentApplication, setCurrentApplication] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [draftApplicationsLoading, setDraftApplicationsLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8090';

  if (auth.loading) {
    return <div>Loading user information...</div>;
  }

  useEffect(() => {
    if(!auth.loading && auth.user) {
      loadDraftApplications();
    }
  }, [auth.loading, auth.user]);

  const user = auth.user;

  const loadDraftApplications = async () => {
    try {
      setDraftApplicationsLoading(true);

      const response = await fetch(`${API_BASE}/application`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });


    } catch (err) {
      console.error("Loading draft applications error");
    } finally {
      setDraftApplicationsLoading(false);
    }
  };

  const handleCreateApplication = async () => {
    try {
      setApplicationLoading(true);

      const response = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationType: 'caregiver',
          formData: {},
        }),
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.warn('No JSON in error response');
        }
        console.error('Error creating application:', errorData);
        alert('Failed to create application');
        return;
      }

      const data = await response.json();
      console.log('Application created:', data.application);

      //alert(`Application ${data.application.id} created`);
      // set the current application ID to load it in the iframe
      setCurrentApplication(data.application.id);
    } catch (err) {
      console.error('Request failed:', err);
      alert('Something went wrong');
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleCloseApplication = () => {
    setCurrentApplication(null);
  };

  if (currentApplication) {
    return ( 
      <Application
        applicationId = {currentApplication}
        onClose = {handleCloseApplication}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1>Welcome, {user.name}</h1>
        <FosterCard 
          variant="startapplication" 
          onStartApplication={handleCreateApplication}
          loading={applicationLoading}
          />
      </div>

    </div>
  );
};

export default Dashboard;