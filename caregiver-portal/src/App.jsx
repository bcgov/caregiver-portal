// App.jsx 
import "@bcgov/bc-sans/css/BC_Sans.css"
import { FaArrowLeft, FaBell } from "react-icons/fa";
import { Footer } from "@bcgov/design-system-react-components";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/login';
import { LoginButton } from "./components/LoginButton";
import Button from "./components/Button";
import Dashboard from "./pages/dashboard";
import { AuthCallback } from './components/AuthCallback';
import { useAuth } from './auth/useAuth'; // adjust path as needed


export default function App() {

  const auth = useAuth();

  return (
    <Router>
    <header className="top-nav">
      <title>B.C. Caregiver Portal</title>
      <h1 className="app-title">
        Caregiver <span className="highlight">Portal</span>
      </h1>
      <div className="nav-right">
        {auth.user ?
                 <Button
                    onClick={auth.logout}
                    variant="nav"
                  >
                    Logout
                  </Button>
              :
                <Button 
                  onClick={auth.login}
                variant="nav">Log In</Button>
        }
      </div>
    </header>

    <div className="gold-underline" />


    <main className="main-content">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </main>


  </Router>
);
}