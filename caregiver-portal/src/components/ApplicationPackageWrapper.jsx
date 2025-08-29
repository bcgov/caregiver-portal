import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationPackage from './ApplicationPackage';

const ApplicationPackageWrapper = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  //console.log("Rendering ApplicationPackageWrapper with applicationId:", applicationId);

  return (
    <ApplicationPackage 
      applicationId={applicationId}
      onClose={handleClose}
    />
  );
};

export default ApplicationPackageWrapper;