import React from "react";
import { CircleAlert, CircleCheck, CircleArrowRight, ChevronRight } from "lucide-react";
import Button from "./Button";
import AccessCodeModal from "./AccessCodeModal";
import { useInviteHouseholdMember } from "../hooks/useInviteHouseholdMember";

const HouseholdSummaryItem = ({member, applicationId}) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);    
    const [accessCodeData, setAccessCodeData] = React.useState(null);
    const { inviteMember, isLoading, error } = useInviteHouseholdMember();

    const handleInviteClick = async () => {
        try {
          const result = await inviteMember(applicationId, member.householdMemberId);
          setAccessCodeData(result);
          setIsModalOpen(true);
        } catch (err) {
          console.error('Failed to generate access code:', err);
          // You could show an error toast here
        }
      };
  
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAccessCodeData(null);
      };

    return (
        <div className="householdSummaryItem">
            <div className="householdSummaryItemLeft">
                <div className="topLabel">
                    <span className="nameLabel">{member.firstName} {member.lastName} </span>
                    <span className="pill">{member.relationshipToPrimary}</span>
                </div>
                <div className="bottomLabel">
                    { member.requireScreening ? 
                        <CircleAlert size={20} className="alert" /> 
                    : <CircleCheck size={20} className="completed" /> 
                    }
                    
                </div>
            </div>
                <span className="chevronRight">
                { member.requireScreening ? 
                    <Button
                        onClick={handleInviteClick}
                        disabled={isLoading}
                        
                        >
                        Invite <ChevronRight size={40} />
                    </Button>
                    : <ChevronRight size={40}
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