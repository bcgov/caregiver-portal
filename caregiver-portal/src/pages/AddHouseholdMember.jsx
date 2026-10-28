import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import DateField from "../components/Date";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import { useHouseholdContacts } from "../hooks/useHouseholdContacts";
import { useAdditionalAdult } from "../hooks/useAdditionalAdult";
import { EMAIL_REGEX, MAX_EMAIL_LENGTH } from "../constants/household";
import {
    toIsoLocal,
    twoYearsFromToday,
    validateAdultDob,
    validateMoveInDate,
} from "../utils/caseWindow";
import "../styles/index.css";

const MAX_NAME_LENGTH = 50;
const RELATIONSHIPS = ["Child", "Parent", "Sibling", "Grandparent", "Grandchild", "Boarder", "Other"];
const GENDERS = [
    { value: "Man/Boy", label: "Man/Boy" },
    { value: "Woman/Girl", label: "Woman/Girl" },
    { value: "Non-Binary", label: "Non-Binary" },
    { value: "Unknown", label: "Prefer not to say" },
];

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

    const [values, setValues] = useState(EMPTY);
    const [touched, setTouched] = useState({});
    const [confirming, setConfirming] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
    const touch = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

    const errors = useMemo(() => {
        const email = values.email.trim();
        return {
            relationshipToPrimary: values.relationshipToPrimary ? null : "Select a relationship.",
            firstName: values.firstName.trim() ? null : "First name is required.",
            lastName: values.lastName.trim() ? null : "Last name is required.",
            dateOfBirth: validateAdultDob(values.dateOfBirth),
            genderType: values.genderType ? null : "Select a gender.",
            email: !email
                ? "Email is required."
                : email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)
                    ? "Please enter a valid email address."
                    : null,
            moveInDate: validateMoveInDate(values.moveInDate, caseOpenDate),
        };
    }, [values, caseOpenDate]);

    const isValid = Object.values(errors).every((e) => !e);
    const showError = (field) => touched[field] && errors[field];
    const fieldError = (field) => (
        <span id={`${field}-error`} className="error-message" role="alert">
            {showError(field)}
        </span>
    );

    const handleConfirm = async () => {
        if (!isValid || submitting) return;
        setSubmitting(true);
        setServerError(null);
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
                    <label htmlFor="relationship" className="form-control-label">
                        Relationship to you<span className="required">*</span>
                    </label>
                    <select
                        id="relationship"
                        value={values.relationshipToPrimary}
                        onChange={set("relationshipToPrimary")}
                        onBlur={touch("relationshipToPrimary")}
                        aria-invalid={!!showError("relationshipToPrimary")}
                        aria-describedby="relationshipToPrimary-error"
                    >
                        <option value="">Select relationship</option>
                        {RELATIONSHIPS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    {fieldError("relationshipToPrimary")}

                    <label htmlFor="firstName" className="form-control-label">
                        First Name<span className="required">*</span>
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        className="form-control"
                        value={values.firstName}
                        onChange={set("firstName")}
                        onBlur={touch("firstName")}
                        maxLength={MAX_NAME_LENGTH}
                        aria-invalid={!!showError("firstName")}
                        aria-describedby="firstName-error"
                    />
                    {fieldError("firstName")}

                    <label htmlFor="lastName" className="form-control-label">
                        Last Name<span className="required">*</span>
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        className="form-control"
                        value={values.lastName}
                        onChange={set("lastName")}
                        onBlur={touch("lastName")}
                        maxLength={MAX_NAME_LENGTH}
                        aria-invalid={!!showError("lastName")}
                        aria-describedby="lastName-error"
                    />
                    {fieldError("lastName")}
                    <label htmlFor="dateOfBirth" className="form-control-label">
                        Date of Birth<span className="required">*</span>
                    </label>
                    <DateField
                        id="dateOfBirth"
                        variant="adult18"
                        value={values.dateOfBirth}
                        onChange={set("dateOfBirth")}
                        onBlur={touch("dateOfBirth")}
                        aria-describedby="dateOfBirth-error"
                    />
                    {fieldError("dateOfBirth")}

                    <div className="radio-button-group">
                        <div className="radio-button-header">
                            Please indicate their gender:<span className="required">*</span>
                        </div>
                        {GENDERS.map((g) => (
                            <label key={g.value}>
                                <input
                                    type="radio"
                                    name="genderType"
                                    value={g.value}
                                    checked={values.genderType === g.value}
                                    onChange={(e) => {
                                        set("genderType")(e);
                                        touch("genderType")();
                                    }}
                                />
                                {g.label}
                            </label>
                        ))}
                    </div>
                    {fieldError("genderType")}

                    <label htmlFor="email" className="form-control-label">
                        Email<span className="required">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={values.email}
                        onChange={set("email")}
                        onBlur={touch("email")}
                        maxLength={MAX_EMAIL_LENGTH}
                        aria-invalid={!!showError("email")}
                        aria-describedby="email-error"
                    />
                    {fieldError("email")}

                    <label htmlFor="moveInDate" className="form-control-label">
                        Move-in date<span className="required">*</span>
                    </label>
                    <input
                        id="moveInDate"
                        type="date"
                        className="form-control-date"
                        value={values.moveInDate}
                        min={caseOpenDate ? toIsoLocal(new Date(caseOpenDate)) : undefined}
                        max={twoYearsFromToday()}
                        onChange={set("moveInDate")}
                        onBlur={touch("moveInDate")}
                        aria-invalid={!!showError("moveInDate")}
                        aria-describedby="moveInDate-error"
                    />
                    {fieldError("moveInDate")}
                </div>

                {serverError && <p className="error-message" role="alert">{serverError}</p>}
                <div className="page-details-row-small page-button-row">
                    <Button variant="primary" disabled={!isValid} onClick={() => setConfirming(true)}>
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
