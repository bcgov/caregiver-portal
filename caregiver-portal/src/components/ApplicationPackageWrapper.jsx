import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationPackage from './ApplicationPackage';
import Breadcrumb from './Breadcrumb';

const ApplicationPackageWrapper = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  //console.log("Rendering ApplicationPackageWrapper with applicationId:", applicationId);

  return (
    <div className="application-frame">
      <Breadcrumb items={[{ label: 'Back', path: `/foster-application/${applicationId}` }]} onBackClick={() => navigate(`/foster-application/${applicationId}`)} />
      <ApplicationPackage 
        applicationId={applicationId}
        onClose={handleClose}
      />
    </div>    
  );
};

export default ApplicationPackageWrapper;