import React, {useEffect, useState} from "react";
import HouseholdSummaryItem from "./HouseholdSummaryItem";
import ConfirmationModal from "./modals/ConfirmationModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useCancelApplicationPackage } from "../hooks/useCancelApplication";
import { useHousehold } from "../hooks/useHousehold";

const HouseholdSummary = ({applicationPackageId}) => {

    const { partner, householdMembers, loadHousehold, isLoading, removeHouseholdMember, removePartner, setHasHousehold, setHasPartner } = useHousehold({applicationPackageId});
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isAdditionalAdult = pathname.startsWith('/additional-adult/');
    const { cancelApplicationPackage } = useCancelApplicationPackage();

    const [removeTarget, setRemoveTarget] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const [removedMessage, setRemovedMessage] = useState('');
    const hasPartner = !!(partner && partner.lastName);
    const isHouseholdEmpty = !isLoading && !hasPartner && householdMembers.length === 0;
    const base = isAdditionalAdult
    ? '/additional-adult'
    : pathname.startsWith('/kinship-application/')
        ? '/kinship-application'
        : '/foster-application';
    const consentSummary = `${base}/application-package/${applicationPackageId}/consent-summary`;

    useEffect(() => {
          loadHousehold();
      }, [applicationPackageId, loadHousehold]);

    // clear the removal message after 5s
    useEffect(() => {
        if(!removedMessage) return;
        const t = setTimeout(() => setRemovedMessage(''), 5000);
        return () => clearTimeout(t);
    }, [removedMessage]);

    const openHouseholdMember = (householdMemberId) => {
        navigate(`${consentSummary}/${householdMemberId}`);
    }

    const handleConfirmRemove = async () => {
        if (!removeTarget) return;
        const { member, isPartner } = removeTarget;
        if (isAdditionalAdult) {
            // removing the new member cancels the whole Additional Adult package
            setIsRemoving(true);
            try {
                await cancelApplicationPackage(applicationPackageId);
                navigate('/dashboard');
            } catch {
                setRemovedMessage(`We couldn't remove ${member.firstName} ${member.lastName}. Please try again.`);
                setIsRemoving(false);
                setRemoveTarget(null);
            }
            return;
        }
        setIsRemoving(true);
        try {

            const ok = isPartner
                ? await removePartner()
                : await removeHouseholdMember(member.householdMemberId);

            if (ok) {
                if (isPartner) {
                    setHasPartner(false);
                } else if (householdMembers.length === 1) {
                    // that was the last non-partner member
                    setHasHousehold(false);
                }
            }

            setRemovedMessage(ok ? `${member.firstName} ${member.lastName} has been removed from your household.` : `We couldn't remove ${member.firstName} ${member.lastName}. Please try again.`);
        } finally {
            setIsRemoving(false);
            setRemoveTarget(null);
        }
    };


    return (
        <div className="page-details-content-col">
        <h1>Consents from household members</h1>

        { !isHouseholdEmpty && (
            <div className="section-description">
            In order to process your application, each adult you listed as residing in your household will need to submit to a screening process.
        </div>
        )}
            {partner && partner.lastName && (
                <HouseholdSummaryItem
                    key="partner"
                    member={partner}
                    applicationPackageId={applicationPackageId}
                    onView={() => openHouseholdMember(partner.householdMemberId)}
                    onRemove={() => setRemoveTarget({ member: partner, isPartner: true})}
                />
            )}

            {householdMembers.map((member, index) => (
                <HouseholdSummaryItem
                    key={member.householdMemberId ?? index + 1}
                    member={member}
                    applicationPackageId={applicationPackageId}
                    onView={() => openHouseholdMember(member.householdMemberId)}
                    onRemove={() => setRemoveTarget({member, isPartner: false})}
                />

            ))}

            {isHouseholdEmpty && (
                <div className="section-description" role="status">
                    You have removed all of your household members, your application will be automatically submitted in a few moments.{' '}
                    <a
                        href={`/foster-application/${applicationPackageId}`}
                        className="hyperlink"
                        onClick={(e) => { e.preventDefault(); navigate(`/foster-application/${applicationPackageId}`); }}
                    >
                        Return to your application.
                    </a>
                </div>
            )}

            {removedMessage && (
                <div key={removedMessage} className="household-removed-message" role="status">
                    {removedMessage}
                </div>
            )}

            <ConfirmationModal
            isOpen={!!removeTarget}
            onClose={() => setRemoveTarget(null)}
            onConfirm={handleConfirmRemove}
            title="Remove household member"
            message={removeTarget
                ? (isAdditionalAdult
                    ? `Remove ${removeTarget.member.firstName} ${removeTarget.member.lastName}? Their screening will be cancelled and the access code we emailed them will no longer work.`
                    : `Are you sure you want to remove ${removeTarget.member.firstName} ${removeTarget.member.lastName} from your household? This action cannot be undone.`)
                : ''}
            confirmText="Remove"
            isLoading={isRemoving}
            />
        </div>
    );
};

export default HouseholdSummary;
