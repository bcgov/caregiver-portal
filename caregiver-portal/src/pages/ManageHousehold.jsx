import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import RemoveHouseholdMemberModal from "../components/modals/RemoveHouseholdMemberModal";
import { useHouseholdContacts } from "../hooks/useHouseholdContacts";
import { useAdditionalAdultMembers } from "../hooks/useAdditionalAdultMembers";
import "../styles/index.css";

const ManageHousehold = () => {
    const navigate = useNavigate();
    const { contacts, hasResourceCase, caseOpenDate, removeContact, loading, error } =
        useHouseholdContacts();
    const { members: addedMembers } = useAdditionalAdultMembers();
    const [memberToRemove, setMemberToRemove] = useState(null);

    const breadcrumbItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Manage my household" },
    ];

    if (loading) return null;
    if (!error && !hasResourceCase) return <Navigate to="/dashboard" replace />;

    const handleRemove = async (caseContactId, departureDate) => {
        await removeContact(caseContactId, departureDate);
        setMemberToRemove(null);
    };

    // Added members stay listed until ICM adds them as a case contact, which is when they
    // arrive in `contacts`. Matching on name is the only link between the two.
    const normalize = (s) => (s ?? "").trim().toLowerCase();
    const contactNames = new Set(
        contacts.map((c) => `${normalize(c.first_name)} ${normalize(c.last_name)}`),
    );
    const added = addedMembers.filter(
        (m) => !contactNames.has(`${normalize(m.firstName)} ${normalize(m.lastName)}`),
    );

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
                    <h1 className="page-title">Manage my household</h1>
                </div>
                <div className="resubmission-subtitle">
                    <hr className="gold-underline-large" />
                    <h2 className="page-heading">Adults in my household</h2>
                </div>
                <div className="page-details-row-small">
                <div className="householdList">
                    {error && (
                        <p role="alert">
                            We couldn't load your household. Please try again
                            later.
                        </p>
                    )}
                    {!error && contacts.length === 0 && added.length === 0 && (
                        <p>You have no other adults in your household.</p>
                    )}
                    {contacts.map((c) => {
                        const name = `${c.first_name} ${c.last_name}`;
                        return (
                            <div key={c.case_contact_id} className="householdSummaryItem">
                                <div className="householdSummaryItemLeft">
                                    <div className="topLabel">
                                        <span className="nameLabel">{name} </span>
                                        <span className="pill">{c.relationship}</span>
                                    </div>
                                </div>
                                <div className="householdSummaryActions">
                                        {c.removal_requested ? (
                                            <span className="householdRemovalStatus">
                                                Removal requested
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                className="householdActionButton householdActionRemove"
                                                onClick={() => setMemberToRemove(c)}
                                                aria-label={`Remove ${name} from household`}
                                            >
                                                <CircleX size={20} />
                                            </button>
                                        )}
                                    </div>
                                    </div>
                            );
                        })}
                   {added.map((p) => {
                        const name = `${p.firstName} ${p.lastName}`;
                        return (
                            <div key={p.householdMemberId} className="householdSummaryItem">
                                <div className="householdSummaryItemLeft">
                                    <div className="topLabel">
                                        <span className="nameLabel">{name} </span>
                                        <span className="pill">{p.relationshipToPrimary}</span>
                                    </div>
                                </div>
                                <div className="householdSummaryActions">
                                    <span className="householdRemovalStatus">
                                        {p.submitted ? "Screening submitted" : "Information required"}
                                        </span>
                                </div>
                            </div>
                        );
                    })}

                    </div>
                </div>
                <div className="page-details-row-small page-button-row">
                    {!error && (
                        <Button onClick={() => navigate("/manage-household/add")}>
                            Add new household member
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                        Cancel
                    </Button>
                </div>
            </div>
            {memberToRemove && (
                <RemoveHouseholdMemberModal
                    member={memberToRemove}
                    caseOpenDate={caseOpenDate}
                    onCancel={() => setMemberToRemove(null)}
                    onRemove={handleRemove}
                />
            )}
        </div>
    );
};

export default ManageHousehold;
