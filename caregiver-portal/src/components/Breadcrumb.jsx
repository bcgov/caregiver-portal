import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Breadcrumb = ({ items, onBackClick }) => {
    return (
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <div className="breadcrumb-container">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index === 0 ? (
                <button 
                  className="breadcrumb-back-link"
                  onClick={() => onBackClick(item)}
                  type="button"
                >
                  <ArrowLeft size={16} />
                  <span>{item.label}</span>
                </button>
              ) : (
                <>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-current">{item.label}</span>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    );
  };

  export default Breadcrumb;
