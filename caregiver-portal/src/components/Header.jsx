import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import HamburgerMenu from './HamburgerMenu';
import BCLogo from '../assets/BCID_V_RGB_pos.png';

const Header = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const doNavigation = () => {
      if (auth.user) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
      return;
    }

    return (
      <>
        <header className="top-nav">
          <title>MCFD Caregiver Portal</title>
          <div className="nav-bar">
            <div className="nav-left" onClick={doNavigation} >
              <img src={BCLogo} alt="BC Government Logo" className="bc-logo" />
              <div className="app-title">
                Caregiver Portal
              </div>
            </div>
            <div className="nav-right">
            
            {auth.user ? (
              <HamburgerMenu />
            ) : (
              <Button onClick={auth.login} variant="nav">
                Create Account / Log In
              </Button>
            )}
            </div>
          </div>
        </header>
      </>
    );
  };

  export default Header;