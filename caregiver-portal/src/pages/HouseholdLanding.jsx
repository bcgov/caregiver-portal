// src/pages/household-member.jsx
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../DesignTokens.css";
import Button from "../components/Button";

export default function HouseholdLanding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // redirect to dashboard if user is logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

    // Only show the login UI if there's no authenticated user
    if (user) {
      // Show a brief loading state while redirecting
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </div>
        </div>
      );
    }
  
  
  return (
    <div className="page">
        <div className="label">
          <h1>Your consent is required</h1>
          <p>You've been named as a household member on an application to provide Foster Family Care.</p>
          <p>In order to process this application, the Ministry of Children and Family Development must conduct screening checks on all adult household members.</p>
          <p>Please enter the <strong>access code</strong> from the email invitation you received and log in with your BC Services Card to proceed.</p>
          <div className="form-group">
            <label htmlFor="access-code" className="form-control-label">
                    Access code
            </label>
            <input className="form-control" type="text"></input>
            <div className="helper-text">Enter the code from the email you received.</div>
          </div>
          <Button variant="primary">Log in with BC Services Card</Button>
          <div className="section-description">
            <h4>BC Services Card Required</h4>
            <p>You will be prompted to log in with your BC Services Card account.</p>
            <p>If you don't have a BC Services Card, you will need to complete and sign these forms and provide them to the primary applicant to submit on your behalf.</p>
          </div>
        </div>
    </div>
  );
}