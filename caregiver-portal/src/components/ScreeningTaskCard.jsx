import React from 'react';
import { useNavigate } from 'react-router-dom';

const ScreeningTaskCard = ({applicationForm}) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (applicationForm.applicationFormId) {
        navigate(`/screening-form/${applicationForm.applicationFormId}`);
        }
    };

    const getStatusInfo = () => {
      if (!applicationForm){
        return {
          text: 'Loading...',
          className: 'task-card-status--loading'
        }
      }

      const {type} = applicationForm;

      if (type === 'Screening') {
        return {
          text: 'Screening Information Required',
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

                <div className={`task-card-status ${statusInfo.className}`}>{statusInfo.text}</div>


            <div className="task-card-title">Become a foster caregiver</div>
        </div>
      </div>
    );
  };

export default ScreeningTaskCard;