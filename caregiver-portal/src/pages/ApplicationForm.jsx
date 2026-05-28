import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import "../DesignTokens.css";

import Application from '../components/Application';


const ApplicationForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/kinship-application')
      ? `/kinship-application/application-package/${applicationPackageId}`
      : `/foster-application/application-package/${applicationPackageId}`;


  return (
    <div className="page">
      <div className="page-details">
        <Application applicationPackageId={applicationPackageId} applicationFormId={applicationFormId} submitPackage={false} basePath={basePath}/>
    </div>
    </div>
  );

};

export default ApplicationForm;