import React from "react";
import { CircleAlert, CircleCheck, ChevronRight, Check } from "lucide-react";
import Button from "./Button";
import AccessCodeModal from "./AccessCodeModal";
import { useInviteHouseholdMember } from "../hooks/useInviteHouseholdMember";

const HouseholdSummaryItem = ({member, onClick}) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);    
    const [accessCodeData, setAccessCodeData] = React.useState(null);
    const { inviteMember, isLoading } = useInviteHouseholdMember();
    

    /*
    const handleInviteClick = async () => {
        try {
          const result = await inviteMember(applicationId, member.householdMemberId);
          setAccessCodeData(result);
          setIsModalOpen(true);
        } catch (err) {
          console.error('Failed to generate access code:', err);
          // TODO: You could show an error toast here
        }
      };
*/
  
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAccessCodeData(null);
      };

    const calculateCompletion = (member) => {
        let completedTasks = 0;
        let totalTasks = 1;

        console.log(member);

        // task 1: Account created
        if (member.userId) {
            completedTasks++;
        }

        if (member.requireScreening) {
            totalTasks = 2;
        }

        return { completedTasks, totalTasks};
    };

    const { completedTasks, totalTasks } = calculateCompletion(member);

    return (
        <div className="householdSummaryItem" onClick={member.requireScreening ? onClick : null}>
            <div className="householdSummaryItemLeft">
                <div className="topLabel">
                    <span className="nameLabel">{member.firstName} {member.lastName} </span>
                    <span className="pill">{member.relationship}</span>
                </div>
                <div className="bottomLabel">
                    { member.requireScreening ? 
                        <CircleAlert size={20} className="alert" /> 
                    : <CircleCheck size={20} className="completed" /> 
                    }

                    { member.requireScreening && (
                    <div className="caption-small">{completedTasks} of {totalTasks} tasks completed</div>
                    )}

                    { !member.requireScreening && (
                    <div className="caption-small">Screening information is not required for non-adult household members.</div>
                    )}
                </div>
            </div>
                <span className="chevronRight">
                { member.requireScreening ? 
                //    <Button
                //        onClick={handleInviteClick}
                //        disabled={isLoading}
                //        
                //        >
                //        Invite <ChevronRight size={40} />
                //    </Button>
                    <ChevronRight size={40}
                        className="chevronRight" 
                        />
                    : <Check size={40}
                        className="chevronRight" 
                        />  
                }

                </span>
                <AccessCodeModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    accessCode={accessCodeData?.accessCode}
                    memberName={`${member.firstName} ${member.lastName}`}
                    expiresAt={accessCodeData?.expiresAt}
                    isLoading={isLoading}
                />
        </div>

    );
};

export default HouseholdSummaryItem;