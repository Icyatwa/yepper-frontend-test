import React, { useState, useEffect } from "react";
import { useClerk } from '@clerk/clerk-react';
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Eye, MousePointer, Check, Clock, Globe, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from "./LoadingSpinner";

const MixedAds = ({ setLoading }) => {
    const { user } = useClerk();
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAds, setFilteredAds] = useState([]);

    const { data: mixedAds, isLoading, error } = useQuery({
        queryKey: ['mixedAds', user?.id],
        queryFn: async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/accept/mixed/${user?.id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
    
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
                }
                
                return response.json();
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        },
        enabled: !!user?.id,
        retry: 3,
        onError: (error) => {
            console.error('Query error:', error);
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

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div>Error: {error.message}</div>;

    const getStatusColor = (status) => {
        return status === 'approved' 
            ? 'bg-blue-500'
            : 'bg-blue-600';
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-md container mx-auto px-4 py-8 md:py-16">
            <div className="p-4 border-b border-gray-100">
                <div className="py-7 w-full flex justify-end items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="px-4 py-2 border rounded-full w-full md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <motion.button 
                        className="flex items-center text-white px-3 py-2 rounded-lg text-sm font-bold sm:text-base bg-[#FF4500] hover:bg-orange-500 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Search className="block h-6 w-6" />
                        Search
                    </motion.button>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center justify-center gap-5">
                        <h3 className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
                            {filteredAds.length}
                        </h3>
                        <h4 className="text-sm font-medium text-gray-600">
                            {searchQuery ? 'Found Ads' : 'Active Ads'}
                        </h4>
                    </div>
                    <motion.button 
                        className="flex items-center justify-center gap-2 text-blue-950 font-bold bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
                        onClick={() => navigate('/projects')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Globe className="w-6 h-6 text-[#FF4500]" />
                        Switch to Projects
                    </motion.button>
                </div>
                <div className="flex gap-2">
                    {['all', 'approved', 'pending'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                selectedFilter === filter
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ads Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                {filteredAds.length > 0 ? (
                    filteredAds.slice().reverse().map((ad, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
                        >
                            {/* Media Section */}
                            <div className="relative h-48">
                                {ad.videoUrl ? (
                                    <video 
                                        autoPlay 
                                        loop 
                                        muted 
                                        onTimeUpdate={(e) => {
                                            if (e.target.currentTime >= 6) e.target.currentTime = 0;
                                        }}
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

                            {/* Content Section */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                    {ad.businessName}
                                </h4>

                                {/* Website Approval Status */}
                                <div className="mb-4 space-y-2">
                                    {ad.websiteSelections.map((selection, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 font-medium">
                                                {selection.websiteId.websiteName}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                                                ${selection.approved 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'}`}>
                                                {selection.approved ? (
                                                    <><Check className="w-3 h-3" /> Approved</>
                                                ) : (
                                                    <><Clock className="w-3 h-3" /> Pending</>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats Section */}
                                {ad.websiteSelections.some(ws => ws.approved) && (
                                    <div className="flex justify-between mb-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-blue-600" />
                                            <span className="text-gray-600">
                                                {formatNumber(ad.views)} views
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MousePointer className="w-4 h-4 text-blue-600" />
                                            <span className="text-gray-600">
                                                {formatNumber(ad.clicks)} clicks
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <Link 
                                    to={`/approved-detail/${ad._id}`}
                                    className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-[#FF4500] hover:bg-orange-500 hover:-translate-y-0.5 text-white sm:text-base font-bold rounded-md transition-all duration-300"
                                >
                                    View Campaign
                                    <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-8">
                        <Clock className="w-8 h-8 text-gray-400 mb-2" />
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">
                            {searchQuery ? 'No Ads Found' : 'No Ads Yet'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {searchQuery 
                                ? 'No ads found matching your search'
                                : 'No active campaigns yet'
                            }
                        </p>
                        <Link 
                            to="/select"
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-[#FF4500] hover:bg-orange-500 hover:-translate-y-0.5 text-white sm:text-base font-bold rounded-md transition-all duration-300"
                        >
                            <Plus className="w-4 h-4" />
                            Publish First Ad
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MixedAds;