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

// Placeholder until the Add New Household Member form is built.
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
        <p id={`${field}-error`} className="error-message" role="alert">
            {showError(field)}
        </p>
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
                <div className="page-details-row-small page-button-row">
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/manage-household")}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddHouseholdMember;
