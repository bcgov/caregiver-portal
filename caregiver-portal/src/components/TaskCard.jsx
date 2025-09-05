import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TaskCard = ({applicationId}) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (applicationId) {
        navigate(`/foster-application/${applicationId}`);
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