import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import Button from '../Button';
import { toIsoLocal, twoYearsFromToday, validateDepartureDate } from '../../utils/caseWindow';

const RemoveHouseholdMemberModal = ({ member, caseOpenDate, onCancel, onRemove }) => {
    const [date, setDate] = useState('');
    const [touched, setTouched] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    const name = `${member.first_name} ${member.last_name}`;
    const validationError = validateDepartureDate(date, caseOpenDate);

    const handleRemove = async () => {
        if (validationError || submitting) return;
        setSubmitting(true);
        setServerError(null);
        try {
            await onRemove(member.case_contact_id, date); // parent closes the modal on success
        } catch (err) {
            setServerError(err.message);
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) onCancel();
    };

    return (
        <Modal
            isOpen
            onClose={handleClose}
            title="Remove household member"
            showCloseButton={false}
            closeOnOverlayClick={!submitting}
            size="medium"
        >
        <p>
            Tell us the date <strong>{name}</strong> left, or is leaving, your home.
            Your social worker will be notified and will update your resource case.
        </p>
        <p>
            {name} will show as &ldquo;Removal requested&rdquo; until your social worker
            has updated the case. You can&rsquo;t cancel the request once you submit it.
        </p>
        <label htmlFor="departure-date" className="form-control-label">
            Date of departure<span className="required">*</span>
        </label>
        <input
            id="departure-date"
            type="date"
            value={date}
            min={caseOpenDate ? toIsoLocal(new Date(caseOpenDate)) : undefined}
            max={twoYearsFromToday()}
            onChange={(e) => setDate(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && !!validationError}
            aria-describedby="departure-date-error"
            disabled={submitting}
        />
        <p id="departure-date-error" className="error-message" role="alert">
            {touched && validationError}
        </p>
        {serverError && (
            <p className="error-message" role="alert">{serverError}</p>
        )}
        <div className="confirmation-actions">
            <Button
                variant="danger"
                onClick={handleRemove}
                disabled={!!validationError || submitting}
            >
                {submitting ? 'Removing...' : 'Remove'}
            </Button>
            <Button variant="secondary" onClick={handleClose} disabled={submitting}>
                Cancel
            </Button>
        </div>
        </Modal>
    );
};

RemoveHouseholdMemberModal.propTypes = {
    member: PropTypes.shape({
        case_contact_id: PropTypes.string.isRequired,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
    }).isRequired,
    caseOpenDate: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default RemoveHouseholdMemberModal;

