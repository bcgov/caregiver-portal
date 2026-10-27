import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import { useHouseholdContacts } from "../hooks/useHouseholdContacts";
import "../styles/index.css";

const ManageHousehold = () => {
    const navigate = useNavigate();
    const { contacts, hasResourceCase, loading, error } =
        useHouseholdContacts();

    const breadcrumbItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Manage my household" },
    ];

    if (loading) return null;
    if (!error && !hasResourceCase) return <Navigate to="/dashboard" replace />;

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
                    {!error && contacts.length === 0 && (
                        <p>You have no other adults in your household.</p>
                    )}
                    {contacts.map((c) => (
                        <div
                            key={c.case_contact_id}
                            className="householdSummaryItem"
                        >
                            <div className="householdSummaryItemLeft">
                                <div className="topLabel">
                                    <span className="nameLabel">
                                        {c.first_name} {c.last_name}{" "}
                                    </span>
                                    <span className="pill">
                                        {c.relationship}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
                <div className="page-details-row-small">
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ManageHousehold;
