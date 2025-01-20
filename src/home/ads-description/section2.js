import React from "react";
import { 
    FaFileUpload,
    FaBuilding,
    FaGlobeAmericas,
    FaList,
    FaAd,
    FaEye
} from 'react-icons/fa';

const Section2 = () => {
    const objects = [
        {
            icon: FaFileUpload,
            title: "Ad Selection",
            description: "Choose from a variety of ad formats tailored to your campaign goals.",
        },
        {
            icon: FaBuilding,
            title: "Business Information",
            description: "Provide key details about your business and target audience.",
        },
        {
            icon: FaGlobeAmericas,
            title: "Website Selection",
            description: "Select from our network of high-performing websites.",
        },
        {
            icon: FaList,
            title: "Website Categories",
            description: "Target specific website categories for precise audience reach.",
        },
        {
            icon: FaAd,
            title: "Ad Spaces",
            description: "Pick optimal ad placements for maximum visibility.",
        },
        {
            icon: FaEye,
            title: "Final Preview",
            description: "Review and confirm your ad campaign before launch.",
        }
    ];

    return (
        <div className="w-full py-12 px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-950 mb-4 relative inline-block">
                        How It Works
                        <div className="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-blue-600 rounded"></div>
                    </h1>
                </div>
                
                <div className="text-center max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-semibold text-blue-950 mb-3">
                        Effortless Advertising
                    </h2>
                    <p className="text-lg md:text-lg text-gray-600">
                        Streamline ad creation, approvals, and placement with precision and ease.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {objects.map((object, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-xl shadow-lg border border-gray-200 p-6
                                     flex flex-col items-center gap-4 
                                     transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="text-4xl md:text-5xl text-[#FF4500] group-hover:scale-110 transition-transform duration-300">
                                <object.icon />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-blue-950">
                                {object.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 text-center">
                                {object.description}
                            </p>
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#FF4500] rounded-t-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Section2;