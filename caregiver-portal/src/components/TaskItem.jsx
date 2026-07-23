import React from 'react';
import { CircleCheck } from 'lucide-react';

const TaskItem = () => {

    return (
        <div className='task-item'>
            <CircleCheck size={20} className="approved-badge" />{'  '}You were<strong>approved</strong>to be a foster caregiver.
        </div>
      );
    };
  
  export default TaskItem;