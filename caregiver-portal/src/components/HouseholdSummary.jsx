import React from "react";
import SectionDescription from "./SectionDescription";
import HouseholdSummaryItem from "./HouseholdSummaryItem";
import { useEffect } from "react";
import { useHousehold } from "../hooks/useHousehold";


const HouseholdSummary = ({applicationId}) => {

    const { household, loadHousehold } = useHousehold({applicationId});

    //console.log("Application ID in HouseholdSummary:", applicationId);

    useEffect(() => {
          loadHousehold();
      }, [applicationId, loadHousehold]);

    return (
        <div>
        <h2>Consent from adult household members</h2>
        <SectionDescription>
            text
        </SectionDescription>

            {household.map((member, index) => (
                <HouseholdSummaryItem 
                    key={index}
                    member={member}
                    applicationId={applicationId}
                />
            
            ))}

        </div>
    );

};

export default HouseholdSummary;
