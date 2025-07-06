import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { 
    Volume2, 
    VolumeX, 
    Play, 
    Minimize2,
    MapPin, 
    Eye,
    MousePointer,
    ChevronsDown,
    ArrowLeft,
    Expand,
    Check,
    Clock,
    DollarSign,
    Calendar,
    ExternalLink,
    Sparkles,
    Star,
    Globe,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import PaymentModal from './PaymentModal';

function ApprovedAdDetail() {
    const { adId } = useParams();
    const navigate = useNavigate();
    const { user } = useClerk();
    const userId = user?.id;
    const [ad, setAd] = useState(null);
    const [relatedAds, setRelatedAds] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmingWebsite, setConfirmingWebsite] = useState(null);
    const [muted, setMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const videoRef = useRef(null);
    const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
    const [isImageFullScreen, setIsImageFullScreen] = useState(false);
    const videoContainerRef = useRef(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
    const [hoverWebsite, setHoverWebsite] = useState(null);

    useEffect(() => {
      const fetchAdDetails = async () => {
        try {
          const adResponse = await axios.get(`http://localhost:5000/api/accept/ad-details/${adId}`);
          setAd(adResponse.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to load ad details');
          setLoading(false);
        }
      };
  
      if (userId) fetchAdDetails();
  }, [adId, userId]);

  const confirmWebsiteAd = async (websiteId) => {
      try {
          setConfirmingWebsite(websiteId);
          const response = await axios.put(
              `http://localhost:5000/api/accept/confirm/${adId}/website/${websiteId}`
          );

          // Update the local state to reflect the confirmation
          setAd(prevAd => ({
              ...prevAd,
              websiteStatuses: prevAd.websiteStatuses.map(status => {
                  if (status.websiteId === websiteId) {
                      return {
                          ...status,
                          confirmed: true,
                          confirmedAt: new Date().toISOString()
                      };
                  }
                  return status;
              })
          }));

          toast.success('Ad successfully confirmed for the website!');
      } catch (error) {
          console.error('Error confirming ad:', error);
          toast.error(error.response?.data?.message || 'Failed to confirm ad');
      } finally {
          setConfirmingWebsite(null);
      }
  };

  const handleSearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      const matchedAds = relatedAds.filter((otherAd) =>
          otherAd.businessName.toLowerCase().includes(query)
      );
      setFilteredAds(matchedAds);
  };

  const toggleVideoFullScreen = () => {
      setIsVideoFullScreen(!isVideoFullScreen);
  };

  const toggleImageFullScreen = () => {
      setIsImageFullScreen(!isImageFullScreen);
  };

  const toggleMute = (e) => {
      e.stopPropagation();
      setMuted(!muted);
  };

  const togglePause = () => {
      if (videoRef.current) {
          if (isPaused) {
              videoRef.current.play();
          } else {
              videoRef.current.pause();
          }
          setIsPaused(!isPaused);
      }
  };

  const handleAdClick = (newAdId) => {
      navigate(`/approved-detail/${newAdId}`);
  };

  if (loading) {
    return(
        <LoadingSpinner />
    )
  };
  if (error) return <p>{error}</p>;

    // Render website confirmations
    const renderWebsiteConfirmations = () => {
        if (!ad?.websiteStatuses) return null;

        return (
            <div className="website-confirmations mt-12">
                <div className="flex items-center justify-center mb-8">
                    <div className="h-px w-12 bg-blue-500 mr-6"></div>
                    <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Website Confirmations</span>
                    <div className="h-px w-12 bg-blue-500 ml-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {ad.websiteStatuses.map((status) => (
                        <div 
                            key={status.websiteId}
                            className="group relative backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 text-white"
                            style={{
                                boxShadow: hoverWebsite === status.websiteId ? '0 0 40px rgba(59, 130, 246, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
                            }}
                            onMouseEnter={() => setHoverWebsite(status.websiteId)}
                            onMouseLeave={() => setHoverWebsite(null)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                            
                            <div className="p-8 relative z-10">
                                <div className="flex items-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                                        <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                                            <Globe className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="uppercase text-xs font-semibold text-blue-400 tracking-widest mb-1">Website</div>
                                        <div className="flex items-center space-x-2">
                                            <h2 className="text-2xl font-bold">{status.websiteName}</h2>
                                            <a href={status.websiteLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-6 flex justify-between items-center">
                                    <div className="flex items-center space-x-4 text-white/70">
                                        <span className="flex items-center">
                                            <Calendar size={16} className="mr-1 text-blue-400" />
                                            {status.approvedAt ? new Date(status.approvedAt).toLocaleDateString() : 'Pending'}
                                        </span>
                                        <span className="flex items-center">
                                            <DollarSign size={16} className="mr-1 text-blue-400" />
                                            {status.categories.reduce((sum, cat) => sum + cat.price, 0)}
                                        </span>
                                    </div>
                                    
                                    {status.approved ? (
                                        <span className="flex items-center text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                                            <Check size={16} className="mr-1" />
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full">
                                            <Clock size={16} className="mr-1" />
                                            Pending
                                        </span>
                                    )}
                                </div>
                                
                                <div className="space-y-4 mb-8">
                                    {status.categories.map((cat, idx) => (
                                        <div key={idx} className="flex items-center text-white/80">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                                <Sparkles size={14} className="text-blue-400" />
                                            </div>
                                            <span>{cat.categoryName} - {cat.price} USD</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex space-x-4">
                                    {/* {status.approved && !status.confirmed && (
                                        <button
                                            onClick={() => confirmWebsiteAd(status.websiteId)}
                                            disabled={confirmingWebsite === status.websiteId}
                                            className="w-full group relative h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="relative z-10 flex items-center justify-center">
                                                {confirmingWebsite === status.websiteId ? (
                                                    <>
                                                        <LoadingSpinner size="sm" className="mr-2" />
                                                        <span className="uppercase tracking-wider">Confirming...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={16} className="mr-2" />
                                                        <span className="uppercase tracking-wider">Confirm Ad</span>
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    )} */}
                                    {status.confirmed && (
                                        <div className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-400 text-white font-medium flex items-center justify-center">
                                            <Check size={16} className="mr-2" />
                                            <span className="uppercase tracking-wider">Confirmed</span>
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={() => setSelectedWebsiteId(status.websiteId)}
                                        className="w-full group relative h-12 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <span className="relative z-10 flex items-center justify-center">
                                            <DollarSign size={16} className="mr-2" />
                                            <span className="uppercase tracking-wider">Pay Now</span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {selectedWebsiteId && (
                    <PaymentModal
                        ad={ad}
                        websiteId={selectedWebsiteId}
                        onClose={() => setSelectedWebsiteId(null)}
                    />
                )}
            </div>
        );
    };

    // Render ad details
    const renderAdDetails = () => {
        if (!ad) return null;

        const truncateDescription = (text, maxLength = 150) => {
            if (text.length <= maxLength) return text;
            return text.substr(0, maxLength) + '...';
        };

        return (
            <div className="ad-info-container backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 p-8 mt-10 text-white">
                <div className="header flex justify-between items-center border-b border-white/10 pb-6">
                    <div className="w-full">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            {ad.businessName}
                        </h2>
                        <div className="flex items-center space-x-6 mt-4">
                            <div className="flex items-center space-x-2 text-white/70">
                                <Eye className="text-blue-400" size={20} />
                                <span>{ad.views.toLocaleString()} Views</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/70">
                                <MousePointer className="text-blue-400" size={20} />
                                <span>{ad.clicks.toLocaleString()} Clicks</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="description relative mt-6">
                    <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">Description</h3>
                    <p className={`text-white/70 leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                        {isDescriptionExpanded ? ad.adDescription : truncateDescription(ad.adDescription)}
                    </p>
                    
                    {ad.adDescription.length > 150 && (
                        <button 
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="mt-2 flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ChevronsDown size={18} className="mr-1" />
                            <span className="text-sm">
                                {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                            </span>
                        </button>
                    )}
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold flex items-center mb-4">
                        <MapPin className="mr-2 text-blue-400" size={20} />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Location</span>
                    </h3>
                    <p className="text-white/70">{ad.businessLocation}</p>
                </div>
            </div>
        );
    };

    // Render related ads
    const renderRelatedAds = () => {
        if (!filteredAds.length) return null;

        return (
            <div className="related-ads mt-12">
                <div className="flex items-center justify-center mb-8">
                    <div className="h-px w-12 bg-orange-500 mr-6"></div>
                    <span className="text-orange-400 text-sm font-medium uppercase tracking-widest">Related Advertisements</span>
                    <div className="h-px w-12 bg-orange-500 ml-6"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {filteredAds.map((relatedAd) => (
                        <div
                            key={relatedAd._id}
                            className="group relative backdrop-blur-md bg-gradient-to-b from-orange-900/30 to-orange-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 cursor-pointer"
                            onClick={() => handleAdClick(relatedAd._id)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                            
                            <div className="relative">
                                {relatedAd.videoUrl ? (
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        className="w-full h-48 object-cover"
                                    >
                                        <source src={relatedAd.videoUrl} type="video/mp4" />
                                    </video>
                                ) : (
                                    relatedAd.imageUrl && (
                                        <img
                                            src={relatedAd.imageUrl}
                                            alt={relatedAd.businessName}
                                            className="w-full h-48 object-cover"
                                        />
                                    )
                                )}
                            </div>
                            
                            <div className="p-6 relative z-10 text-white">
                                <div className="flex items-center mb-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
                                        <div className="relative p-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-400">
                                            <FileText className="text-white" size={16} />
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="uppercase text-xs font-semibold text-orange-400 tracking-widest mb-1">Ad</div>
                                        <h3 className="text-xl font-bold">{relatedAd.businessName}</h3>
                                    </div>
                                </div>
                                
                                <p className="text-white/70 text-sm mb-6 line-clamp-2">{relatedAd.adDescription}</p>
                                
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4 text-white/60 text-sm">
                                        <span className="flex items-center">
                                            <Eye size={14} className="mr-1" />
                                            {relatedAd.views}
                                        </span>
                                        <span className="flex items-center">
                                            <MousePointer size={14} className="mr-1" />
                                            {relatedAd.clicks}
                                        </span>
                                    </div>
                                    
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                        <Star size={14} className="text-orange-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Main render
    if (!ad) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Ultra-modern header with blur effect */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-white/70 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        <span className="font-medium tracking-wide">BACK</span>
                    </button>
                    <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">AD DETAILS</div>
                    
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search related ads..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full w-64 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-white/50"
                        />
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <div className="h-px w-12 bg-blue-500 mr-6"></div>
                        <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Advertisement Details</span>
                        <div className="h-px w-12 bg-blue-500 ml-6"></div>
                    </div>
                </div>
                
                {/* Media display section */}
                <div 
                    ref={videoContainerRef}
                    className={`media-container relative group rounded-3xl overflow-hidden border border-white/10
                        ${isVideoFullScreen || isImageFullScreen
                            ? 'fixed inset-0 z-50 w-full h-full bg-black/90 flex items-center justify-center border-0' 
                            : 'relative'}`}
                >
                    {ad.videoUrl ? (
                        <div onClick={togglePause} className="cursor-pointer">
                            <video
                                ref={videoRef}
                                src={ad.videoUrl}
                                autoPlay
                                loop
                                muted={muted}
                                className={`w-full rounded-3xl 
                                    ${isVideoFullScreen 
                                        ? 'object-contain h-full rounded-none' 
                                        : 'aspect-video'}`}
                            />
                            {isPaused && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play size={64} className="text-white opacity-75" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <img
                            src={ad.imageUrl}
                            alt={ad.businessName}
                            className={`w-full 
                                ${isImageFullScreen 
                                    ? 'object-contain h-full' 
                                    : 'aspect-video object-cover rounded-3xl'}`}
                        />
                    )}
                    
                    <div className="absolute top-4 right-4 space-x-3 z-10">
                        {ad.videoUrl && (
                            <button
                                onClick={toggleMute}
                                className="bg-black/30 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/50 transition-colors"
                            >
                                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                        )}
                        <button
                            onClick={ad.videoUrl ? toggleVideoFullScreen : toggleImageFullScreen}
                            className="bg-black/30 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {isVideoFullScreen || isImageFullScreen ? <Minimize2 size={18} /> : <Expand size={18} />}
                        </button>
                    </div>
                </div>
                
                {renderAdDetails()}
                {renderWebsiteConfirmations()}
                {renderRelatedAds()}
            </main>
            
            {(isVideoFullScreen || isImageFullScreen) && (
                <button 
                    onClick={isVideoFullScreen ? toggleVideoFullScreen : toggleImageFullScreen}
                    className="fixed top-4 right-4 z-50 bg-black/30 backdrop-blur-md hover:bg-black/50 p-3 rounded-full transition-colors"
                >
                    <Minimize2 size={18} />
                </button>
            )}
        </div>
    );
}

export default ApprovedAdDetail;