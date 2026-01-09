import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import BreadcrumbBar from '../components/BreadcrumbBar';
import Household from '../components/Household';

const HouseholdForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Back', path: `/foster-application/application-package/${applicationPackageId}` },
  ];

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  const home = `/foster-application/application-package/${applicationPackageId}`;
  const nextUrl = "DOESNOTWORK"

  return (
    <div className="household-container">
    {/* Top breadcrumb - aligned with page content */}
    <div className="breadcrumb-top">
      <div className="breadcrumb-top-content">
        <BreadcrumbBar home={home} next={nextUrl} label={"My household"}/>
      </div>
    </div>

    {/* Scrollable content area */}
    <div className="household-content">
      <div className="household-content-inner">
        <div className="page-details-row-small">
          <h1 className="page-title">My household</h1>
        </div>

        <div className="page-details-row">
          <Household applicationPackageId={applicationPackageId} applicationFormId={applicationFormId} />
        </div>
      </div>
    </div>

  </div>
    
  );

};

export default HouseholdForm;