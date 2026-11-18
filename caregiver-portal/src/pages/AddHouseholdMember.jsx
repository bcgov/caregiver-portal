import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import FormField from "../components/form/FormField";
import PersonFields from "../components/form/PersonFields";
import SelectField from "../components/form/SelectField";
import { useHouseholdContacts } from "../hooks/useHouseholdContacts";
import { useAdditionalAdult } from "../hooks/useAdditionalAdult";
import { useValidatedForm } from "../hooks/useValidatedForm";
import { GENDERS } from "../constants/household";
import { toIsoLocal, twoYearsFromToday, validateMoveInDate } from "../utils/caseWindow";
import { validatePerson } from "../utils/personValidation";
import "../styles/index.css";

const RELATIONSHIPS = ["Child", "Parent", "Sibling", "Grandparent", "Grandchild", "Boarder", "Other"];

const EMPTY = {
    relationshipToPrimary: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    genderType: "",
    email: "",
    moveInDate: "",
};

const AddHouseholdMember = () => {
    const navigate = useNavigate();
    const { caseOpenDate } = useHouseholdContacts();
    const { addMember } = useAdditionalAdult();

    const getErrors = useCallback(
        (v) => ({
            relationshipToPrimary: v.relationshipToPrimary ? null : "Select a relationship.",
            ...validatePerson(v),
            moveInDate: validateMoveInDate(v.moveInDate, caseOpenDate),
        }),
        [caseOpenDate],
    );
    const form = useValidatedForm(EMPTY, getErrors);
    const { values } = form;

    const [confirming, setConfirming] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [submitAttempted, setSubmitAttempted] = useState(null);

    const handleConfirm = async () => {
        if (!form.isValid || submitting) return;
        setSubmitting(true);
        setServerError(null);
        setSubmitAttempted(true);
        try {
            const { applicationPackageId } = await addMember({
                ...values,
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim(),
            });
            navigate(`/additional-adult/application-package/${applicationPackageId}/consent-summary/`);
        } catch (err) {
            setServerError(err.message);
            setSubmitting(false);
            setConfirming(false);
        }
    };

    const breadcrumbItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Manage my household", path: "/manage-household" },
        { label: "Add new household member" },
    ];
    return (
        <div className="page">
            <div className="page-details">
                <div className="page-details-row-breadcrumb">
                    <Breadcrumb
                        items={breadcrumbItems}
                        onBackClick={(item) => navigate(item.path)}
                    />
                </div>
                <div className="add-member-pane">
                <div className="page-details-row-small">
                    <h1 className="page-title">Add new household member</h1>
                </div>
                <div className="page-details-row-small">
                    <p>
                        Every adult (18 or older) who lives in your home must complete screening
                        before they can be added to your household. After you submit, we will email
                        them an access code so they can provide their consents with their BC
                        Services Card.
                    </p>
                </div>

                <div className="field-group">
                        <SelectField
                            form={form}
                            name="relationshipToPrimary"
                            label="Relationship to you"
                            options={RELATIONSHIPS}
                            placeholder="Select relationship"
                        />
                        <PersonFields form={form} />
                        <FormField id="moveInDate" label="Move-in date" error={form.showError("moveInDate")}>
                            <input
                                id="moveInDate"
                                type="date"
                                className="form-control-date"
                                value={values.moveInDate}
                                min={caseOpenDate ? toIsoLocal(new Date(caseOpenDate)) : undefined}
                                max={twoYearsFromToday()}
                                onChange={form.set("moveInDate")}
                                onBlur={form.touch("moveInDate")}
                                aria-invalid={!!form.showError("moveInDate")}
                                aria-describedby="moveInDate-error"
                            />
                        </FormField>
                    </div>

                    {serverError && <p className="error-message" role="alert">{serverError}</p>}
                    <div className="page-details-row-small page-button-row">
                    {!form.isValid && submitAttempted && (
                      <p className="error-message" role="alert">Please fix the highlighted fields.</p>
                    )}
                    <Button variant="primary" onClick={() => { if (!form.isValid) { form.touchAll(); return; }setConfirming(true); }}>
                            Submit new household member
                        </Button>
                        <Button variant="secondary" onClick={() => navigate("/manage-household")}>
                            Cancel
                        </Button>
                </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirming}
                onClose={() => !submitting && setConfirming(false)}
                onConfirm={handleConfirm}
                title="Confirm new household member"
                confirmText="Confirm"
                confirmVariant="primary"
                isLoading={submitting}
                loadingText="Submitting..."
            >
            <p>Please check these details. We will email an access code to {values.email.trim()}.</p>
            <ul className="confirm-summary">
                <li><strong>Relationship:</strong> {values.relationshipToPrimary}</li>
                <li><strong>Name:</strong> {values.firstName.trim()} {values.lastName.trim()}</li>
                <li><strong>Date of birth:</strong> {values.dateOfBirth}</li>
                <li><strong>Gender:</strong> {GENDERS.find((g) => g.value === values.genderType)?.label}</li>
                <li><strong>Email:</strong> {values.email.trim()}</li>
                <li><strong>Move-in date:</strong> {values.moveInDate}</li>
            </ul>
            </ConfirmationModal>
        </div>

    );
};

export default AddHouseholdMember;
