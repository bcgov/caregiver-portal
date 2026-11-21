import React from "react";
import { CircleCheck } from "lucide-react";

// One line under "Completed tasks"
const CompletedTaskItem = ({ children }) => (
    <div className="task-item">
        <CircleCheck size={20} className="approved-badge" />{"  "}
        {children}
    </div>
);

export default CompletedTaskItem;
