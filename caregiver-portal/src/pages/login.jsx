// src/pages/login.jsx
import { useAuth } from "../auth/useAuth";
import "../App.css";
import Button from "../components/Button";
import FosterCard from "../components/FosterCard";

export default function Home() {
  const { user, logout, login, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="page">
      {user ? (
        <div>
          <h1>Welcome back, {user.name}!</h1>
          <p>Email: {user.email}</p>
          <div className="mt-4 space-x-4">
            <a
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
            >
              Go to Dashboard
            </a>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="page">
          <h1>Welcome to the <br/>B.C. Caregiver Portal</h1>
          <p>This is a one- or two-sentence summary of what people do in the portal...</p>
          <FosterCard variant="login"/>
        </div>
      )}
    </div>
  );
}