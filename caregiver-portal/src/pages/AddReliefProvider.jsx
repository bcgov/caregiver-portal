import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import PersonFields from "../components/form/PersonFields";
import { useHouseholdContacts } from "../hooks/useHouseholdContacts";
import { useInviteReliefProvider } from "../hooks/useInviteReliefProvider";
import { useValidatedForm } from "../hooks/useValidatedForm";
import { validatePerson } from "../utils/personValidation";
import "../styles/index.css";

// Draft wording
const PREAMBLE =
    "A respite/relief provider is an adult who looks after the children in your care for short " +
    "periods, so that you can take a break. Every relief provider must complete screening " +
    "before they can provide care.";
const EXPECTATIONS =
    "After you send the invitation, we will email the provider an access code. They will sign in " +
    "with their BC Services Card, give their consent and complete their own application. " +
    "You can follow their progress on the Manage relief providers page.";

const EMPTY = { firstName: "", lastName: "", dateOfBirth: "", genderType: "", email: "" };
const getErrors = (values) => validatePerson(values, { subject: "provider" });

const AddReliefProvider = () => {
    const navigate = useNavigate();
    const { hasResourceCase, loading } = useHouseholdContacts();
    const { inviteProvider } = useInviteReliefProvider();
    const form = useValidatedForm(EMPTY, getErrors);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    if (loading) return null;
    if (!hasResourceCase) return <Navigate to="/dashboard" replace />;

    const handleSend = async () => {
        if (submitting) return;
        if (!form.isValid) {
            form.touchAll();
            return;
        }
        const { values } = form;
        setSubmitting(true);
        setServerError(null);
        try {
            await inviteProvider({
                ...values,
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim(),
            });
            navigate("/manage-relief-providers");
        } catch (err) {
            setServerError(err.message);
            setSubmitting(false);
        }
    };
    const breadcrumbItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Manage relief providers", path: "/manage-relief-providers" },
        { label: "Identify respite/relief provider" },
    ];

    return (
        <div className="page">
            <div className="page-details">
                <div className="page-details-row-breadcrumb">
                    <Breadcrumb items={breadcrumbItems} onBackClick={(item) => navigate(item.path)} />
                </div>
                <div className="add-member-pane">
                    <div className="page-details-row-small">
                        <h1 className="page-title">Identify respite/relief provider</h1>
                    </div>
                    <div className="page-details-row">
                        <p className="caption">A respite/relief provider is an adult who looks after the children in your care for short
                            periods, so that you can take a break. Every relief provider must complete screening
                            before they can provide care.</p>
                        <p className="caption">
                            After you send the invitation, we will email the provider an access code. They will sign in
                            with their BC Services Card, give their consent and complete their own application.
                            You can follow their progress on the Manage relief providers page.
                        </p>

                    </div>
                    <div className="field-group">
                        <PersonFields form={form} />
                    </div>

                    {serverError && <p className="error-message" role="alert">{serverError}</p>}
                    <div className="page-details-row-small page-button-row">
                        <Button variant="primary" onClick={handleSend} disabled={submitting}>
                            {submitting ? "Sending..." : "Send invitation"}
                        </Button>
                        <Button variant="secondary" onClick={() => navigate("/manage-relief-providers")}>
                            Back
                        </Button>
                    </div>
                </div>
            </div>
            </div>
    );
};

export default AddReliefProvider;
