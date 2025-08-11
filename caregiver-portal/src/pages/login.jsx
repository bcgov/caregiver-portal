// src/pages/login.jsx
import { useAuth } from "../auth/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import FosterCard from "../components/FosterCard";

export default function Home() {
  const { user, logout, login, loading } = useAuth();
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
        <div className="page">
          <h1>Welcome to the <br/>B.C. Caregiver Portal</h1>
          <p>This is a one- or two-sentence summary of what people do in the portal...</p>
          <FosterCard variant="login"/>
        </div>
    </div>
  );
}