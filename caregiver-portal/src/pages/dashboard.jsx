import React, {useState, useEffect} from 'react';
import "../App.css";
import FosterCard from '../components/FosterCard';
import Button from '../components/Button';
import { useAuth } from '../auth/useAuth';
import Application from '../components/Application';

const Dashboard = () => {
  const auth = useAuth();
  const [currentApplication, setCurrentApplication] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [draftApplicationsLoading, setDraftApplicationsLoading] = useState(false);
  const [draftApplications, setDraftApplications] = useState([]);

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

      const response = await fetch(`${API_BASE}/application`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: 'CF0001',
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
        //alert('Failed to create application');
        return;
      }

      const data = await response.json();
      console.log('Application created:', data.formAccessToken);
      console.log('Full response data:', data); // Check the entire response
      console.log('Form access token:', data.formAccessToken);
      console.log('About to set currentApplication with token:', data.formAccessToken);


      // set the current application ID to load it in the iframe
       setCurrentApplication(data.formAccessToken);
       console.log('currentApplication has been set');
    } catch (err) {
      console.error('Request failed:', err);
      //alert('Something went wrong');
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleCloseApplication = () => {
    setCurrentApplication(null);
  };


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1>Welcome, {user.name}</h1>
        {!currentApplication && ( // only show create button when not viewing an application
        <FosterCard 
          variant="startapplication" 
          onStartApplication={handleCreateApplication}
          loading={applicationLoading}
          />
        )}
        {currentApplication && (
          <Button
            onClick={handleCloseApplication}
            variant="Back to Dashboard"
            >
            Back to Dashboard
          </Button>
        )}
      </div>

            {/* Conditionally render dashboard content or application */}
            {currentApplication ? (
        <div className="mt-4">
          <Application
            formAccessToken={currentApplication}
            onClose={handleCloseApplication}
          />
        </div>
      ) : (
        <div>
          {/* Your existing dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Draft applications, other dashboard widgets, etc. */}
            {draftApplicationsLoading ? (
              <div>Loading applications...</div>
            ) : (
              draftApplications.map((app) => (
                <div key={app.applicationId} className="bg-white p-4 rounded-lg shadow">
                  <h3>Application {app.applicationId}</h3>
                  <p>Status: {app.status}</p>
                  {/* Add click handler to resume application if needed */}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>

  );
};

export default Dashboard;