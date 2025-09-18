import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Application from '../components/Application';


const ApplicationForm = () => {
  const { applicationPackageId, applicationId } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Back', path: `/foster-application/application-package/${applicationPackageId}` },
  ];

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
        <h1 className="page-title">Generic Form</h1>
        <Application applicationId={applicationId} />
    </div>
  );

};

export default ApplicationForm;