import React from 'react';
import Button from '../Button';
import { ArrowRight } from 'lucide-react';

const GenericTaskCard = ({ title, description, buttonLabel, onClick, children }) => {
  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-content">
        {title && <div className="task-card-title">{title}</div>}
        {description && <div className="caption-small">{description}</div>}
        {children}
        {buttonLabel && (
          <Button variant="primary">{buttonLabel}<ArrowRight /></Button>
        )}
      </div>
    </div>
  );
};

export default GenericTaskCard;