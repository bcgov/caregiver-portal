import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Application from '../components/Application';
//import { useApplicationPackage } from '../hooks/useApplicationPackage';
//import Button from '../components/Button';


const ReferralForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  const navigate = useNavigate();
  const back = `/foster-application/${applicationPackageId}`


  const breadcrumbItems = [
    { label: 'Back', path: back },
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
    <div className="page">
      <div className="page-details">
        <div className="page-details-row-breadcrumb">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
        </div>
        <Application applicationFormId={applicationFormId} onSubmitComplete={back} submitPackage={true} />
        </div>
    </div>
  );

};

export default ReferralForm;