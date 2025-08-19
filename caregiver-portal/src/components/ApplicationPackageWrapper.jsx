import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationPackage from './application-package';

const ApplicationPackageWrapper = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <ApplicationPackage 
      formAccessToken={applicationId}
      onClose={handleClose}
    />
  );
};

export default ApplicationPackageWrapper;