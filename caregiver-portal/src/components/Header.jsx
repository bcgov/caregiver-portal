import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import HamburgerMenu from './HamburgerMenu';
import BCLogo from '../assets/BCID_V_RGB_rev.svg';

const Header = () => {
    const auth = useAuth();

    return (
      <>
        <header className="top-nav">
          <title>MCFD Caregiver Portal</title>
          <nav className="nav-left">
            <img src={BCLogo} alt="BC Government Logo" className="bc-logo" />
            <div className="app-title">
              Caregiver <span className="highlight">Portal</span>
            </div>
          </nav>
          <nav className="nav-right">
            {auth.user ? (
              <HamburgerMenu />
            ) : (
              <Button onClick={auth.login} variant="nav">
                Log In
              </Button>
            )}
          </nav>
        </header>
        <div className="gold-underline" />
      </>
    );
  };

  export default Header;