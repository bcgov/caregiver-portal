// src/pages/login.jsx
import { useAuth } from "../auth/useAuth";
import "../App.css";
import { LoginButton } from "../components/LoginButton";

export default function Home() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
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
        <div>
          <h1>Welcome to Our App!</h1>
          <p className="mb-4">Please log in to access your account.</p>
          <LoginButton />
        </div>
      )}
    </div>
  );
};