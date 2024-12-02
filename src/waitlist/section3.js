import React, { useRef } from 'react';
import './styles/sec3.css';
import ads from './img/ads.png';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Section3() {
    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    return (
        <div className="container section3">
            <div className="box">
                <div className="head">
                    <h1>How It Works</h1>
                </div>
                <div className="body">
                    <h2 className="title">Effortless Advertising</h2>
                    <p className="description">
                        Streamline ad creation, approvals, and placement with precision and ease.
                    </p>
                </div>
                <div className="objects-scroll-wrapper">
                    <button className="scroll-btn left" onClick={scrollLeft}>
                        <FaChevronLeft />
                    </button>
                    <div
                        className="objects-scroll-container"
                        ref={scrollContainerRef}
                    >
                        <div className="objects">
                            {[
                                "Image Selection",
                                "Business Information",
                                "Website Selection",
                                "Website Categories",
                                "Ad Spaces",
                                "Final Preview",
                            ].map((title, index) => (
                                <div key={index} className="object-container">
                                    <div className="object">
                                        <img
                                            src={ads}
                                            alt={`${title} Visual`}
                                            className="ad-background-image"
                                        />
                                        <div className="object-overlay">
                                            <h3>{title}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="scroll-btn right" onClick={scrollRight}>
                        <FaChevronRight />
                    </button>
                </div>
                {/* <div className="scroll-indicator">
                    <div id="scroll-track" className="scroll-track"></div>
                </div> */}
            </div>
        </div>
    );
}

export default Section3;