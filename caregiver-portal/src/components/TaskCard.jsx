import React from 'react';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({applicationPackageId}) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (applicationPackageId) {
        navigate(`/foster-application/${applicationPackageId}`);
        }
    };
    
    return (
        <div className="task-card" onClick={() => handleClick()}>
        <div className="task-card-content">

                <div className="task-card-status">In progress</div>


            <div className="task-card-title">Become a foster caregiver</div>
        </div>
      </div>
    );
  };

export default TaskCard;