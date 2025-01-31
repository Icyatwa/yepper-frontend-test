import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Expand, 
  Minimize2, 
  Play, 
  Pause,
  Volume2, 
  VolumeX,
  Share2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import video from '../img/1920x1080 (3).mp4'

const VideoPlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(true); // Start paused
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Sample video data - in real app, fetch based on ID
  const videoData = {
    title: "Introduction to Yepper",
    description: "Learn the basics of getting started with Yepper platform",
    views: "1.2k",
    date: "2024-01-30",
    // Using a placeholder video URL - replace with actual video URL
    videoUrl: video
  };

  const relatedVideos = [
    {
      id: 2,
      title: "Advanced Yepper Features",
      thumbnail: "/api/placeholder/400/250",
      duration: "8:45",
      views: "856"
    }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      video.volume = volume;
      video.muted = muted;
    };

    video.addEventListener('loadeddata', handleLoadedData);
    return () => video.removeEventListener('loadeddata', handleLoadedData);
  }, [volume, muted]);

  useEffect(() => {
    const hideControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isPaused) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    const handleMouseMove = () => {
      setShowControls(true);
      hideControlsTimeout();
    };

    container?.addEventListener('mousemove', handleMouseMove);
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPaused]);

  const togglePlayPause = () => {
    if (!videoRef.current || !isLoaded) return;
    
    if (isPaused) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    } else {
      videoRef.current.pause();
    }
    setIsPaused(!isPaused);
  };

  const handleProgress = (e) => {
    const video = e.target;
    if (!video.duration) return;
    
    const progress = (video.currentTime / video.duration) * 100;
    setProgress(progress);
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !isLoaded) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    videoRef.current.currentTime = (percentage / 100) * videoRef.current.duration;
  };

  const handleVolumeChange = (e) => {
    if (!videoRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setMuted(newVolume === 0);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <motion.button 
            className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/videos')}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-900">{videoData.title}</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <div 
              ref={containerRef}
              className="relative bg-black rounded-xl overflow-hidden group"
            >
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              <video
                ref={videoRef}
                className="w-full aspect-video"
                onClick={togglePlayPause}
                onTimeUpdate={handleProgress}
                playsInline
                preload="auto"
              >
                <source src={videoData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Progress Bar */}
                  <div 
                    className="h-1 bg-gray-600 rounded-full mb-4 cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={togglePlayPause}
                        className="text-white hover:text-orange-500 transition-colors"
                        disabled={!isLoaded}
                      >
                        {isPaused ? (
                          <Play className="w-6 h-6" />
                        ) : (
                          <Pause className="w-6 h-6" />
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setMuted(!muted)}
                          className="text-white hover:text-orange-500 transition-colors"
                          disabled={!isLoaded}
                        >
                          {muted ? (
                            <VolumeX className="w-6 h-6" />
                          ) : (
                            <Volume2 className="w-6 h-6" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20"
                          disabled={!isLoaded}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {}} // Share functionality
                        className="text-white hover:text-orange-500 transition-colors"
                        disabled={!isLoaded}
                      >
                        <Share2 className="w-6 h-6" />
                      </button>
                      <button
                        onClick={toggleFullScreen}
                        className="text-white hover:text-orange-500 transition-colors"
                        disabled={!isLoaded}
                      >
                        {isFullScreen ? (
                          <Minimize2 className="w-6 h-6" />
                        ) : (
                          <Expand className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {videoData.description}
              </h2>
              <div className="flex items-center gap-4 text-gray-600">
                <span>{videoData.views} views</span>
                <span>•</span>
                <span>{new Date(videoData.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Related Videos */}
          <div className="lg:w-1/4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Videos</h3>
            <div className="space-y-4">
              {relatedVideos.map((video) => (
                <Link
                  key={video.id}
                  to={`/video/${video.id}`}
                  className="flex gap-4 group"
                >
                  <div className="relative w-40 flex-shrink-0">
                    <img 
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {video.views} views
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;