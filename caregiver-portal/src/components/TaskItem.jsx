import React from 'react';
import { CircleCheck } from 'lucide-react';

import { useDates } from '../hooks/useDates';

const TYPE_LABELS = {
  FCH: 'foster caregiver',
  Kinship: 'kinship care provider',
};

const TaskItem = ({type, date}) => {

  const label = TYPE_LABELS[type] ?? 'foster caregiver'
  const { formatShortDate } = useDates();
  const onDate = date ? `on ${formatShortDate(date)}` : '';

    return (
        <div className='task-item'>
            <CircleCheck size={20} className="approved-badge" />{'  '}You were<strong>approved</strong>to be a {label} {onDate}
        </div>
      );
    };
  
  export default TaskItem;