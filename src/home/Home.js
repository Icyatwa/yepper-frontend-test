import React from 'react';
import { Sparkles, Target } from 'lucide-react';
import Header from '../components/description-header';
import AdSide from '../components/AdSide';
import SpaceSide from '../components/SpaceSide';
import Support from '../components/support';

function Home() {

    return (
        <div className="ad-waitlist min-h-screen bg-gradient-to-br from-white to-blue-50">
            <Header />
            <Support />
            <main className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-4xl mx-auto text-center mb-8 md:mb-16">
                    <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4 md:mb-6">
                        <Sparkles className="mr-1.5 md:mr-2 text-blue-600" size={16} />
                        <span className="text-xs md:text-sm font-medium">Revolutionizing Digital Advertising</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 mb-4 md:mb-6 leading-tight tracking-tight px-2">
                        Forging Powerful Connections
                        <br className="hidden md:block" />
                        <span className="text-blue-600 block md:inline"> Through Intelligent Advertising</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-10 max-w-2xl mx-auto px-2">
                        Seamlessly bridge advertisers and publishers with our cutting-edge platform that transforms digital advertising into meaningful connections.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl border border-gray-100">
                        <div className="p-4 md:p-8">
                            <div className="mb-4 md:mb-6 flex items-center">
                                <div className="bg-red-100 text-[#FF4500] p-2 md:p-3 rounded-lg md:rounded-xl mr-3 md:mr-4">
                                    <Target size={24} strokeWidth={2} className="md:w-8 md:h-8" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold  text-blue-950">Yepper Ads</h2>
                            </div>
                            <AdSide />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl border border-gray-100">
                        <div className="p-4 md:p-8">
                            <div className="mb-4 md:mb-6 flex items-center">
                                <div className="bg-red-100 text-[#FF4500] p-2 md:p-3 rounded-lg md:rounded-xl mr-3 md:mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-8 md:h-8">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="2" x2="22" y1="12" y2="12"></line>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold  text-blue-950">Yepper Spaces</h2>
                            </div>
                            <SpaceSide />

                        </div>
                    </div>
                </div>

                <div className="text-center mt-8 md:mt-16">
                    <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 md:px-6 md:py-3 rounded-full">
                        <span className="text-sm md:text-base font-semibold">
                            Connecting Advertisers and Publishers Intelligently
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;