import React from 'react';
import { Plus, Trash } from 'lucide-react';
import Button from './Button';

const FormGroup = ({
    // section metadata
    title,
    description,
    className = '',
    // data management
    items = [],
    emptyStateMessage = "No items added yet.",
    // config
    allowAdd = false,
    allowRemove = false,
    addButtonText = "Add Item",
    itemTitleTemplate = (item, index) => `Item ${index + 1}`,
    //callbacks
    onAddItem,
    onUpdateItem,
    onRemoveItem,
    // field definitions
    fieldDefinitions = []
}) => {

    const renderField = (fieldDef, item, itemIndex) => {
        const {
            name,
            label,
            type,
            required = false,
            helpText,
            placeholder,
            options = [],
            component: CustomComponent,
            props = {},
            conditional
        } = fieldDef;
    
        //skip field if conditional function returns false
        if (conditional && !conditional(item, itemIndex)){
            return null;
        }
    
        const fieldId = `${name}-${item.id || itemIndex}`;
        const fieldValue = item[name] || '';
    
        const handleFieldChange = (value) => {
            onUpdateItem(item.id || itemIndex, name, value);
        }
    
        // render different input types
        switch (type) {
            case 'text':
            case 'email':
                return (
                    <div key={name}>
                        <label htmlFor={fieldId} className="form-control-label">
                            {label}{required && <span className="required">*</span>}
                        </label>
                        <input
                            type={type}
                            id={fieldId}
                            value={fieldValue}
                            placeholder={placeholder}
                            onChange={(e) => handleFieldChange(e.target.value)}
                            className="form-control"
                            {...props}
                        />
                        {helpText && <div className="helpter-text">{helpText}</div>}
                    </div>
                );
            case 'select':
                return (
                    <div key={name}>
                        <label htmlFor={fieldId} className="form-control-label">
                            {label}{required && <span className="required">*</span>}
                        </label>
                        <select
                            id={fieldId}
                            value={fieldValue}
                            onChange={(e) => handleFieldChange(e.target.value)}
                            {...props}
                        >
                            <option value="">Select {label.toLowerCase()}</option>
                            {options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>                            
                            ))}
                        </select>
                        {helpText && <div className="helpter-text">{helpText}</div>}
                    </div>
                );
            case 'custom':
                return (
                    <div key={name}>
                        <label htmlFor={fieldId} className="form-control-label">
                            {label}{required && <span className="required">*</span>}
                        </label>
                        <CustomComponent
                            id={fieldId}
                            value={fieldValue}
                            onChange={(e) => handleFieldChange(e.target.value)}
                            {...props}
                        />
                        {helpText && <div className="helpter-text">{helpText}</div>}
                    </div>
    
                );
            default:
                return null;
        }
    };
    
    const renderItem = (item, index) => {
        const itemId = item.id || `item-${index}`;
        const itemTitle = itemTitleTemplate(item, index);
    
        return (
            <div key={itemId} className="form-group-item">
                <div className="item-header">
                    <h3>{itemTitle}</h3>
                    {allowRemove && (
                        <Button
                            type="button"
                            onClick={() => onRemoveItem(item.id || index)}
                            variant="section-header"
                            aria-label={`Remove ${itemTitle.toLowerCase()}`}
                        >
                            Remove <Trash size={16} />
                        </Button>
                    )}
                </div>
                <div className="form-group">
                    {fieldDefinitions.map(fieldDef => renderField(fieldDef, item, index))}
                </div>
            </div>
        );
    }
    // component implementation
    return (
        <div className={`form-group-section ${className}`}>
            {title && (
                <div className="section-header">
                   <h2 className="section-header-title">{title}</h2> 
                </div>
            )}
            {description && (
                <div className="section-description">
                    <p>{description}</p>
                </div>
            )}
            {items.length === 0 && allowAdd && (
                <div className="empty-state">
                    <p>{emptyStateMessage}</p>
                </div>
            )}

            {items.map((item, index) => renderItem(item, index))}

            {allowAdd && (
                <div className="section-header">
                    <Button type="button" variant="primary" onClick={onAddItem}>
                        <Plus size={16} />
                            {addButtonText}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FormGroup;
