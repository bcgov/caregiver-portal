import React from "react";
import SectionDescription from "./SectionDescription";
import HouseholdSummaryItem from "./HouseholdSummaryItem";
import { useEffect } from "react";
import { useHousehold } from "../hooks/useHousehold";

const HouseholdSummary = ({applicationPackageId}) => {

    const { partner, householdMembers, loadHousehold } = useHousehold({applicationPackageId});

    //console.log("Application ID in HouseholdSummary:", applicationId);

    useEffect(() => {
          loadHousehold();
      }, [applicationPackageId, loadHousehold]);

    return (
        <div>
        <h2>Consent from adult household members</h2>
        <SectionDescription>
            text
        </SectionDescription>
            {partner && partner.lastName && (
                <HouseholdSummaryItem 
                    key="partner"
                    member={partner}
                    applicationPackageId={applicationPackageId}
                />
            
            )}

            {householdMembers.map((member, index) => (
                <HouseholdSummaryItem 
                    key={index+1}
                    member={member}
                    applicationPackageId={applicationPackageId}
                />
            
            ))}

        </div>
    );

};

export default HouseholdSummary;
