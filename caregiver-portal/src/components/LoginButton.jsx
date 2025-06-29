// components/LoginButton.jsx
import { useAuth } from '../auth/useAuth';

export const LoginButton = () => {
    const { isAuthenticated, login, logout, loading } = useAuth();
  
    if (loading) {
      return (
        <button className="bg-gray-400 text-white px-6 py-2 rounded cursor-wait" disabled>
          Checking session...
        </button>
      );
    }
  
    return isAuthenticated ? (
      <button
        onClick={logout}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Log Out
      </button>
    ) : (
      <button
        onClick={login}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Log In with BC Services Card!
      </button>
    );
  };