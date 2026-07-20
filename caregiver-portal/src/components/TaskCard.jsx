import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { ArrowRight, CircleCheck } from 'lucide-react';

const TaskCard = ({subtype = 'FCH', applicationPackage}) => {
    const navigate = useNavigate();

    const label = subtype === 'FCH' ? "Foster" : "Kinship";

    const handleClick = () => {
      if (applicationPackage.applicationPackageId) {
        if (subtype === 'FCH') {
        navigate(`/foster-application/${applicationPackage.applicationPackageId}`);
        } else if (subtype === 'OOC') {
          navigate(`/kinship-application/${applicationPackage.applicationPackageId}`);
        }
        }
    };

    const {srStage, status} = applicationPackage;
    
    const getStatusInfo = () => {
      if (!applicationPackage){
        return {
          title: 'Loading...',
          click: false,
          icon: '',
          className: 'task-card-status--loading'
        }
      }

      if (status === 'Withdrawn') {
        return {
          title: `Become a ${label} caregiver`,
          click: false, 
        };
      }

      return {
        title: `Become a ${label} caregiver`,
        click: true,
      };

    };

    const statusInfo = getStatusInfo();
  
    return (
      <>
        {srStage !== 'Completed' && (
        <div className="task-card" onClick={() => statusInfo.click ? handleClick() : null}>
        <div className="task-card-content">
          {srStage !== 'Completed' && status !== 'Withdrawn' && (
            <div className="task-card-title">Become a {label} caregiver</div>
          )}
          {status === 'Withdrawn' && (
            <div className="task-card-text--cancelled"><p>Your {label} caregiver application has been cancelled<br/><br/><small>This message will disappear on your next login.</small></p></div>
          )}
            {statusInfo.click && (<Button variant="primary">Continue<ArrowRight></ArrowRight></Button>)}
        </div>
      </div>
        )}
        </>
    );
  };

export default TaskCard;