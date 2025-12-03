import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Application from '../components/Application';


const ApplicationForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  const navigate = useNavigate();
  const back = `/foster-application/application-package/${applicationPackageId}`;

  const breadcrumbItems = [
    { label: 'Back', path: back},
  ];

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="page">
      <div className="page-details">
        <div className="page-details-row-breadcrumb">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
        </div>
        <Application applicationFormId={applicationFormId} onSubmitComplete={back} submitPackage={false}/>
    </div>
    </div>
  );

};

export default ApplicationForm;