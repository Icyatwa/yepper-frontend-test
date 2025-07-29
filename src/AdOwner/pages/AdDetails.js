import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
    Volume2, 
    VolumeX, 
    Play, 
    ArrowLeft,
    Eye,
    MousePointer,
    MapPin,
    ExternalLink,
    Check,
    Clock,
    DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import PaymentModal from '../components/PaymentModal';

function AdDetails() {
    const { user, token } = useAuth();
    const { adId } = useParams();
    const navigate = useNavigate();
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
    const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);

    useEffect(() => {
        const fetchAdDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const adResponse = await axios.get(`http://localhost:5000/api/web-advertise/ad-details/${adId}`);
                setAd(adResponse.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load ad details');
            } finally {
                setLoading(false);
            }
        };

        if (adId) {
            fetchAdDetails();
        }
    }, [adId]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const matchedAds = relatedAds.filter((otherAd) =>
            otherAd.businessName.toLowerCase().includes(query)
        );
        setFilteredAds(matchedAds);
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

    const confirmWebsiteAd = async (websiteId) => {
        try {
            setConfirmingWebsite(websiteId);
            const response = await axios.put(
                `http://localhost:5000/api/web-advertise/confirm/${adId}/website/${websiteId}`
            );

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
            toast.error(error.response?.data?.message || 'Failed to confirm ad');
        } finally {
            setConfirmingWebsite(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
                    <p>Loading ad details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!ad) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p>No ad data found</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mt-4 px-4 py-2 border rounded hover:bg-gray-50"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b p-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center border px-3 py-1 rounded hover:bg-gray-50"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back
                    </button>
                    
                    <h1 className="text-lg font-semibold">Ad Details</h1>
                    
                    <input
                        type="text"
                        placeholder="Search related ads..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="border px-3 py-1 rounded w-64"
                    />
                </div>
            </header>
            
            <main className="max-w-6xl mx-auto p-6">
                {/* Media Section */}
                <div className="border rounded mb-6">
                    {ad.videoUrl ? (
                        <div className="relative">
                            <video
                                ref={videoRef}
                                src={ad.videoUrl}
                                autoPlay
                                loop
                                muted={muted}
                                className="w-full aspect-video"
                                onClick={togglePause}
                            />
                            {isPaused && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play size={48} className="text-white opacity-75" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={toggleMute}
                                    className="bg-black/50 text-white p-2 rounded"
                                >
                                    {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                            </div>
                        </div>
                    ) : ad.imageUrl ? (
                        <img
                            src={ad.imageUrl}
                            alt={ad.businessName}
                            className="w-full aspect-video object-cover"
                        />
                    ) : (
                        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                            <p className="text-gray-500">No media available</p>
                        </div>
                    )}
                </div>

                {/* Ad Info */}
                <div className="border rounded p-6 mb-6">
                    <div className="border-b pb-4 mb-4">
                        <h2 className="text-2xl font-bold mb-2">{ad.businessName}</h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                                <Eye size={16} className="mr-1" />
                                {(ad.views || 0).toLocaleString()} Views
                            </span>
                            <span className="flex items-center">
                                <MousePointer size={16} className="mr-1" />
                                {(ad.clicks || 0).toLocaleString()} Clicks
                            </span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-700">{ad.adDescription}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold flex items-center mb-2">
                            <MapPin size={16} className="mr-1" />
                            Location
                        </h3>
                        <p className="text-gray-700">{ad.businessLocation || 'Location not specified'}</p>
                    </div>

                    {ad.businessLink && (
                        <div>
                            <h3 className="font-semibold flex items-center mb-2">
                                <ExternalLink size={16} className="mr-1" />
                                Business Link
                            </h3>
                            <a 
                                href={ad.businessLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {ad.businessLink}
                            </a>
                        </div>
                    )}
                </div>

                {/* Website Confirmations */}
                {ad.websiteStatuses && ad.websiteStatuses.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Website Confirmations</h3>
                        <div className="grid gap-4">
                            {ad.websiteStatuses.map((status, index) => (
                                <div key={status.websiteId || index} className="border rounded p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-medium">{status.websiteName || 'Unknown Website'}</h4>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                <span>
                                                    {status.approvedAt ? new Date(status.approvedAt).toLocaleDateString() : 'Pending'}
                                                </span>
                                                <span>
                                                    ${status.categories ? status.categories.reduce((sum, cat) => sum + (cat.price || 0), 0) : 0}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {status.approved ? (
                                            <span className="flex items-center text-green-600 text-sm">
                                                <Check size={16} className="mr-1" />
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-yellow-600 text-sm">
                                                <Clock size={16} className="mr-1" />
                                                Pending
                                            </span>
                                        )}
                                    </div>

                                    {status.categories && status.categories.length > 0 && (
                                        <div className="mb-3">
                                            {status.categories.map((cat, idx) => (
                                                <div key={idx} className="text-sm text-gray-600">
                                                    {cat.categoryName || 'Category'} - ${cat.price || 0}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="flex space-x-2">
                                        {status.approved && !status.confirmed && (
                                            <button
                                                onClick={() => confirmWebsiteAd(status.websiteId)}
                                                disabled={confirmingWebsite === status.websiteId}
                                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                                            >
                                                {confirmingWebsite === status.websiteId ? 'Confirming...' : 'Confirm Ad'}
                                            </button>
                                        )}
                                        
                                        {status.confirmed && (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                                                Confirmed
                                            </span>
                                        )}
                                        
                                        <button
                                            onClick={() => setSelectedWebsiteId(status.websiteId)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Ads */}
                {filteredAds && filteredAds.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Related Advertisements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAds.map((relatedAd) => (
                                <div
                                    key={relatedAd._id}
                                    className="border rounded overflow-hidden cursor-pointer hover:shadow-md"
                                    onClick={() => navigate(`/approved-detail/${relatedAd._id}`)}
                                >
                                    {relatedAd.videoUrl ? (
                                        <video
                                            autoPlay
                                            loop
                                            muted
                                            className="w-full h-32 object-cover"
                                        >
                                            <source src={relatedAd.videoUrl} type="video/mp4" />
                                        </video>
                                    ) : relatedAd.imageUrl ? (
                                        <img
                                            src={relatedAd.imageUrl}
                                            alt={relatedAd.businessName}
                                            className="w-full h-32 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-32 bg-gray-100"></div>
                                    )}
                                    
                                    <div className="p-3">
                                        <h4 className="font-medium mb-1">{relatedAd.businessName}</h4>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{relatedAd.adDescription}</p>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{relatedAd.views || 0} views</span>
                                            <span>{relatedAd.clicks || 0} clicks</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            
            {selectedWebsiteId && (
                <PaymentModal
                    ad={ad}
                    websiteId={selectedWebsiteId}
                    onClose={() => setSelectedWebsiteId(null)}
                />
            )}
        </div>
    );
}

export default AdDetails;