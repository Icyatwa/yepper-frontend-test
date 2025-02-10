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
    ChevronLeft,
    Expand,
    Check,
    Clock,
    DollarSign,
    Calendar,
    ExternalLink
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

    const renderWebsiteConfirmations = () => {
        if (!ad?.websiteStatuses) return null;

        return (
            <div className="website-confirmations mt-6">
                <h3 className="text-xl font-semibold text-blue-950 mb-4">Website Confirmations</h3>
                <div className="space-y-4">
                    {ad.websiteStatuses.map((status) => (
                        <div key={status.websiteId} 
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-orange-200 transition-all">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="text-lg font-medium text-blue-950">{status.websiteName}</h4>
                                        <a href={status.websiteLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-500 hover:text-blue-600">
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                                        <span className="flex items-center">
                                            <Calendar size={16} className="mr-1" />
                                            {status.approvedAt ? new Date(status.approvedAt).toLocaleDateString() : 'Pending'}
                                        </span>
                                        <span className="flex items-center">
                                            <DollarSign size={16} className="mr-1" />
                                            ${status.categories.reduce((sum, cat) => sum + cat.price, 0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <div className="flex items-center space-x-2">
                                        {status.approved ? (
                                            <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                <Check size={16} className="mr-1" />
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                                <Clock size={16} className="mr-1" />
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                    {status.approved && !status.confirmed && (
                                        <button
                                            onClick={() => confirmWebsiteAd(status.websiteId)}
                                            disabled={confirmingWebsite === status.websiteId}
                                            className={`px-4 py-2 ${
                                                confirmingWebsite === status.websiteId
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-[#FF4500] hover:bg-orange-500'
                                            } text-white rounded-lg transition-colors flex items-center`}
                                        >
                                            {confirmingWebsite === status.websiteId ? (
                                                <>
                                                    <LoadingSpinner size="sm" className="mr-2" />
                                                    Confirming...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={16} className="mr-2" />
                                                    Confirm Ad
                                                </>
                                            )}
                                        </button>
                                    )}
                                    {status.confirmed && (
                                        <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                            <Check size={16} className="mr-1" />
                                            Confirmed
                                        </span>
                                    )}
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <>
                                        <button
                                            onClick={() => setSelectedWebsiteId(status.websiteId)}
                                            className="px-4 py-2 bg-[#FF4500] text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center"
                                        >
                                            <DollarSign size={16} className="mr-2" />
                                            Pay Now
                                        </button>

                                        {selectedWebsiteId && (
                                            <PaymentModal
                                            ad={ad}
                                            websiteId={selectedWebsiteId}
                                            onClose={() => setSelectedWebsiteId(null)}
                                            />
                                        )}
                                    </>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="flex flex-wrap gap-2">
                                    {status.categories.map((cat, idx) => (
                                        <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                                            {cat.categoryName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWebsitesAndCategories = () => {
        if (!ad) return null;

        const truncateDescription = (text, maxLength = 150) => {
            if (text.length <= maxLength) return text;
            return text.substr(0, maxLength) + '...';
        };

        return (
            <div className="ad-info-container bg-white rounded-lg shadow-md p-6 mt-4 space-y-6">
                <div className="header flex justify-between items-center border-b pb-4">
                    <div className='w-full mt-6'>
                        <h2 className="text-3xl font-bold text-blue-950">{ad.businessName}</h2>
                        <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Eye className="text-[#FF4500]" size={20} />
                                <span>{ad.views} Views</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <MousePointer className="text-[#FF4500]" size={20} />
                                <span>{ad.clicks} Clicks</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="description relative">
                    <h3 className="text-xl font-semibold text-blue-950 mb-2">Description</h3>
                    <p className={`text-gray-600 leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                        {isDescriptionExpanded ? ad.adDescription : truncateDescription(ad.adDescription)}
                    </p>
                    
                    {ad.adDescription.length > 150 && (
                        <button 
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="absolute bottom-0 right-0 flex items-center text-orange-500 bg-red-100 p-1 rounded-full transition"
                        >
                            <ChevronsDown size={20} />
                            <span className="text-sm ml-1">
                                {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                            </span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-semibold text-blue-950 mb-2 flex items-center">
                            <MapPin className="mr-2 text-[#FF4500]" size={20} />
                            Location
                        </h3>
                        <p className="text-gray-700">{ad.businessLocation}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="ad-detail-youtube-style bg-white min-h-screen">
            <div className="header bg-white shadow-sm p-4 flex items-center justify-between flex-wrap">
                <div className="flex items-center mb-2 md:mb-0 gap-5">
                    <motion.button 
                        className={'flex items-center text-white p-2 rounded-full text-sm font-bold sm:text-base bg-[#FF4500] hover:bg-orange-500 transition-colors'}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                    >
                        <ChevronLeft 
                            className="text-white w-6 h-6 sm:w-8 sm:h-8" 
                            strokeWidth={2.5}
                        />
                    </motion.button>
                    <h1 className="text-lg md:text-xl font-bold text-blue-950">Ad Details</h1>
                </div>
                <input
                    type="text"
                    placeholder="Search related ads..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="px-4 py-2 border rounded-full w-full md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
            </div>

            <div className="main-content flex flex-col lg:flex-row p-4">
                <div className="video-section lg:w-3/4 w-full pr-0 lg:pr-4">
                    {ad.videoUrl ? (
                        <div 
                            ref={videoContainerRef}
                            className={`video-container relative group 
                                ${isVideoFullScreen 
                                    ? 'fixed inset-0 z-50 w-full h-full bg-black bg-opacity-90 flex items-center justify-center' 
                                    : 'relative'}`}
                            onClick={togglePause}
                        >
                            <video
                                ref={videoRef}
                                src={ad.videoUrl}
                                autoPlay
                                loop
                                muted={muted}
                                className={`w-full rounded-lg 
                                    ${isVideoFullScreen 
                                        ? 'fixed inset-0 z-50 w-full bg-black bg-opacity-90 h-full object-contain' 
                                        : ''}`}
                            />
                            <div className="absolute top-4 right-4 space-x-2 z-10">
                                <button
                                    onClick={toggleMute}
                                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                                >
                                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>
                                <button
                                    onClick={toggleVideoFullScreen}
                                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 group-hover:opacity-100"
                                >
                                    {isVideoFullScreen ? <Minimize2 size={20} /> : <Expand size={20} />}
                                </button>
                            </div>
                            {isPaused && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play size={64} className="text-white opacity-75" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative group">
                            <img
                                src={ad.imageUrl}
                                alt="Ad Visual"
                                className={`w-full rounded-lg 
                                    ${isImageFullScreen 
                                        ? 'fixed inset-0 z-50 object-contain bg-black bg-opacity-90 w-full h-full' 
                                        : ''}`}
                            />
                            {ad.imageUrl && (
                                <button
                                    onClick={toggleImageFullScreen}
                                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 opacity-0 group-hover:opacity-100 z-10"
                                >
                                    {isImageFullScreen ? <Minimize2 size={20} /> : <Expand size={20} />}
                                </button>
                            )}
                        </div>
                    )}

                {renderWebsiteConfirmations()}
                {renderWebsitesAndCategories()}
                </div>

                {/* Related Ads Section */}
                <div className="related-ads-section lg:w-1/4 w-full bg-gray-50 p-4 rounded-lg mt-4 lg:mt-0">
                    <h3 className="text-lg md:text-xl font-bold mb-4 text-blue-950">Related Ads</h3>
                    <div className="space-y-4">
                        {filteredAds.slice().reverse().map((otherAd) => (
                            <div
                                key={otherAd._id}
                                className="related-ad-card border border-blue-600 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                                onClick={() => handleAdClick(otherAd._id)}
                            >
                                {otherAd.videoUrl ? (
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        className="w-full h-32 object-cover"
                                    >
                                        <source src={otherAd.videoUrl} type="video/mp4" />
                                    </video>
                                ) : (
                                    otherAd.imageUrl && (
                                        <img
                                            src={otherAd.imageUrl}
                                            alt="Related Ad"
                                            className="w-full h-32 object-cover"
                                        />
                                    )
                                )}
                                <div className="p-2 bg-white">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{otherAd.businessName}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-600">{otherAd.views} Views</span>
                                            <span className="text-xs text-gray-600">{otherAd.clicks} Clicks</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {(isVideoFullScreen || isImageFullScreen) && (
                <button 
                    onClick={isVideoFullScreen ? toggleVideoFullScreen : toggleImageFullScreen}
                    className="fixed top-4 right-4 z-50 bg-white/50 hover:bg-white/75 p-2 rounded-full"
                >
                    <Minimize2 size={24} />
                </button>
            )}
        </div>
    );
}

export default ApprovedAdDetail;