// App.jsx 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import "@bcgov/bc-sans/css/BC_Sans.css"

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthCallback } from './components/AuthCallback';
import Footer from './components/Footer';
import Header from './components/Header';
import "./DesignTokens.css";
// Pages

import LoginPage from './pages/Login';
import Dashboard from "./pages/Dashboard";
import HouseholdLanding from './pages/HouseholdLanding';
import ApplicationPackageWrapper from "./components/ApplicationPackageWrapper";
import FosterApplicationProcess from './pages/FosterApplicationProcess';
import FosterApplicationPackage from './pages/FosterApplicationPackage';
import ApplicationForm from './pages/ApplicationForm';
import ProfileForm from './pages/ProfileForm';
import HouseholdForm from './pages/HouseholdForm';
import ReferralForm from './pages/ReferralForm';
import ConsentSummary from './pages/ConsentSummary';
import ConsentOverview from './pages/ConsentOverview';
import MedicalForms from './pages/MedicalForms';
import ScreeningForm from './pages/ScreeningForm';
import ScreeningPackage from './pages/ScreeningPackage';

// Component to conditionally render Footer
const ConditionalFooter = () => {
  const location = useLocation();
  const showFooter = location.pathname === '/' ||
                      location.pathname === '/login' ||
                      location.pathname === '/dashboard';

  return showFooter ? <Footer /> : null;
};

const App = () => {

  return (
    <Router>
    <div className="page-wrapper">
    <Header />
    <main className="main-content">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/household" element={<HouseholdLanding />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/foster-application/:applicationPackageId" element={<ProtectedRoute><FosterApplicationProcess /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId" element={<ProtectedRoute><FosterApplicationPackage /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/application-form/:applicationFormId" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/referral-form/:applicationFormId" element={<ProtectedRoute><ReferralForm /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/household-form/:applicationFormId" element={<ProtectedRoute><HouseholdForm /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/consent-summary/" element={<ProtectedRoute><ConsentSummary /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/consent-summary/:householdMemberId" element={<ProtectedRoute><ConsentOverview /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/medical-forms/:householdMemberId" element={<ProtectedRoute><MedicalForms /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/profile-form/:applicationFormId" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>}/>
        <Route path="/screening-package/:householdMemberId" element={<ProtectedRoute><ScreeningPackage /></ProtectedRoute>}/>
        <Route path="/screening-package/:householdMemberId/screening-form/:applicationFormId" element={<ProtectedRoute><ScreeningForm /></ProtectedRoute>}/>

      </Routes>
    </main>
    <ConditionalFooter />
    </div>
    </Router>
    
    );
  };

export default App;
