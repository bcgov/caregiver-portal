// App.jsx 
import "@bcgov/bc-sans/css/BC_Sans.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/login';
import Button from "./components/Button";
import Dashboard from "./pages/dashboard";
import Household from "./pages/household-member";
import { AuthCallback } from './components/AuthCallback';
import { useAuth } from './auth/useAuth'; // adjust path as needed
import BCLogo from "./assets/BCID_V_RGB_rev.svg";
import HamburgerMenu from "./components/HamburgerMenu";
import ApplicationPackageWrapper from "./components/ApplicationPackageWrapper";


export default function App() {

  const auth = useAuth();

  return (
    <Router>
    <header className="top-nav">
      <title>B.C. Caregiver Portal</title>
      <h1 className="app-title">
        <img src={BCLogo} alt="BC Government Logo" style={{width: '65px', height: 'auto'}}></img>
        Caregiver <span className="highlight">Portal</span>
      </h1>
      <div className="nav-right">


        {auth.user ?
                <HamburgerMenu/>
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
        <Route path="/household" element={<Household />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/application/:applicationId" element={<ProtectedRoute><ApplicationPackageWrapper /></ProtectedRoute>}/>

      </Routes>
    </main>


  </Router>
);
}