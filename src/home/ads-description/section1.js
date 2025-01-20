import React from 'react';

function Section1() {
    return (
        <div className="flex items-center py-16 mt-8 md:mt-12"> {/* Added top margin */}
            <div className="max-w-6xl w-full mx-auto px-4">
                <div className="flex flex-col gap-12 items-center text-center">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-950 mb-4 relative inline-block">
                            <span className="relative inline-block text-blue-600 font-bold">
                                Collaborative
                                <span className="absolute left-0 bottom-[-6px] w-full h-[6px] bg-blue-100 z-[-1]"></span>
                            </span>{' '}
                            Advertising Reimagined
                        </h2>
                    </div>

                    {/* Description Blocks - Improved Layout */}
                    <div className="grid md:grid-cols-2 gap-8 mt-8 w-full max-w-5xl">
                        {/* Block 1 */}
                        <div className="group bg-white backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
                            <div className='flex flex-col items-start space-y-6'>
                                <div className='flex items-center w-full'>
                                    <div className="bg-red-100 text-[#FF4500] p-2 md:p-3 rounded-lg md:rounded-xl mr-3 md:mr-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-8 h-8"
                                        >
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-950">
                                        Personalized Design
                                    </h3>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-xl w-full">
                                    <p className="text-gray-600 leading-relaxed text-left">
                                        Craft ads that truly speak to your audience. Request tailored designs that
                                        capture your brand's unique voice and aesthetic.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Block 2 */}
                        <div className="group bg-white backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
                            <div className='flex flex-col items-start space-y-6'>
                                <div className='flex items-center w-full'>
                                    <div className="bg-red-100 text-[#FF4500] p-2 md:p-3 rounded-lg md:rounded-xl mr-3 md:mr-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-8 h-8"
                                        >
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Strategic Partnerships
                                    </h3>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-xl w-full">
                                    <p className="text-gray-700 leading-relaxed text-left">
                                        Connect with website owners in meaningful ways. Place ads that enhance
                                        visibility without compromising user experience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Section1;