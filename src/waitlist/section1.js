import React, { useState } from 'react';
import './styles/sec1.css';
import ads from './img/ads.png';
import close from './img/close.png';

function Section1() {
    const [modal, setModal] = useState(false);

    const handleModal = () => {
        setModal(true);
    };

    const cancelModal = () => {
        setModal(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            cancelModal();
        }
    };

    return (
        <div className="container section1">
            <div className="class">
                <div className="left">
                    <p>Spaces That Captivate</p>
                    <div className="btn-container">
                        <button onClick={handleModal} className="btn join">
                            Join our waitlist
                        </button>
                    </div>
                </div>
                <div className="img-container">
                    <img src={ads} alt="advertisement" />
                </div>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal">
                        <button onClick={cancelModal} className="cancel-btn">
                            <img src={close} alt="Close" />
                        </button>
                        <h2>Join Our Waitlist</h2>
                        <p>Sign up to stay updated.</p>
                        <input type="email" placeholder="Enter your email" className="email-input" />
                        <button className="submit-btn">Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Section1;