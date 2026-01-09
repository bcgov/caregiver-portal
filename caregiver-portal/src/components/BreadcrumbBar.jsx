import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Button from './Button';
import Breadcrumb from '../components/Breadcrumb';


const BreadcrumbBar = ({home, next, applicationForm, label, iframeRef}) => {
    const navigate = useNavigate();

    const handleBackClick = (item) => {
        navigate(home);
    };

    const breadcrumbItems = [
        { label: 'Foster Caregiver Application Package', path: home},
        { label: label ? label : applicationForm?.type, path: next}
    ];


    const sendComplete = () => {
        if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
            type: "CLICK_BUTTON_BY_TEXT",
            text: "Complete"   
        },
        "*")
        }  
    }

  return (

  <div className="page-details-row-breadcrumb">
  <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
  <Button variant='next' onClick={sendComplete}>Next section <ArrowRight/></Button>
  </div>

  );
}

export default BreadcrumbBar;