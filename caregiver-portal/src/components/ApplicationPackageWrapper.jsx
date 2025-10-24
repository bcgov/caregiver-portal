import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationPackage from './ApplicationPackage';
import Breadcrumb from './Breadcrumb';

const ApplicationPackageWrapper = () => {
  const { applicationFormId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="application-frame">
      <Breadcrumb items={[{ label: 'Back', path: `/foster-application/${applicationFormId}` }]} onBackClick={() => navigate(`/foster-application/${applicationFormId}`)} />
      <ApplicationPackage 
        applicationFormId={applicationFormId}
        onClose={handleClose}
      />
    </div>    
  );
};

export default ApplicationPackageWrapper;