import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import InvitationPanel from "../components/InvitationPanel";
import { useHousehold } from "../hooks/useHousehold";
import "../styles/index.css";

const ReliefProviderOverview = () => {
    const { applicationPackageId, householdMemberId } = useParams();
    const navigate = useNavigate();
    const { loadHouseholdMember } = useHousehold({ applicationPackageId });
    const [member, setMember] = useState(null);

    const reload = useCallback(async () => {
        const data = await loadHouseholdMember(householdMemberId);
        setMember(data?.householdMember ?? null);
    }, [loadHouseholdMember, householdMemberId]);
    useEffect(() => {
        reload();
    }, [reload]);

    const back = "/manage-relief-providers";
    const name = member ? `${member.firstName} ${member.lastName}` : "";
    const breadcrumbItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Manage relief providers", path: back },
        { label: name },
    ];
    return (
        <div className="page">
            <div className="page-details">
                <div className="page-details-row-breadcrumb">
                    <Breadcrumb items={breadcrumbItems} onBackClick={(item) => navigate(item.path)} />
                </div>
                <div className="page-details-row-small">
                    <h1 className="page-title">{name}</h1>
                </div>
                {member && (
                    <div className="page-details-row">
                        <div className="section-description">
                            {member.userId === null ? (
                                <InvitationPanel
                                    applicationPackageId={applicationPackageId}
                                    member={member}
                                    onChanged={reload}
                                    subject="provider"
                                />
                            ) : (
                                <p>{member.firstName} has logged into the portal to complete their application.</p>
                            )}
                        </div>
                    </div>
                )}
                <div className="page-details-row-small page-button-row">
                    <Button variant="secondary" onClick={() => navigate(back)}>
                        Back to relief providers
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReliefProviderOverview;
