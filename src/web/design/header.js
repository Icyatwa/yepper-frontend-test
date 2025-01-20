// header.js
import React from 'react';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import './styles/header.css';
import Logo from '../../../components/logo';
import { Link } from 'react-router-dom';

const Header = ({ setTool, tool }) => {
    return (
        <header>
            <nav>
                <div className="container-head">
                    <div className="tools">
                        <button
                            className={`tool-btn ${tool === 'cursor' ? 'active' : ''}`}
                            onClick={() => setTool('cursor')}
                            title="Cursor (Select)"
                        >
                            <img src='https://cdn-icons-png.flaticon.com/128/5300/5300532.png' alt='Cursor'/>
                        </button>

                        <button
                            className={`tool-btn ${tool === 'rectangle' ? 'active' : ''}`}
                            onClick={() => setTool('rectangle')}
                            title="Rectangle Tool"
                        >
                            <img src='https://cdn-icons-png.flaticon.com/128/17045/17045401.png' alt='Rectangle'/>
                        </button>
                    </div>

                    <Logo />

                    <SignedIn>
                        <UserButton afterSignOutUrl='/sign-in' />
                    </SignedIn>
                </div>
            </nav>
        </header>
    );
};

export default Header;
