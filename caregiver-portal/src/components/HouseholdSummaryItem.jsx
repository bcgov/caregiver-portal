import React from "react";
import { CircleAlert, CircleCheck, Check, CircleQuestionMark, CircleX } from "lucide-react";

const HouseholdSummaryItem = ({member, onView, onRemove}) => {

    const needsConsent = member.requireScreening && !member.screeningInfoProvided;
    const canRemove = !member.screeningInfoProvided;

    return (
        <div 
            className={`householdSummaryItem${needsConsent ? ' householdSummaryItemClickable' : ''}`}  
            onClick={needsConsent ? onView : undefined}
        >
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
                    <div>Tasks completed</div>
                    )}

                    { !member.screeningInfoProvided && member.requireScreening && (
                    <div>Tasks still outstanding</div>
                    )}

                    { !member.requireScreening && (
                    <div>Screening information is not required for non-adult household members.</div>
                    )}
                </div>
            </div>
            <div className="householdSummaryActions">
                {needsConsent ? (
                    <button 
                        type="button" 
                        className="householdActionButton householdActionView"
                        onClick={(e) => { e.stopPropagation(); onView(); }}
                        aria-label={`View consent summary for ${member.firstName} ${member.lastName}`}>
                            <CircleQuestionMark size={20} />
                        </button>
                ) : (
                    <Check size={20} className="householdActionDone" />
                )}
                
                <button
                    type="button"
                    className={`householdActionButton householdActionRemove${canRemove ? '' : ' householdActionHidden'}`}
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    disabled={!canRemove}
                    aria-label={`Remove ${member.firstName} ${member.lastName} from household`}
                >
                    <CircleX size={20} />
                </button>
            </div>
        </div>
    );
};

export default HouseholdSummaryItem;