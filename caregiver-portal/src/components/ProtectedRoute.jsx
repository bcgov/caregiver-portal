// components/ProtectedRoute.jsx
import { useAuth } from '../auth/useAuth';
import Button from './Button';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
  
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
  
    if (!user) {
      return (
        <div className="text-center mt-8">
          <h2 className="text-xl mb-4">Please log in to access this page</h2>

        </div>
      );
    }
  
    return children;
  };