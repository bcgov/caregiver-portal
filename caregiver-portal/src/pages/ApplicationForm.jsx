import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Application from '../components/Application';


const ApplicationForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
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
        <Application applicationFormId={applicationFormId} />
    </div>
  );

};

export default ApplicationForm;