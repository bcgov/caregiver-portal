import React from "react";
import { CircleAlert, CircleCheck, ChevronRight, Check } from "lucide-react";

const HouseholdSummaryItem = ({member, onClick}) => {

    const calculateCompletion = (member) => {
        let completedTasks = 0;
        let totalTasks = 1;

        //console.log(member);

        // task 1: Account created
        if (member.userId) {
            completedTasks++;
        }

        if (member.requireScreening) {
            totalTasks = 2;
        }

        if (member.screeningProvided) {
            completedTasks = 2;
            totalTasks = 2;
        }

        return { completedTasks, totalTasks};
    };

    const { completedTasks, totalTasks } = calculateCompletion(member);

    return (
        <div className="householdSummaryItem" onClick={member.requireScreening && !member.screeningProvided ? onClick : null}>
            <div className="householdSummaryItemLeft">
                <div className="topLabel">
                    <span className="nameLabel">{member.firstName} {member.lastName} </span>
                    <span className="pill">{member.relationship}</span>
                </div>
                <div className="bottomLabel">
                    { !member.screeningProvided && member.requireScreening? 
                        <CircleAlert size={20} className="alert" /> 
                    : <CircleCheck size={20} className="completed" /> 
                    }

                    { member.screeningProvided && (
                    <div className="caption-small">Tasks completed</div>
                    )}

                    { !member.screeningProvided && member.requireScreening && (
                    <div className="caption-small">Tasks still outstanding</div>
                    )}

                    { !member.requireScreening && (
                    <div className="caption-small">Screening information is not required for non-adult household members.</div>
                    )}
                </div>
            </div>
                <span className="chevronRight">
                { member.requireScreening && !member.screeningProvided? 
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