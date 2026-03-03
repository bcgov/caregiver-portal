import React from 'react';                                                                                                                                
import { useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Application from '../components/Application';

const ReferralApplicationForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();

  return (
    <div className="page">
      <div className="page-details">
        <Application applicationPackageId={applicationPackageId} applicationFormId={applicationFormId} submitPackage={false} Context="Referral"/>
      </div>
    </div>
  );
};

export default ReferralApplicationForm;