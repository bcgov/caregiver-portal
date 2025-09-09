import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Household from '../components/Household';

const HouseholdForm = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Back', path: `/foster-application/application-package/${applicationId}` },
  ];

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
        <h1 className="page-title">My household and support network</h1>
        <Household applicationId={applicationId} />
    </div>
  );

};

export default HouseholdForm;