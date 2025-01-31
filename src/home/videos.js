// Videos.js
import React from 'react'
import { Link } from 'react-router-dom';
import video from '../img/1920x1080 (3).mp4'
import { ChevronRight, Clock, Eye } from 'lucide-react';

const Videos = () => {
    const videos = [
        {
            id: 1,
            title: "Introduction to Yepper",
            description: "Learn the basics of getting started with Yepper platform",
            duration: "6:30",
            views: "1.2k",
            videoUrl: video
        },
        {
            id: 2,
            title: "Advanced Yepper Features",
            description: "Dive deep into powerful Yepper functionalities",
            duration: "8:45",
            views: "856",
            videoUrl: video
        },
        {
            id: 3,
            title: "Yepper Tips & Tricks",
            description: "Expert tips to maximize your Yepper experience",
            duration: "5:15",
            views: "2.1k",
            videoUrl: video
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Featured Videos</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <Link 
                            key={video.id}
                            to={`/video/${video.id}`}
                            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative">
                                <video 
                                    className="w-full aspect-video object-cover"
                                    poster="/api/placeholder/400/250"
                                    preload="none"
                                    autoPlay
                                    loop
                                    muted // Added muted attribute as browsers typically require this for autoPlay
                                >
                                    <source src={video.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className="absolute bottom-2 right-2 bg-black/75 text-white text-sm px-2 py-1 rounded-md flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {video.duration}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                                    {video.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {video.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm">{video.views} views</span>
                                    </div>
                                    <div className="flex items-center text-orange-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                        Watch Now
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Videos;