import "@bcgov/bc-sans/css/BC_Sans.css";
import React, {useState} from 'react'
import { Footer } from "@bcgov/design-system-react-components";
import {Routes, Route} from "react-router-dom";

import WelcomePage from "./pages/welcome";
import ProfilePage from "./pages/profile";

import './App.css'
import { FaArrowLeft, FaBell} from "react-icons/fa";

function App() {
  const [count, setCount] = useState(0)
  const isAuthenticated = true;

  return (
    <>
    <header className="top-nav">
      <title>Caregiver Portal</title>
      <h1 className="app-title">
        Caregiver <span className="highlight">Portal</span>
      </h1>
      <div className="nav-right">
        {isAuthenticated ? (
          <><div className="nav-item notifications">
            <FaBell />
            <span>Notifications ▾</span>
          </div><div className="nav-item user-info">
              <div className="avatar">TG</div>
              <div className="user-text">
                <div className="user-name">Tim Gunderson</div>
              </div>
              <span>▾</span>

            </div></>
        
        ) : (
          <button className="login-button">Log In</button>
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
        <span>Profile - Tim Gunderson</span>
      </nav>
    </div>

    <main className="main-content">
    <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </main>
    <Footer />
  </>
  )
}

export default App
