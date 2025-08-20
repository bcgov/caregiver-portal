import React from 'react';
import { useAuth } from '../auth/useAuth';
import Button from './Button';
import HamburgerMenu from './HamburgerMenu';
import BCLogo from '../assets/BCID_V_RGB_rev.svg';

const Header = () => {
    const auth = useAuth();

    return (
      <>
        <header className="top-nav">
          <h1 className="app-title">
            <img src={BCLogo} alt="BC Government Logo" className="bc-logo" />
            Caregiver <span className="highlight">Portal</span>
          </h1>
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