import "@bcgov/bc-sans/css/BC_Sans.css";
import React from "react";
import { Footer } from "@bcgov/design-system-react-components";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { FaArrowLeft, FaBell } from "react-icons/fa";
import ProtectedRoute from './auth/ProtectedRoute';
import DashboardPage from "./pages/dashboard";
import LoginPage from "./pages/login";
import AuthCallback from "./pages/authcallback";
import "./App.css";

function AppShell() {
  const auth = useAuth();

  return (
    <>
      <header className="top-nav">
        <title>Caregiver Portal</title>
        <h1 className="app-title">
          Caregiver <span className="highlight">Portal</span>
        </h1>
        <div className="nav-right">


        {auth.isAuthenticated ? (
            <button onClick={() => auth.signoutRedirect()}>Log Out</button>
        ) : (
            <button onClick={() => auth.signinRedirect()}>Log In with BC Services Card</button>
        )}
        </div>
      </header>

      <div className="gold-underline" />

      <div className="sub-nav">
        <FaArrowLeft className="back-arrow" />
        <div className="divider" />
        <nav className="breadcrumbs">
          <a href="#">Home</a>
          <span>›</span>
          
        </nav>
      </div>

      <main className="main-content">
      <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
                } />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default AppShell;