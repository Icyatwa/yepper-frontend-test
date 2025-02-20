// Adding sharing functionality to VideoModal.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  X,
  Expand, 
  Minimize2, 
  Play, 
  Pause,
  Volume2, 
  VolumeX,
  Share2,
  SkipForward,
  SkipBack,
  Settings,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  Link as LinkIcon
} from 'lucide-react';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const VideoModal = ({ video, onClose, relatedVideos, setSelectedVideo }) => {
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [shareToastMessage, setShareToastMessage] = useState('');
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(video.duration);
      video.volume = volume;
      video.muted = muted;
      video.playbackRate = playbackSpeed;
    };

    video.addEventListener('loadeddata', handleLoadedData);
    return () => video.removeEventListener('loadeddata', handleLoadedData);
  }, [volume, muted, playbackSpeed]);

  useEffect(() => {
    const hideControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isPaused && !showSettings && !showVolumeSlider && !showShareOptions) {
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
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [isPaused, showSettings, showVolumeSlider, showShareOptions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullScreen) {
          document.exitFullscreen();
          setIsFullScreen(false);
        } else {
          onClose();
        }
      } else if (e.key === ' ') {
        togglePlayPause();
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        skipForward();
      } else if (e.key === 'ArrowLeft') {
        skipBackward();
      } else if (e.key === 'm') {
        setMuted(!muted);
      } else if (e.key === 'f') {
        toggleFullScreen();
      } else if (e.key === 's') {
        setShowShareOptions(!showShareOptions);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, isPaused, muted, onClose, showShareOptions]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    
    setCurrentTime(video.currentTime);
    const progressValue = (video.currentTime / video.duration) * 100;
    setProgress(progressValue);
    
    // Automatically pause at the end
    if (video.currentTime >= video.duration) {
      setIsPaused(true);
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !isLoaded) return;
    
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * videoRef.current.duration;
    
    videoRef.current.currentTime = newTime;
    setProgress(clickPosition * 100);
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

  const skipForward = () => {
    if (!videoRef.current || !isLoaded) return;
    
    const newTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
    videoRef.current.currentTime = newTime;
  };

  const skipBackward = () => {
    if (!videoRef.current || !isLoaded) return;
    
    const newTime = Math.max(videoRef.current.currentTime - 10, 0);
    videoRef.current.currentTime = newTime;
  };

  const changePlaybackSpeed = (speed) => {
    if (!videoRef.current || !isLoaded) return;
    
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  // Share functionality
  const getShareUrl = (withTimestamp = false) => {
    // Assuming we have a video ID and a base URL for sharing
    const baseUrl = window.location.origin + '/watch?v=' + video.id;
    if (withTimestamp && videoRef.current) {
      const timeInSeconds = Math.floor(videoRef.current.currentTime);
      return `${baseUrl}&t=${timeInSeconds}s`;
    }
    return baseUrl;
  };

  const showToast = (message) => {
    setShareToastMessage(message);
    setShowShareToast(true);
    
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    toastTimeoutRef.current = setTimeout(() => {
      setShowShareToast(false);
    }, 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy link');
      });
    setShowShareOptions(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this video: ${video.title}`);
    const body = encodeURIComponent(`I thought you might like this video:\n\n${video.title}\n${getShareUrl()}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setShowShareOptions(false);
    showToast('Email client opened');
  };

  const shareToSocialMedia = (platform) => {
    let shareUrl = '';
    const videoUrl = encodeURIComponent(getShareUrl());
    const title = encodeURIComponent(video.title);
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${videoUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${videoUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${videoUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${videoUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
    showToast(`Shared to ${platform}`);
  };

  // Share at current timestamp
  const shareAtCurrentTimestamp = () => {
    const timestampUrl = getShareUrl(true);
    copyToClipboard(timestampUrl);
    showToast('Link with timestamp copied!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-y-auto p-4">
      <div 
        className={`relative ${isFullScreen ? 'w-full h-full' : 'w-full max-w-6xl max-h-[90vh] overflow-y-auto'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - visible in non-fullscreen mode only */}
        {!isFullScreen && (
          <button 
            className="absolute -top-12 right-0 text-white hover:text-orange-500 z-10 transition-colors flex items-center gap-2"
            onClick={onClose}
          >
            <span className="text-sm font-medium">Close</span>
            <X className="w-6 h-6" />
          </button>
        )}

        <div 
          ref={containerRef}
          className={`relative bg-black overflow-hidden ${isFullScreen ? 'rounded-none h-full' : 'rounded-xl max-h-[60vh]'}`}
        >
          {/* Cancel icon in top-right corner when not in fullscreen */}
          {!isFullScreen && (
            <button 
              className="absolute top-3 right-3 z-20 bg-black/50 rounded-full p-1.5 text-white hover:text-orange-500 transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          <video
            ref={videoRef}
            className="w-full h-full object-contain max-h-[60vh]"
            onClick={togglePlayPause}
            onTimeUpdate={handleProgress}
            playsInline
            preload="auto"
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Toast notification */}
          {showShareToast && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md z-50 text-sm font-medium">
              {shareToastMessage}
            </div>
          )}

          {/* Large play button overlay when paused */}
          {isPaused && isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlayPause}>
              <div className="w-20 h-20 rounded-full bg-orange-500/90 flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
            </div>
          )}

          {!isPaused && showControls && isLoaded && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
            >
              <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer hover:bg-black/60">
                <Pause className="w-8 h-8 text-white" />
              </div>
            </div>
          )}

          {/* Video Controls */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300 flex flex-col justify-between ${showControls ? 'opacity-100' : 'opacity-0'} ${!showControls && 'pointer-events-none'}`}
          >
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-white text-lg font-medium">{video.title}</h3>
              {isFullScreen && (
                <button 
                  className="text-white hover:text-orange-500 transition-colors"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
            
            <div className="p-4">
              {/* Progress Bar */}
              <div className="relative flex items-center">
                <span className="text-white text-xs mr-2">{formatTime(currentTime)}</span>
                <div 
                  ref={progressRef}
                  className="flex-1 h-2 bg-gray-600/60 rounded-full cursor-pointer group relative"
                  onClick={handleSeek}
                >
                  <div 
                    className="absolute inset-y-0 left-0 bg-orange-500 rounded-full group-hover:bg-orange-400"
                    style={{ width: `${progress}%` }}
                  />
                  <div 
                    className="w-4 h-4 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                  />
                </div>
                <span className="text-white text-xs ml-2">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-between mt-3">
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

                  <button
                    onClick={skipBackward}
                    className="text-white hover:text-orange-500 transition-colors"
                    disabled={!isLoaded}
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={skipForward}
                    className="text-white hover:text-orange-500 transition-colors"
                    disabled={!isLoaded}
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      className="text-white hover:text-orange-500 transition-colors"
                      disabled={!isLoaded}
                    >
                      {muted ? (
                        <VolumeX className="w-6 h-6" />
                      ) : (
                        <Volume2 className="w-6 h-6" />
                      )}
                    </button>
                    
                    {showVolumeSlider && (
                      <div 
                        className="absolute bottom-full left-0 mb-2 bg-gray-900/90 p-3 rounded-lg"
                        onMouseLeave={() => setShowVolumeSlider(false)}
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-24 accent-orange-500"
                          disabled={!isLoaded}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Share Button with Options */}
                  {/* <div className="relative">
                    <button
                      onClick={() => {
                        setShowShareOptions(!showShareOptions);
                        setShowSettings(false);
                      }}
                      className="text-white hover:text-orange-500 transition-colors"
                      disabled={!isLoaded}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    
                    {showShareOptions && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-900/90 p-3 rounded-lg w-64 z-20">
                        <h4 className="text-white text-sm font-medium mb-3">Share this video</h4>
                        
                        <div className="flex flex-wrap gap-3 mb-3">
                          <button 
                            onClick={() => shareToSocialMedia('facebook')}
                            className="text-white bg-blue-600 hover:bg-blue-700 rounded-full p-2.5 transition-colors"
                            title="Share to Facebook"
                          >
                            <Facebook className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => shareToSocialMedia('twitter')}
                            className="text-white bg-blue-400 hover:bg-blue-500 rounded-full p-2.5 transition-colors"
                            title="Share to Twitter"
                          >
                            <Twitter className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => shareToSocialMedia('linkedin')}
                            className="text-white bg-blue-700 hover:bg-blue-800 rounded-full p-2.5 transition-colors"
                            title="Share to LinkedIn"
                          >
                            <Linkedin className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => shareToSocialMedia('whatsapp')}
                            className="text-white bg-green-500 hover:bg-green-600 rounded-full p-2.5 transition-colors"
                            title="Share to WhatsApp"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={shareViaEmail}
                            className="text-white bg-gray-600 hover:bg-gray-700 rounded-full p-2.5 transition-colors"
                            title="Share via Email"
                          >
                            <Mail className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <button 
                            onClick={() => copyToClipboard(getShareUrl())}
                            className="flex items-center w-full gap-2 text-white hover:bg-gray-800 rounded px-3 py-2 text-sm transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy video link</span>
                          </button>
                          
                          <button 
                            onClick={shareAtCurrentTimestamp}
                            className="flex items-center w-full gap-2 text-white hover:bg-gray-800 rounded px-3 py-2 text-sm transition-colors"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span>Copy at current timestamp</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div> */}
                  
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowSettings(!showSettings);
                        setShowShareOptions(false);
                      }}
                      className="text-white hover:text-orange-500 transition-colors"
                      disabled={!isLoaded}
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    
                    {showSettings && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-900/90 p-2 rounded-lg w-48 z-20">
                        <div className="text-white text-xs font-medium mb-2 px-2">Playback Speed</div>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                          <button
                            key={speed}
                            onClick={() => changePlaybackSpeed(speed)}
                            className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                              playbackSpeed === speed 
                                ? 'bg-orange-500 text-white' 
                                : 'text-white hover:bg-gray-700'
                            }`}
                          >
                            {speed === 1 ? 'Normal' : `${speed}x`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={toggleFullScreen}
                    className="text-white hover:text-orange-500 transition-colors"
                    disabled={!isLoaded}
                  >
                    {isFullScreen ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Expand className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;