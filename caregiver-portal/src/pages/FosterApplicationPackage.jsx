import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import ApplicationPackageStep from '../components/ApplicationPackageStep';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';


const FosterApplicationPackage = () => {
  const { applicationPackageId } = useParams();
  const [forms, setForms] = React.useState([]);
  const navigate = useNavigate();     
  const { getApplicationForms } = useApplicationPackage();

    const breadcrumbItems = [
        { label: 'Back', path: `/foster-application/${applicationPackageId}` },
      ];

      const handleBackClick = (item) => {
        navigate(item.path);
      };

      const handleContinue = (item) => {
        //path: `/foster-application/application-package/${applicationPackageId}/application-form/${applicationFormId}`
        console.log(`/foster-application/application-package/${applicationPackageId}/application-form/${item.applicationId}`);
        navigate(`/foster-application/application-package/${applicationPackageId}/application-form/${item.applicationId}`);
      }
  
      React.useEffect(() => {
        const loadForms = async () => {
          if (applicationPackageId) {
            try {
              console.log('Loading forms for packageId:', applicationPackageId);
              const formsArray = await getApplicationForms(applicationPackageId);
              console.log('loaded forms:', formsArray);
              setForms(formsArray);
            } catch (error) {
              console.error('Failed to load forms:', error);
            }
          }
        };
        loadForms();
      }, []);

      console.log('applicationPackageId:', applicationPackageId);
      console.log('forms:', forms);
  
      
    //const applicationPackageItems = [
/*
        {key: 'profile', label: 'About me', path: `/foster-application/application-package/${applicationPackageId}/application-form/${applicationFormId}`, description: 'Provide details about your household, lifestyle, and experience.'},
        {key: 'household', label: 'My household and support network', path: `/foster-application/application-package/household-form/${applicationId}`, description: 'All adults in the household must consent to background checks.'},
        {key: 'pastinvolvement', label: 'Past involvement with Child Welfare'},
        {key: 'healthhistory', label: 'Health history'},
        {key: 'placementconsiderations', label: 'Placement considerations'},
        {key: 'references', label: 'References', description: 'All adults in the household must consent to background checks.'},        
        {key: 'consent', label: 'Consent for prior contact check', description: 'Complete required training sessions.'},   
*/// ]

    return (
        <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
          <h1 className="page-title">Application to provide foster family care</h1>
          <div className="application-package">
            {forms.map((step, index) => (

               <ApplicationPackageStep key={step.key} step={step} index={index} onContinue={() => {handleContinue(step)}}/>
            
            ))}
        </div>
        <p className="caption">Once all sections are complete, you'll be able to submit your application.</p>
        <Button variant="disabled">Submit Application</Button>
      </div>
    )
};

export default FosterApplicationPackage;