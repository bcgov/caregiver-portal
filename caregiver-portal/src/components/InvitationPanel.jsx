import React, { useEffect, useState } from "react";
import Button from "./Button";
import EditInvitedPersonModal from "./modals/EditInvitedPersonModal";
import { useDates } from "../hooks/useDates";
import { useHousehold } from "../hooks/useHousehold";

const RESEND_COOLDOWN_MINUTES = 15;

const computeCooldown = (lastSent) => {
    if (!lastSent) return 0;
    const elapsed = (Date.now() - new Date(lastSent).getTime()) / 60000;
    return elapsed < RESEND_COOLDOWN_MINUTES ? Math.ceil(RESEND_COOLDOWN_MINUTES - elapsed) : 0;
};

// What the caregiver sees about a person who was invited but has not signed in yet: who we emailed, the
// access code, and the means to correct their details or send a new code.
// `member` is the household member; `onChanged()` reloads it after an edit.

const InvitationPanel = ({ applicationPackageId, member, onChanged, subject = "household member" }) => {
    const householdMemberId = member.householdMemberId;
    const { getAccessCode, updateHouseholdMemberInfo, resendMemberAccessCode } = useHousehold({
        applicationPackageId,
    });
    const { formatSubmissionDate } = useDates();

    const [accessCode, setAccessCode] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState(null);
    const [resendsRemainingToday, setResendsRemainingToday] = useState(null);
    const [cooldownMinutesRemaining, setCooldownMinutesRemaining] = useState(
        computeCooldown(member.invitationLastSent),
    );

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const data = await getAccessCode(householdMemberId);
            if (!cancelled) setAccessCode(data);
        })();
        return () => {
            cancelled = true;
        };
    }, [householdMemberId, getAccessCode]);
    useEffect(() => {
        if (cooldownMinutesRemaining <= 0) return;
        const interval = setInterval(() => {
            setCooldownMinutesRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 60000);
        return () => clearInterval(interval);
    }, [cooldownMinutesRemaining]);

    const accessCodeIsInvalid =
        accessCode &&
        (accessCode.isUsed || new Date(accessCode.expiresAt) < new Date() || accessCode.attemptCount >= 5);

        const applyNewCode = (result) => {
            setAccessCode({
                accessCode: result.accessCode,
                expiresAt: result.expiresAt,
                isUsed: false,
                attemptCount: 0,
            });
            setResendsRemainingToday(result.resendsRemainingToday);
            setCooldownMinutesRemaining(RESEND_COOLDOWN_MINUTES);
        };

        // saving the details sends a new code, so the provider is not left with one for the wrong name
        const handleSaveEdit = async (values) => {
            await updateHouseholdMemberInfo(householdMemberId, values);
            applyNewCode(await resendMemberAccessCode(householdMemberId));
            await onChanged();
            setIsEditing(false);
        };
        const handleResend = async () => {
            setIsResending(true);
            setResendSuccess(false);
            setResendError(null);
            try {
                applyNewCode(await resendMemberAccessCode(householdMemberId));
                setResendSuccess(true);
            } catch (error) {
                setResendError(error.message);
            } finally {
                setIsResending(false);
            }
        };
        return (
            <>
                <p>
                    We sent an invitation to <strong>{member.email}</strong> on{" "}
                    {member.invitationLastSent ? formatSubmissionDate(member.invitationLastSent) : "an unknown date"}
                </p>
                <p>{member.firstName} has not yet logged in to complete their application information.</p>
                <p>
                Note, {member.firstName}'s last name and date of birth must <strong>exactly</strong> match the
                information associated with their BC Services Card. If there is a difference you can{" "}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsEditing(true);
                    }}
                    className="hyperlink"
                >
                    update the {subject}'s information
                </a>
                . Updating the information will automatically send a new Access Code email.
            </p>
            {accessCodeIsInvalid ? (
                <p>
                    <strong>
                        The access code we sent has either expired or been used too many times by a user whose
                        information did not exactly match the information you provided. You can send a new access
                        code or update the information you provided so they can successfully continue.
                    </strong>
                </p>
            ) : (
                <p>
                    Once they have logged into the portal with their BC Services Card, they can use access code:{" "}
                    <strong>{accessCode?.accessCode || "Loading..."}</strong> to complete their application
                    activities. This access code was provided in the email we sent.
                </p>
            )}

            {!member.screeningInfoProvided && (
                <>
                <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                    {accessCodeIsInvalid && (
                        <Button
                            variant={cooldownMinutesRemaining > 0 ? "disabled" : "primary"}
                            onClick={handleResend}
                            disabled={isResending || cooldownMinutesRemaining > 0}
                        >
                            {isResending
                                ? "Sending..."
                                : cooldownMinutesRemaining > 0
                                  ? `New Access Code Available in ${cooldownMinutesRemaining} min`
                                  : "Send New Access Code"}
                        </Button>
                    )}
                        {resendsRemainingToday !== null && (
                            <span className="caption">{resendsRemainingToday} of 3 resends remaining today</span>
                        )}
                    </div>
                    {resendSuccess && <p className="text-success">Access code resent successfully.</p>}
                    {resendError && <p className="error-message">{resendError}</p>}
                </>
            )}
            {isEditing && (
                <EditInvitedPersonModal
                    person={member}
                    subject={subject}
                    cooldownMinutesRemaining={cooldownMinutesRemaining}
                    onSave={handleSaveEdit}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    );
};

export default InvitationPanel;


