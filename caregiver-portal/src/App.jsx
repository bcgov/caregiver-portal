// App.jsx 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "@bcgov/bc-sans/css/BC_Sans.css"

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthCallback } from './components/AuthCallback';
import Header from './components/Header';
import "./DesignTokens.css";
// Pages

import LoginPage from './pages/Login';
import Dashboard from "./pages/Dashboard";
import HouseholdLanding from './pages/HouseholdLanding';
import ApplicationPackageWrapper from "./components/ApplicationPackageWrapper";
import FosterApplicationProcess from './pages/FosterApplicationProcess';

const App = () => {

  return (
    <Router>
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
        <Route path="/foster-application/:applicationId" element={<ProtectedRoute><FosterApplicationProcess /></ProtectedRoute>}/>
        <Route path="/application/:applicationId" element={<ProtectedRoute><ApplicationPackageWrapper /></ProtectedRoute>}/>

      </Routes>
    </main>
    </Router>
    );
  };

export default App;
