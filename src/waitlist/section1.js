import React from 'react';
import './styles/sec1.css';
import ads from './img/ads.png'

function Section1() {
    return (
        <div className="container section1">
            <div className='class'>
                <div className='left'>
                    <p>Spaces That Captivate</p>
                    <div className='btn-container'>
                        <button className='btn join'>Join our waitlist</button>
                    </div>
                </div>
                <div className='img-container'>
                    <img src={ads} alt=''/>
                </div>
            </div>
        </div>
    );
}

export default Section1;
