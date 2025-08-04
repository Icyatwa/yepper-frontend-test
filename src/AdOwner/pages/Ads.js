// Ads.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Loader } from 'lucide-react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { Button, Grid } from '../../components/components';
import Navbar from '../../components/Navbar';
import LoadingSpinner from "../../components/LoadingSpinner";

const MixedAds = ({ setLoading }) => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAds, setFilteredAds] = useState([]);

    const authenticatedAxios = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
    });

    const { data: mixedAds, isLoading, error, refetch } = useQuery({
        queryKey: ['mixedAds', user?._id || user?.id],
        queryFn: async () => {
            try {
              const userId = user?._id || user?.id;
              const response = await authenticatedAxios.get(`/web-advertise/mixed/${userId}`);
              return response.data;
            } catch (error) {
              console.error('Error fetching Ads:', error.response?.data || error.message);
              throw error;
            }
        },
        enabled: !!(user?._id || user?.id) && !!token,
        onSuccess: (data) => {
            setFilteredAds(data);
        }
    });

    useEffect(() => {
        if (!mixedAds) return;

        const performSearch = () => {
            const query = searchQuery.toLowerCase().trim();
            const statusFiltered = selectedFilter === 'all' 
                ? mixedAds 
                : mixedAds.filter(ad => ad.websiteSelections.some(ws => 
                    selectedFilter === 'approved' ? ws.approved : !ws.approved
                ));

            if (!query) {
                setFilteredAds(statusFiltered);
                return;
            }

            const searched = statusFiltered.filter(ad => {
                const searchFields = [
                    ad.businessName?.toLowerCase(),
                    ad.adDescription?.toLowerCase(),
                    ...ad.websiteSelections.map(ws => ws.websiteId?.websiteName?.toLowerCase())
                ];
                return searchFields.some(field => field?.includes(query));
            });
            
            setFilteredAds(searched);
        };

        performSearch();
    }, [searchQuery, selectedFilter, mixedAds]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const formatNumber = (number) => {
        if (number >= 1000 && number < 1000000) {
            return (number / 1000).toFixed(1) + 'K';
        } else if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        }
        return number;
    };

    if (error) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-bold text-red-600 mb-4">Error loading campaigns</h2>
                <p className="text-gray-600 mb-6">{error.message}</p>
                <Button onClick={() => refetch()} variant="primary">
                    Retry
                </Button>
            </div>
        </div>
    );

    if (isLoading) return (
        <LoadingSpinner />
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-12">

                <div className='flex justify-between items-center gap-4 mb-8'>
                    {/* Search Section */}
                    <div className="flex justify-start flex-1">
                        <div className="relative w-full max-w-md">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search campaigns..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-3 border border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="flex items-center border border-black">
                        {['all', 'approved', 'pending'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                    selectedFilter === filter 
                                        ? 'bg-black text-white' 
                                        : 'bg-white text-black hover:bg-gray-50'
                                } ${filter !== 'pending' ? 'border-r border-black' : ''}`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Add Button */}
                    <div className="flex-shrink-0">
                        <Button
                            onClick={() => navigate('/upload-ad')}
                            variant="secondary"
                            size="lg"
                            icon={Plus}
                            iconPosition="left"
                        >
                            Add New Ad
                        </Button>
                    </div>

                    {/* Ad Dashboard Button */}
                    <div className="flex-shrink-0">
                        <Button
                            onClick={() => navigate('/advertiser-dashboard')}
                            variant="secondary"
                            size="lg"
                        >
                            Dashboard
                        </Button>
                    </div>
                </div>
                
                {/* Campaigns Grid */}
                {filteredAds.length > 0 ? (
                    <Grid cols={3} gap={6}>
                        {filteredAds.slice().reverse().map((ad, index) => {
                            const isApproved = ad.websiteSelections.some(ws => ws.approved);
                            const isPending = ad.websiteSelections.some(ws => !ws.approved);
                            
                            return (
                                <div 
                                    key={ad._id || index}
                                    className="border border-black bg-white transition-all duration-200 hover:bg-gray-50"
                                >
                                    {/* Media Section */}
                                    <div className="h-48 border-b border-black">
                                        {ad.videoUrl ? (
                                            <video 
                                                autoPlay 
                                                loop 
                                                muted 
                                                className="w-full h-full object-cover"
                                            >
                                                <source src={ad.videoUrl} type="video/mp4" />
                                            </video>
                                        ) : (
                                            <img 
                                                src={ad.imageUrl} 
                                                alt={ad.businessName}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Status & Title */}
                                        <div className="flex items-center mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-black">{ad.businessName}</h3>
                                            </div>
                                        </div>
                                        
                                        {/* Website Selections */}
                                        <div className="border border-gray-200 p-3 mb-4">
                                            {ad.websiteSelections.map((selection, idx) => (
                                                <div key={idx} className="flex items-center justify-between py-1">
                                                    <div className="flex items-center">
                                                        <span className="text-sm text-gray-700">{selection.websiteId.websiteName}</span>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 border ${
                                                        selection.approved 
                                                            ? 'bg-black text-white' 
                                                            : 'border-black bg-gray-100 text-black'
                                                    }`}>
                                                        {selection.approved ? 'Approved' : 'Pending'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Stats */}
                                        {isApproved && (
                                            <div className="flex items-center justify-between mb-4 border border-gray-200 p-3">
                                                <div className="flex items-center">
                                                    <div className='flex justify-center gap-1'>
                                                        <div className="text-xs text-gray-600">Views</div>
                                                        <div className="text-sm font-semibold text-black">{formatNumber(ad.views)}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className='flex justify-center gap-1'>
                                                        <div className="text-xs text-gray-600">Clicks</div>
                                                        <div className="text-sm font-semibold text-black">{formatNumber(ad.clicks)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Action Button */}
                                        <Link to={`/ad-details/${ad._id}`}>
                                            <Button 
                                                variant="secondary" 
                                                className="w-full flex items-center justify-center space-x-2"
                                            >
                                                <span>View Campaign</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </Grid>
                ) : (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mb-4 text-black">
                                {searchQuery ? 'No Campaigns Found' : 'No Active Campaigns Yet'}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {searchQuery 
                                    ? ''
                                    : ''
                                }
                            </p>
                            <Link to="/select">
                                <Button 
                                    variant="secondary"
                                    size="lg"
                                    icon={Plus}
                                    iconPosition="left"
                                >
                                    Create Your First Campaign
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MixedAds;