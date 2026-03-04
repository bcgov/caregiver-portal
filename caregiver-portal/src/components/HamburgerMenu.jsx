import React, {useState, useRef, useEffect} from 'react';
import { Menu, CircleUserRound, X } from 'lucide-react';
import Button from './Button';
import { useAuth } from "../hooks/useAuth";
import { useCommon } from '../hooks/useCommon';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, user } = useAuth();
    const menuRef = useRef(null);

    const {toTitleCase} = useCommon();

      // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
 
    };

    const handleMenuItemClick = (item) => {
        console.log(`Clicked: ${item}`);
        switch(item){
            case ("logout"):
                logout();
                break;
            default:
                setIsOpen(false); // Close menu after selection
                break;
        }
        
    };

    return (
        <div className="hamburger-container" ref={menuRef}>
            <Button
             variant="nav"
             onClick={toggleMenu}
             aria-label="Toggle menu"
             >
                {!isOpen ? 
                    <>
                        <CircleUserRound/><span className="hide-on-tiny-screens">{toTitleCase(user.name)}</span>
                    </>
                :
                    <>Close menu <X/></>
                }
            </Button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="dropdown-menu">
                <ul className="menu-list">
                <li className="menu-header">{toTitleCase(user.name?.replace(/undefined/gi, '').trim() || 'User')}</li>
                <li className="menu-item">
                    <button onClick={() => handleMenuItemClick('logout')}>
                    Log out
                    </button>
                </li>
                
                </ul>
            </div>                
            )}
        </div>

    );

};

export default HamburgerMenu;