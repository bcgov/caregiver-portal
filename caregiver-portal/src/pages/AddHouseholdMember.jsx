import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import "../styles/index.css";

// Placeholder until the Add New Household Member form is built.
const AddHouseholdMember = () => {
    const navigate = useNavigate();

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
                    <p>This page is coming soon.</p>
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
