import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import HouseholdSummary from '../components/HouseholdSummary';
import "../styles/index.css";
import Breadcrumb from '../components/Breadcrumb';


const ConsentSummary = () => {
  const { applicationPackageId } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdditionalAdult = pathname.startsWith('/additional-adult/');
  const isKinship = pathname.startsWith('/kinship-application/');

  const backPath = isAdditionalAdult ? '/dashboard' : ( isKinship ? `/kinship-application/${applicationPackageId}` : `/foster-application/${applicationPackageId}`)

  const breadcrumbItems = [
    { label: 'Back', path: backPath },
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
