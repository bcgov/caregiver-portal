import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Application from '../components/Application';


const ReferralForm = () => {
  const { applicationPackageId, applicationId } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Back', path: `/foster-application/${applicationPackageId}` },
  ];

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
        <Application applicationId={applicationId} />
    </div>
  );

};

export default ReferralForm;