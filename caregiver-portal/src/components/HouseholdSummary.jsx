import React from "react";
import SectionDescription from "./SectionDescription";
import HouseholdSummaryItem from "./HouseholdSummaryItem";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHousehold } from "../hooks/useHousehold";

const HouseholdSummary = ({applicationPackageId}) => {

    const { partner, householdMembers, loadHousehold } = useHousehold({applicationPackageId});
    const navigate = useNavigate();

    //console.log("Application ID in HouseholdSummary:", applicationId);

    useEffect(() => {
          loadHousehold();
      }, [applicationPackageId, loadHousehold]);

    const openHouseholdMember = (householdMemberId) => {
        navigate(`/foster-application/application-package/${applicationPackageId}/consent-summary/${householdMemberId}`);
    }

    return (
        <div>
        <h2>Consents from adult household members</h2>
        <div className="section-description">
        In order to process your application, each adult you listed as residing in your household will need to submit to a screening process.
        </div>
            {partner && partner.lastName && (
                <HouseholdSummaryItem 
                    key="partner"
                    member={partner}
                    applicationPackageId={applicationPackageId}
                    onClick={() => openHouseholdMember(partner.householdMemberId)}
                />
            
            )}

            {householdMembers.map((member, index) => (
                <HouseholdSummaryItem 
                    key={index+1}
                    member={member}
                    applicationPackageId={applicationPackageId}
                    onClick={() => openHouseholdMember(member.householdMemberId)}
                />
            
            ))}

        </div>
    );

};

export default HouseholdSummary;
