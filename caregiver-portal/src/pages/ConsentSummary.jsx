import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HouseholdSummary from '../components/HouseholdSummary';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';


const ConsentSummary = () => {
  const { applicationPackageId } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Become a foster caregiver', path: `/foster-application/${applicationPackageId}` },
    { label: 'Consents from household members' },
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
        <div className="page-details-row-small">
          <HouseholdSummary applicationPackageId={applicationPackageId} />
        </div>
    </div>
    </div>
  );

};

export default ConsentSummary;