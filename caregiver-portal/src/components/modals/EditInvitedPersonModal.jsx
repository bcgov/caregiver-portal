import React, { useCallback, useState } from "react";
import Modal from "./Modal";
import Button from "../Button";
import DateOfBirthField from "../form/DateOfBirthField";
import TextField from "../form/TextField";
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from "../../constants/household";
import { useValidatedForm } from "../../hooks/useValidatedForm";
import { validatePerson } from "../../utils/personValidation";

// Correct an invited person's details before they sign in. `onSave(values)` may throw an Error with a
// displayable message; the parent closes the modal on success.
const EditInvitedPersonModal = ({ person, subject, cooldownMinutesRemaining = 0, onSave, onClose }) => {
    // validatePerson also checks first name and gender, which cannot be edited
    const getErrors = useCallback(
        (v) => {
            const { lastName, dateOfBirth, email } = validatePerson(
                { ...v, firstName: "x", genderType: "x" },
                { subject },
            );
            return { lastName, dateOfBirth, email };
        },
        [subject],
    );
    const form = useValidatedForm(
        {
            lastName: person.lastName ?? "",
            dateOfBirth: (person.dateOfBirth ?? "").slice(0, 10),
            email: person.email ?? "",
        },
        getErrors,
    );
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);
    const coolingDown = cooldownMinutesRemaining > 0;

    const handleSave = async () => {
        if (submitting || coolingDown) return;
        if (!form.isValid) {
            form.touchAll();
            return;
        }
        setSubmitting(true);
        setServerError(null);
        try {
            await onSave({
                lastName: form.values.lastName.trim(),
                dateOfBirth: form.values.dateOfBirth,
                email: form.values.email.trim(),
            });
        } catch (err) {
            setServerError(err.message);
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) onClose();
    };
    return (
        <Modal
            isOpen
            onClose={handleClose}
            title={`Edit ${subject} information`}
            showCloseButton={false}
            closeOnOverlayClick={!submitting}
            size="medium"
        >
            <div className="field-group">
                <TextField form={form} name="lastName" label="Last Name" maxLength={MAX_NAME_LENGTH} id="edit-lastName" />
                <DateOfBirthField form={form} />
                <TextField form={form} name="email" label="Email" type="email" maxLength={MAX_EMAIL_LENGTH} id="edit-email" />
            </div>
            {serverError && <p className="error-message" role="alert">{serverError}</p>}
            <div className="confirmation-actions">
                <Button
                    variant={submitting || coolingDown ? "disabled" : "primary"}
                    onClick={handleSave}
                    disabled={submitting || coolingDown}
                >
                    {submitting
                        ? "Saving..."
                        : coolingDown
                          ? `Available in ${cooldownMinutesRemaining} min`
                          : "Save Changes and Send New Access Code"}
                </Button>
                <Button variant="white" onClick={handleClose} disabled={submitting}>
                    Cancel
                </Button>
            </div>
            </Modal>
    );
};

export default EditInvitedPersonModal;
