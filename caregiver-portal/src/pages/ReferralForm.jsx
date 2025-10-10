import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Application from '../components/Application';
//import { useApplicationPackage } from '../hooks/useApplicationPackage';
//import Button from '../components/Button';


const ReferralForm = () => {
  const { applicationPackageId, applicationId } = useParams();
  const navigate = useNavigate();
  //const [isSubmitting, setIsSubmitting] = React.useState(false);
  //const { submitApplicationPackage } = useApplicationPackage();  

  const breadcrumbItems = [
    { label: 'Back', path: `/foster-application/${applicationPackageId}` },
  ];


  /*
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitApplicationPackage(applicationPackageId);
      console.log('Submission successful:', result);
      navigate(`/foster-application/${applicationPackageId}`);
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }
    */
  const handleBackClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
        <Application applicationId={applicationId} />
    </div>
  );

};

export default ReferralForm;