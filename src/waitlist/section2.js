import React from 'react';
import './styles/sec2.css';
import logo from './img/logo.png';

function Section2() {
    return (
        <div className='container section2'>
            <div className='class-container'>
                <header className='section2-header'>
                    <div className='logo-container'>
                        <img src={logo} alt='Yepper Logo' className='logo-img' />
                        <h1>Yepper</h1>
                    </div>
                    <div className='dec-container'>
                        <p className='description'>
                            A platform that helps ad owners easily place their ads on websites.
                        </p>
                    </div>
                </header>

                <div className='section2-body'>
                    <div className='content-box left-box'>
                        <p>
                            Choose the best spaces for your ads, get them approved, and track their performance—all in one place. 
                            Reach your audience and grow your brand effortlessly!
                        </p>
                    </div>
                    <div className='content-box right-box'>
                        <div className='animated-logo'>
                            <img src={logo} alt='Yepper Logo Animated' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Section2;
