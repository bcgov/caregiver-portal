import React from 'react';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({applicationPackage}) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (applicationPackage.applicationPackageId) {
        navigate(`/foster-application/${applicationPackage.applicationPackageId}`);
        }
    };

    const getStatusInfo = () => {
      if (!applicationPackage){
        return {
          text: 'Loading...',
          className: 'task-card-status--loading'
        }
      }

      const {status, srStage, referralstate} = applicationPackage;

      if (referralstate === 'Requested' && srStage !== 'Application') {
        return {
          text: 'Information Session Requested',
          className: 'task-card-status--requested'
        }
      }

      if (srStage === 'Application') {
        return {
          text: 'Complete Your Application',
          className: 'task-card-status--submitted'
        }
      }

      return {
        text: 'In progress',
        className: ''
      };

    };

    const statusInfo = getStatusInfo();

    return (
        <div className="task-card" onClick={() => handleClick()}>
        <div className="task-card-content">

                <div className={`task-card-status ${statusInfo.className}`}>{statusInfo.text}</div>


            <div className="task-card-title">Become a foster caregiver</div>
        </div>
      </div>
    );
  };

export default TaskCard;