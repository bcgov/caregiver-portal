import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Application from '../components/Application';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { Loader2 } from 'lucide-react';


const ScreeningForm = () => {
  const { householdMemberId, applicationFormId } = useParams();
  const back = `/screening-package/${householdMemberId}`;

  const [applicationPackageId, setApplicationPackageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getApplicationForm } = useApplicationPackage();

  useEffect(() => {
    if (applicationFormId) {
      getApplicationForm(applicationFormId)
        .then(form => {
          setApplicationPackageId(form.applicationPackageId);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading application form:', err);
          setLoading(false);
        });
    }
  }, [applicationFormId, getApplicationForm]);

  if (loading) {
    return (
      <div className="submission-overlay">
        <div className="submission-modal">
          <Loader2 className="submission-spinner" />
          <p className="submission-title">Loading form</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
    <div className="page-details">
      <Application 
        applicationPackageId={applicationPackageId} 
        applicationFormId={applicationFormId} 
        onSubmitComplete={back} 
        submitPackage={false}
        householdMemberId={householdMemberId}
        Context={'Screening'}/>
    </div>
    </div>
  );

};

export default ScreeningForm;