import React, { useRef, useState } from "react";
import "./styles/sec3.css";
import ads from "./img/ads.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Section3() {
    const scrollContainerRef = useRef(null);
    const [modalData, setModalData] = useState(null);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };

    // Array of data for each object
    const objectsData = [
        {
            title: "Ad Selection",
            description: "Choose stunning visuals to represent your brand effectively.",
            image: ads,
        },
        {
            title: "Business Information",
            description: "Enter and manage all essential details about your business.",
            image: ads,
        },
        {
            title: "Website Selection",
            description: "Select target websites where your ads will appear.",
            image: ads,
        },
        {
            title: "Website Categories",
            description: "Categorize your ads to reach the right audience.",
            image: ads,
        },
        {
            title: "Ad Spaces",
            description: "Choose the perfect space for your ad placement.",
            image: ads,
        },
        {
            title: "Final Preview",
            description: "Preview your ad before publishing to ensure perfection.",
            image: ads,
        },
    ];

    const openModal = (data) => {
        setModalData(data);
    };

    const closeModal = () => {
        setModalData(null);
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
                            {objectsData.map((data, index) => (
                                <div
                                    key={index}
                                    className="object-container"
                                    onClick={() => openModal(data)}
                                >
                                    <div className="object">
                                        <img
                                            src={data.image}
                                            alt={`${data.title} Visual`}
                                            className="ad-background-image"
                                        />
                                        <div className="object-overlay">
                                            <h3>{data.title}</h3>
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
            </div>

            {modalData && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                    >
                        <button className="cancel-btn" onClick={closeModal}>
                            ✕
                        </button>
                        <div className="modal-body">
                            <div className="modal-header">
                                <h2>{modalData.title}</h2>
                            </div>
                            <div className="modal-content">
                                <div className="modal-image-container">
                                    <img
                                        src={modalData.image}
                                        alt={modalData.title}
                                        className="modal-image"
                                    />
                                </div>
                                <div className="modal-description-container">
                                    <p>{modalData.description}</p>
                                    <p>
                                        Additional detailed text can be added here. This area
                                        supports multiple paragraphs to provide extensive
                                        information.
                                    </p>
                                    <p>
                                        Feel free to style or format the content further for
                                        specific use cases.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="action-btn outline" onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Section3;