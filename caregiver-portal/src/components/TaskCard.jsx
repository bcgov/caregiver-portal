import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { ArrowRight } from 'lucide-react';

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

      if (srStage === 'Screening') {
        return {
          text: 'Screening in Progress',
          className: 'task-card-status--requested'
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
                
            <div className="task-card-title">Become a foster caregiver</div>
            <Button variant="primary">Continue<ArrowRight></ArrowRight></Button>
        </div>
      </div>
    );
  };

export default TaskCard;