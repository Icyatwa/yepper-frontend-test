// PendingAdPreview.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";

import '../styles/pendingDetails.css';
import { 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Play, 
  Minimize2,
  MapPin, 
  Globe, 
  Tags, 
  Folder,
  ChevronsDown,
  Expand
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner';

function PendingAdPreview() {
  const { adId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [relatedAds, setRelatedAds] = useState([]);

  const [error, setError] = useState(null);
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const videoContainerRef = useRef(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchAdDetails = async () => {
      if(user){
        const ownerId = user.id;

        try {
          const response = await axios.get(`http://localhost:5000/api/accept/pending-ad/${adId}`);
          setAd(response.data);
  
          const relatedResponse = await axios.get(`http://localhost:5000/api/accept/pending/${ownerId}`);
          const relatedAdsData = relatedResponse.data.filter((otherAd) => otherAd._id !== adId);
          setRelatedAds(relatedAdsData);
          setFilteredAds(relatedAdsData);
  
          setLoading(false);
        } catch (err) {
          console.error('Error fetching ad details:', err);
          setError('Failed to load ad details');
        }
      }
    };
    fetchAdDetails();
  }, [adId, , user]);

  const handleConfirm = async () => {
    try {
      await axios.put(`http://localhost:5000/api/accept/approve/${adId}`);
      navigate('/pending'); // Redirect to the list of pending ads
    } catch (err) {
      console.error('Error confirming ad:', err);
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
    navigate(`/pending-ad/${newAdId}`);
  };

  if (loading) {
    return(
      <LoadingSpinner />
    )
  };
  if (error) return <div className="error">{error}</div>;
  
  const renderAdInfo = () => {
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
          </div>
          <div className='w-full mt-6'>
            <button 
              onClick={handleConfirm} 
              className="w-full mt-6 flex items-center justify-center px-3 py-2 rounded-lg font-bold text-white sm:text-base transition-all duration-300 bg-[#FF4500] hover:bg-orange-500 hover:-translate-y-0.5"
            >
              Approve
            </button>
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
    
              <div className="websites-section">
                <h3 className="text-xl font-semibold text-blue-950 mb-2 flex items-center">
                  <Globe className="mr-2 text-[#FF4500]" size={20} />
                  Websites
                </h3>
                <div className="space-y-2">
                  {ad.selectedWebsites.map((website) => (
                    <div key={website._id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-blue-950">{website.websiteName}</p>
                      <a 
                        href={website.websiteLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {website.websiteLink}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
    
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="categories-section">
                <h3 className="text-xl font-semibold text-blue-950 mb-2 flex items-center">
                  <Tags className="mr-2 text-[#FF4500]" size={20} />
                  Categories
                </h3>
                <div className="space-y-2">
                  {ad.selectedCategories.map((category) => (
                    <div 
                      key={category._id} 
                      className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                    >
                      <span className="text-gray-800">{category.categoryName}</span>
                      <span className="text-blue-950 font-semibold">${category.price}</span>
                    </div>
                  ))}
                </div>
              </div>
    
              <div className="spaces-section">
                <h3 className="text-xl font-semibold text-blue-950 mb-2 flex items-center">
                  <Folder className="mr-2 text-[#FF4500]" size={20} />
                  Spaces
                </h3>
                <div className="space-y-2">
                  {ad.selectedSpaces.map((space) => (
                    <div 
                      key={space._id} 
                      className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                    >
                      <span className="text-gray-800">{space.spaceType}</span>
                      <span className="text-blue-950 font-semibold">${space.price}</span>
                    </div>
                  ))}
                </div>
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
            onClick={() => navigate('/pending-ads')}
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

          {renderAdInfo()}
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

export default PendingAdPreview;
