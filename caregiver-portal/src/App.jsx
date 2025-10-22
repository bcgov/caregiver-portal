// App.jsx 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="/foster-application/application-package/:applicationPackageId/application-form/:applicationId" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/referral-form/:applicationId" element={<ProtectedRoute><ReferralForm /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/household-form/:applicationId" element={<ProtectedRoute><HouseholdForm /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/consent-summary/" element={<ProtectedRoute><ConsentSummary /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/:applicationPackageId/consent-summary/:householdMemberId" element={<ProtectedRoute><ConsentOverview /></ProtectedRoute>}/>
        <Route path="/foster-application/application-package/profile-form/:applicationId" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>}/>
        <Route path="/application/:applicationId" element={<ProtectedRoute><ApplicationPackageWrapper /></ProtectedRoute>}/>

      </Routes>
    </main>
    <Footer></Footer>
    </div>
    </Router>
    
    );
  };

export default App;
