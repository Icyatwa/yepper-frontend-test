import React, { useState, useEffect, useRef } from 'react'
import intro_vid from '../img/1920x1080 (3).mp4'
import benefits_vid from '../img/Benefits of using yepper (4).mp4'
import promotion_vid from '../img/Add a heading.mp4'
import { Clock, Eye, ThumbsUp, Play, Film, Volume2, VolumeX } from 'lucide-react';
import VideoModal from './video';
import Header from '../components/backToPreviousHeader';

const Videos = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [categories, setCategories] = useState('all');
    const [hoveredVideo, setHoveredVideo] = useState(null);
    const videoRefs = useRef({});
    const [isMuted, setIsMuted] = useState(true);
    
    const videos = [
        {
            id: 1,
            title: "Introduction to Yepper",
            description: "Learn the basics of getting started with Yepper platform",
            duration: "1:57",
            views: "1.2k",
            likes: "342",
            category: "beginner",
            thumbnail: "/api/placeholder/400/250",
            videoUrl: intro_vid,
            date: "Feb 21, 2025"
        },
        {
            id: 2,
            title: "Benefits of using Yepper",
            description: "Get to know Yepper better",
            duration: "0:57",
            views: "856",
            likes: "208",
            category: "advanced",
            thumbnail: "/api/placeholder/400/250",
            videoUrl: benefits_vid,
            date: "Feb 21, 2025"
        },
        {
            id: 3,
            title: "Promotion",
            description: "Expert tips to maximize your Yepper experience",
            duration: "0:13",
            views: "2.1k",
            likes: "467",
            category: "tips",
            thumbnail: "/api/placeholder/400/250",
            videoUrl: promotion_vid,
            date: "Feb 21, 2025"
        }
    ];

    const filteredVideos = categories === 'all' 
        ? videos 
        : videos.filter(video => video.category === categories);

    // Initialize and manage video playback
    useEffect(() => {
        // Start autoplaying videos when they're in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const videoElement = entry.target;
                if (entry.isIntersecting) {
                    // Reset video to beginning before playing
                    videoElement.currentTime = 0;
                    videoElement.play().catch(e => console.log("Autoplay prevented", e));
                } else {
                    videoElement.pause();
                }
            });
        }, { threshold: 0.5 });
        
        // Observe all video elements
        Object.values(videoRefs.current).forEach(videoEl => {
            if (videoEl) {
                observer.observe(videoEl);
            }
        });
        
        return () => {
            Object.values(videoRefs.current).forEach(videoEl => {
                if (videoEl) {
                    observer.unobserve(videoEl);
                    videoEl.pause();
                }
            });
        };
    }, [filteredVideos]);

    const openVideoModal = (video) => {
        // Pause all preview videos when opening modal
        Object.values(videoRefs.current).forEach(videoEl => {
            if (videoEl) videoEl.pause();
        });
        
        setSelectedVideo(video);
        document.body.style.overflow = 'hidden';
    };

    const closeVideoModal = () => {
        setSelectedVideo(null);
        document.body.style.overflow = 'auto';
        
        // Resume autoplay of videos in viewport
        Object.values(videoRefs.current).forEach(videoEl => {
            if (videoEl && videoEl.getBoundingClientRect().top >= 0 && 
                videoEl.getBoundingClientRect().bottom <= window.innerHeight) {
                videoEl.play().catch(e => console.log("Autoplay prevented"));
            }
        });
    };

    const handleVideoHover = (id) => {
        setHoveredVideo(id);
    };

    const handleVideoLeave = () => {
        setHoveredVideo(null);
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
        
        // Apply mute/unmute to all video elements
        Object.values(videoRefs.current).forEach(videoEl => {
            if (videoEl) videoEl.muted = !isMuted;
        });
    };

    return (
        <div className="ad-waitlist min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                            <Film className="text-orange-500" />
                            Featured Videos
                        </div>
                    </h1>
                    <div className="flex gap-3 items-center">
                        {/* Global sound control */}
                        <button 
                            onClick={toggleMute}
                            className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 mr-2"
                            aria-label={isMuted ? "Unmute videos" : "Mute videos"}
                            title={isMuted ? "Unmute videos" : "Mute videos"}
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        
                        <button 
                            onClick={() => setCategories('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                categories === 'all' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setCategories('beginner')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                categories === 'beginner' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Beginner
                        </button>
                        <button 
                            onClick={() => setCategories('advanced')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                categories === 'advanced' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Advanced
                        </button>
                        <button 
                            onClick={() => setCategories('tips')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                categories === 'tips' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Tips
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVideos.map((videoItem) => (
                        <div
                            key={videoItem.id}
                            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                            onClick={() => openVideoModal(videoItem)}
                            onMouseEnter={() => handleVideoHover(videoItem.id)}
                            onMouseLeave={handleVideoLeave}
                        >
                            <div className="relative">
                                <div className="relative overflow-hidden">
                                    <video 
                                        className={`w-full aspect-video object-cover transition-all duration-500 ${hoveredVideo === videoItem.id ? 'scale-105' : 'scale-100'}`}
                                        // poster={videoItem.thumbnail}
                                        playsInline
                                        muted={isMuted}
                                        loop
                                        autoPlay
                                        ref={el => {
                                            if (el) videoRefs.current[videoItem.id] = el;
                                        }}
                                    >
                                        <source src={videoItem.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 flex items-center justify-center transition-opacity duration-300 ${
                                        hoveredVideo === videoItem.id ? 'opacity-80' : 'opacity-40'
                                    }`}>
                                        {hoveredVideo === videoItem.id && (
                                            <div className="w-16 h-16 rounded-full bg-orange-500/90 flex items-center justify-center transform hover:scale-110 transition-transform">
                                                <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                            </div>
                                        )}
                                        
                                        {/* Video Indicator Badge */}
                                        <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium animate-pulse">
                                            <Film className="w-3 h-3" />
                                            LIVE PREVIEW
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                    <div className="flex justify-between items-center text-white">
                                        <div className="flex items-center gap-1 text-sm">
                                            <Clock className="w-3 h-3" />
                                            {videoItem.duration}
                                        </div>
                                        {/* <div className="flex items-center gap-1 text-sm">
                                            <Eye className="w-3 h-3" />
                                            {videoItem.views}
                                        </div> */}
                                    </div>
                                </div>
                                
                                <div className="absolute top-3 right-3">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                        videoItem.category === 'beginner' ? 'bg-green-500/90 text-white' :
                                        videoItem.category === 'advanced' ? 'bg-purple-500/90 text-white' :
                                        'bg-blue-500/90 text-white'
                                    }`}>
                                        {videoItem.category.charAt(0).toUpperCase() + videoItem.category.slice(1)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors line-clamp-1 flex items-center gap-2">
                                    <Play className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                    {videoItem.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {videoItem.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-500 text-xs">
                                        {videoItem.date}
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        {/* <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            <ThumbsUp className="w-4 h-4" />
                                            {videoItem.likes}
                                        </div> */}
                                        <div className="flex items-center text-orange-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                            <Play className="w-4 h-4 mr-1" /> Watch Full Video
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredVideos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-600">No videos found</h3>
                        <p className="text-gray-500 mt-2">Try selecting a different category</p>
                    </div>
                )}
            </div>

            {selectedVideo && (
                <VideoModal 
                    video={selectedVideo} 
                    onClose={closeVideoModal}
                    relatedVideos={videos.filter(v => v.id !== selectedVideo.id).slice(0, 2)}
                />
            )}
        </div>
    );
};

export default Videos;