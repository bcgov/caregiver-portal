import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Application from '../components/Application';
//import { useApplicationPackage } from '../hooks/useApplicationPackage';
//import Button from '../components/Button';


const ReferralForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  const navigate = useNavigate();
  const back = `/foster-application/${applicationPackageId}`


  const breadcrumbItems = [
    { label: 'Become a foster caregiver', path: back },
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
         <h1 className="page-title">Attend an information session</h1>
        
        </div>
        <div className="page-details-row">
        <div className="section-description">
          <p>Information sessions are design to help prospective foster caregivers make the decision about fostering.</p>

          <p>Topics include:</p>
          <ul>
            <li>How to become a foster caregiver</li>
            <li>What's involved in being a foster caregiver</li>
            <li>An overview of BC's foster care system</li>
          </ul>

          <p>After receiving your request, we will contact you with information on the next information session in your area.</p>

          
        </div>
        </div>

        </div>
    </div>
  );

};

export default ReferralForm;