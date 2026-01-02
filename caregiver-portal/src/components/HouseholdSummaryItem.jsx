import React from "react";
import { CircleAlert, CircleCheck, ChevronRight, Check } from "lucide-react";

const HouseholdSummaryItem = ({member, onClick}) => {

    return (
        <div className="householdSummaryItem" onClick={member.requireScreening && !member.screeningInfoProvided ? onClick : null}>
            <div className="householdSummaryItemLeft">
                <div className="topLabel">
                    <span className="nameLabel">{member.firstName} {member.lastName} </span>
                    <span className="pill">{member.relationship}</span>
                </div>
                <div className="bottomLabel">
                    { !member.screeningInfoProvided && member.requireScreening? 
                        <CircleAlert size={20} className="alert" /> 
                    : <CircleCheck size={20} className="completed" /> 
                    }

                    { member.screeningInfoProvided && (
                    <div className="caption-small">Tasks completed</div>
                    )}

                    { !member.screeningInfoProvided && member.requireScreening && (
                    <div className="caption-small">Tasks still outstanding</div>
                    )}

                    { !member.requireScreening && (
                    <div className="caption-small">Screening information is not required for non-adult household members.</div>
                    )}
                </div>
            </div>
                <span className="chevronRight">
                { member.requireScreening && !member.screeningInfoProvided? 
                    <ChevronRight size={40}
                        className="chevronRight" 
                        />
                    : <Check size={40}
                        className="chevronRight" 
                        />  
                }
                </span>
        </div>
    );
};

export default HouseholdSummaryItem;