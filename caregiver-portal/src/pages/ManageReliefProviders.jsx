import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CircleQuestionMark, CircleX } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import PersonRow from "../components/PersonRow";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import { useHouseholdContacts } from "../hooks/useHouseholdContacts";
import { useReliefProviders } from "../hooks/useReliefProviders";
import { useCancelApplicationPackage } from "../hooks/useCancelApplication";
import "../styles/index.css";

const STATUS_LABELS = {
    invited: "Invitation sent",
    redeemed: "Signed in",
    in_progress: "Application in progress",
    submitted: "Application submitted",
};

const ManageReliefProviders = () => {
    const navigate = useNavigate();
    const { hasResourceCase, loading: caseLoading } = useHouseholdContacts();
    const { providers, loading, error, refresh } = useReliefProviders();
    const { cancelApplicationPackage, isDeleting, error: cancelError, clearError } =
        useCancelApplicationPackage();
    const [toCancel, setToCancel] = useState(null);

    const breadcrumbItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Manage relief providers" },
    ];
    if (caseLoading || loading) return null;
    if (!hasResourceCase) return <Navigate to="/dashboard" replace />;

    const closeCancel = () => {
        setToCancel(null);
        clearError();
    };
    const handleCancel = async () => {
        try {
            await cancelApplicationPackage(toCancel.applicationPackageId);
            closeCancel();
            await refresh();
        } catch {
            // the message is shown in the modal
        }
    };
    return (
        <div className="page">
            <div className="page-details">
                <div className="page-details-row-breadcrumb">
                    <Breadcrumb items={breadcrumbItems} onBackClick={(item) => navigate(item.path)} />
                </div>
                <div className="page-details-row-small">
                    <h1 className="page-title">Manage relief providers</h1>
                </div>
                <div className="resubmission-subtitle">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Respite/relief providers</h2>
                </div>
                <div className="page-details-row-small">
                    <div className="householdList">
                        {error && <p role="alert">{error}</p>}
                        {!error && providers.length === 0 && (
                            <p>You have not invited any relief providers.</p>
                        )}
                        {providers.map((p) => {
                            const name = `${p.firstName} ${p.lastName}`;
                            return (
                                <PersonRow
                                    key={p.householdMemberId}
                                    name={name}
                                    tag={STATUS_LABELS[p.status]}
                                    detail={p.email}
                                >
                                    {p.canEdit && (
                                        <>
                                            <button
                                                type="button"
                                                className="householdActionButton householdActionView"
                                                onClick={() => navigate(`/manage-relief-providers/${p.applicationPackageId}/${p.householdMemberId}`)
                                            }
                                            aria-label={`View invitation for ${name}`}
                                        >
                                            <CircleQuestionMark size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            className="householdActionButton householdActionRemove"
                                            onClick={() => setToCancel(p)}
                                            aria-label={`Cancel invitation for ${name}`}
                                        >
                                            <CircleX size={20} />
                                        </button>
                                    </>
                                )}
                                </PersonRow>
                            );
                        })}
                        </div>
                    </div>
                    <div className="page-details-row-small page-button-row">
                    {!error && (
                        <Button onClick={() => navigate("/manage-relief-providers/add")}>
                            Invite Relief provider
                        </Button>
                    )}
                        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                            Back to dashboard
                        </Button>
                    </div>
                </div>
                <ConfirmationModal
                    isOpen={!!toCancel}
                    onClose={() => !isDeleting && closeCancel()}
                    onConfirm={handleCancel}
                    title="Cancel invitation"
                    confirmText="Cancel invitation"
                    cancelText="Keep invitation"
                    isLoading={isDeleting}
                    loadingText="Cancelling..."
                >
                <p>
                    Cancel the invitation for {toCancel?.firstName} {toCancel?.lastName}? Their access
                    code will stop working. You can invite them again later.
                </p>
                {cancelError && <p className="error-message" role="alert">{cancelError}</p>}
            </ConfirmationModal>
        </div>
    );
};

export default ManageReliefProviders;
