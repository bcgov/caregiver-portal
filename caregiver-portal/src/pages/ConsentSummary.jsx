import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HouseholdSummary from '../components/HouseholdSummary';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';


const ConsentSummary = () => {
  const { applicationPackageId } = useParams();
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
        <HouseholdSummary applicationPackageId={applicationPackageId} />
    </div>
  );

};

export default ConsentSummary;