import React, {useState, useRef, useEffect} from 'react';
import { useAuth } from "../hooks/useAuth";

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, user } = useAuth();
    const menuRef = useRef(null);

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
            <button
             className={`hamburger-button ${isOpen ? `active` : ''}`}
             onClick={toggleMenu}
             aria-label="Toggle menu"
             >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="dropdown-menu">
                <ul className="menu-list">
                <li className="menu-header">{user.name}</li>
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