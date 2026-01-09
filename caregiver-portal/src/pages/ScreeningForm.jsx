import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Application from '../components/Application';


const ScreeningForm = () => {
  const { householdMemberId, applicationFormId } = useParams();
  const navigate = useNavigate();
  const back = `/screening-package/${householdMemberId}`

  const breadcrumbItems = [
    { label: 'Back', path: back},
  ];

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="page">
    <div className="page-details">
      <Application applicationFormId={applicationFormId} onSubmitComplete={back}/>
    </div>
    </div>
  );

};

export default ScreeningForm;