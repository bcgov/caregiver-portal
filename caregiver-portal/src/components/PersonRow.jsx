import React from "react";

// One row of a household-style list: a name, a pill, and the caller's actions or status on the right.
const PersonRow = ({ name, tag, detail, children }) => (
    <div className="householdSummaryItem">
        <div className="householdSummaryItemLeft">
            <div className="topLabel">
                <span className="nameLabel">{name} </span>
                {tag && <span className="pill">{tag}</span>}
            </div>
            {detail && (
                <div className="bottomLabel">
                    <div>{detail}</div>
                </div>
            )}
        </div>
        <div className="householdSummaryActions">{children}</div>
    </div>
);

export default PersonRow;
