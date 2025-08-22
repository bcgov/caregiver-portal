import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import FosterCard from '../components/FosterCard';
import Button from '../components/Button';
import { useAuth } from '../auth/useAuth';
import Application from '../components/Application';
import Household from '../components/Household';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [applicationLoading, setApplicationLoading] = useState(false);
  const [draftApplicationsLoading, setDraftApplicationsLoading] = useState(false);
  const [draftApplications, setDraftApplications] = useState([]);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);

  //const [currentApplication, setCurrentApplication] = useState(() => {
  //  const saved = sessionStorage.getItem('currentApplication');
  //  return saved ? JSON.parse(saved) : null;
  //});

  //const [showHousehold, setShowHousehold] = useState(() => {
  //  const saved = sessionStorage.getItem('showHousehold');
  //  return saved === 'true';
  //});


  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // persist current application and household state in sessionStorage
  //useEffect(() => {
  //  if (currentApplication) {
  //    sessionStorage.setItem('currentApplication', JSON.stringify(currentApplication));
  //  } else {
  //    sessionStorage.removeItem('currentApplication');
  //  }
  //  }, [currentApplication]);
  //  
  //  sessionStorage.setItem('showHousehold', showHousehold);


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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Draft applications loaded:', data);

      
      const hasSampleApplication = data.some(application => 
        application.type === "Sample"
      )

      console.log('Did we find a Sample type?', hasSampleApplication);

      setHasExistingApplication(hasSampleApplication);
      
      // Update the state with the loaded applications
      
      setDraftApplications(data);


    } catch (err) {
      console.error("Loading draft applications error");
      setDraftApplications([]); // Set empty array on error
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
          formParameters: {
            "formId": "CF0001",
            "language": "en"
          },
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
       //setCurrentApplication(data.formAccessToken);

      if(data.formAccessToken) {
        navigate(`/application/${data.formAccessToken}`);
      }

       console.log('currentApplication has been set');
    } catch (err) {
      console.error('Request failed:', err);
      //alert('Something went wrong');
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleOpenApplication = (applicationId) => {
    navigate(`/application/${applicationId}`)
  }

  const handleCloseApplication = () => {
    setCurrentApplication(null);
    setShowHousehold(false);
    loadDraftApplications()
  };

  const handleHousehold = () => {
    setShowHousehold(true);
  };

  const handleSummary = () => {
    setShowSummary(true);
  }


  return (
    <div className="card-container">
      <h1>Welcome, {user.name}</h1>

      { !hasExistingApplication && (
      <FosterCard 
        variant="startapplication" 
        onStartApplication={handleCreateApplication}
        loading={applicationLoading}
        />
      )
      }  
      
      <div className="draft-applications">        
        {draftApplications.map((app) => (
          <div key={app.id} onClick={() => handleOpenApplication(app.id)}>
            <FosterCard 
            variant="inprogress" 
            onStartApplication={handleCreateApplication}
            loading={applicationLoading}
            />
          </div>
          ))}
          </div>
        </div>
  );
};

export default Dashboard;