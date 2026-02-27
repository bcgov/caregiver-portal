import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import HamburgerMenu from './HamburgerMenu';
import BCLogo from '../assets/BCID_H_RGB_pos.png';

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
          <title>B.C. Foster and Care Provider Portal</title>
          <div className="nav-bar">
            <div className="nav-left">
              <img src={BCLogo} alt="BC Government Logo" className="bc-logo" />
            </div>
            <div className="nav-right">
            
            {auth.user ? (
              <HamburgerMenu />
            ) : (
              <Button onClick={auth.login} variant="nav">
                <span className="hide-on-tiny-screens">Create Account / </span>Log In
              </Button>
            )}
            </div>
          </div>
        </header>
      </>
    );
  };

  export default Header;