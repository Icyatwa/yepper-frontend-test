import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import support from '../assets/img/question.png';
import './styles/support.css'

function Support() {
    const [showSupportMenu, setShowSupportMenu] = useState(false);
    const menuRef = useRef(null);

    const toggleSupportMenu = () => {
        setShowSupportMenu(!showSupportMenu);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowSupportMenu(false);
        }
    };

    useEffect(() => {
        if (showSupportMenu) {
        document.addEventListener('mousedown', handleClickOutside);
        } else {
        document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSupportMenu]);
    
    return (
        <div>
            <button className='support' onClick={toggleSupportMenu}>
                <img src={support} alt=''/>
            </button>

            {showSupportMenu && (
                <div className='support-menu' ref={menuRef}>
                <Link className='support-link' to='/terms'>Terms and Conditions</Link>
                <Link className='support-link' to='/privacy'>Privacy Policy</Link>
                </div>
            )}
        </div>
    )
}

export default Support