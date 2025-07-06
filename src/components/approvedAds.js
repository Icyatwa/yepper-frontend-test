import React, { useState, useEffect } from "react";
import { useClerk } from '@clerk/clerk-react';
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Eye, MousePointer, Check, Clock, Globe, Search, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from "./LoadingSpinner";

const MixedAds = ({ setLoading }) => {
    const { user } = useClerk();
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAds, setFilteredAds] = useState([]);
    const [hoverStates, setHoverStates] = useState({});

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

    const handleMouseEnter = (id) => {
        setHoverStates(prev => ({ ...prev, [id]: true }));
    };

    const handleMouseLeave = (id) => {
        setHoverStates(prev => ({ ...prev, [id]: false }));
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center p-8 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                <Clock className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Error Loading Data</h2>
                <p className="text-white/70 mb-4">{error.message}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-medium"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <div className="h-px w-12 bg-blue-500 mr-6"></div>
                        <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Campaign Manager</span>
                        <div className="h-px w-12 bg-blue-500 ml-6"></div>
                    </div>
                    
                    <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            Your Active Campaigns
                        </span>
                    </h1>
                    
                    {/* Search and Filter Section */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full h-14 pl-14 pr-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center">
                                <span className="text-blue-400 text-2xl font-bold mr-3">{filteredAds.length}</span>
                                <span className="text-white/70">{searchQuery ? 'Found Campaigns' : 'Active Campaigns'}</span>
                            </div>
                            
                            <div className="flex space-x-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full">
                                {['all', 'approved', 'pending'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setSelectedFilter(filter)}
                                        className={`px-4 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                            selectedFilter === filter
                                                ? filter === 'approved' 
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                                                    : filter === 'pending' 
                                                        ? 'bg-gradient-to-r from-orange-600 to-rose-600 text-white'
                                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                                : 'text-white/60 hover:text-white/90'
                                        }`}
                                    >
                                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-end w-full h-full">
                            <button 
                                onClick={() => navigate('/projects')}
                                className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500 transition-all"
                            >
                                <Globe className="w-5 h-5 mr-2" />
                                <span>Switch to Projects</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Campaigns Grid */}
                {filteredAds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAds.slice().reverse().map((ad, index) => {
                            const isApproved = ad.websiteSelections.some(ws => ws.approved);
                            const isPending = ad.websiteSelections.some(ws => !ws.approved);
                            
                            // Choose gradient colors based on status
                            const gradientFrom = isApproved && !isPending ? 'from-blue-900/30' : 'from-orange-900/30';
                            const gradientTo = isApproved && !isPending ? 'to-blue-900/10' : 'to-orange-900/10';
                            
                            const hoverGradientFrom = isApproved && !isPending ? 'from-blue-600/10' : 'from-orange-600/10';
                            const hoverGradientTo = isApproved && !isPending ? 'to-indigo-600/10' : 'to-rose-600/10';
                            
                            const buttonGradientFrom = isApproved && !isPending ? 'from-blue-600' : 'from-orange-600';
                            const buttonGradientTo = isApproved && !isPending ? 'to-indigo-600' : 'to-rose-600';
                            
                            const buttonHoverFrom = isApproved && !isPending ? 'from-blue-400' : 'from-orange-400';
                            const buttonHoverTo = isApproved && !isPending ? 'to-indigo-400' : 'to-rose-400';
                            
                            const iconColor = isApproved && !isPending ? 'text-blue-400' : 'text-orange-400';
                            const bgColor = isApproved && !isPending ? 'bg-blue-500/20' : 'bg-orange-500/20';
                            
                            return (
                                <div 
                                    key={ad._id || index}
                                    className={`group relative backdrop-blur-md bg-gradient-to-b ${gradientFrom} ${gradientTo} rounded-3xl overflow-hidden border border-white/10 transition-all duration-500`}
                                    style={{
                                        boxShadow: hoverStates[ad._id] 
                                            ? isApproved && !isPending 
                                                ? '0 0 40px rgba(59, 130, 246, 0.3)' 
                                                : '0 0 40px rgba(249, 115, 22, 0.3)' 
                                            : '0 0 0 rgba(0, 0, 0, 0)'
                                    }}
                                    onMouseEnter={() => handleMouseEnter(ad._id)}
                                    onMouseLeave={() => handleMouseLeave(ad._id)}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${hoverGradientFrom} ${hoverGradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`}></div>
                                    
                                    {/* Media Section */}
                                    <div className="h-48 relative overflow-hidden">
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                    
                                    <div className="p-8 relative z-10">
                                        <div className="flex items-center mb-6">
                                            <div className="relative">
                                                <div className={`absolute inset-0 rounded-full ${isApproved && !isPending ? 'bg-blue-500' : 'bg-orange-500'} blur-md opacity-40`}></div>
                                                <div className={`relative p-3 rounded-full bg-gradient-to-r ${buttonGradientFrom} ${isApproved && !isPending ? 'to-blue-400' : 'to-orange-400'}`}>
                                                    {isApproved && !isPending ? (
                                                        <Check className="text-white" size={20} />
                                                    ) : (
                                                        <Clock className="text-white" size={20} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className={`uppercase text-xs font-semibold ${isApproved && !isPending ? 'text-blue-400' : 'text-orange-400'} tracking-widest mb-1`}>
                                                    {isApproved && !isPending ? 'Active' : isPending && isApproved ? 'Partially Active' : 'Pending'}
                                                </div>
                                                <h2 className="text-xl font-bold truncate">{ad.businessName}</h2>
                                            </div>
                                        </div>
                                        
                                        {/* Website Selection Status */}
                                        <div className="space-y-3 mb-8">
                                            {ad.websiteSelections.map((selection, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <div className="flex items-center text-white/80">
                                                        <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
                                                            <Globe size={14} className={iconColor} />
                                                        </div>
                                                        <span className="truncate">{selection.websiteId.websiteName}</span>
                                                    </div>
                                                    
                                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        selection.approved 
                                                            ? 'bg-blue-500/20 text-blue-300' 
                                                            : 'bg-orange-500/20 text-orange-300'
                                                    }`}>
                                                        {selection.approved ? 'Approved' : 'Pending'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Stats Section */}
                                        {isApproved && (
                                            <div className="flex justify-between mb-8 text-white/70">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
                                                        <Eye size={14} className={iconColor} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-white/50">Views</div>
                                                        <div className="font-semibold">{formatNumber(ad.views)}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
                                                        <MousePointer size={14} className={iconColor} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-white/50">Clicks</div>
                                                        <div className="font-semibold">{formatNumber(ad.clicks)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Action Button */}
                                        <Link
                                            to={`/approved-detail/${ad._id}`}
                                            className={`w-full group relative h-12 rounded-xl bg-gradient-to-r ${buttonGradientFrom} ${buttonGradientTo} text-white font-medium overflow-hidden transition-all duration-300 flex items-center justify-center`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r ${buttonHoverFrom} ${buttonHoverTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                            <span className="relative z-10 flex items-center justify-center">
                                                <span className="uppercase tracking-wider">View Campaign</span>
                                                <ChevronRight size={16} className="ml-2" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="backdrop-blur-md bg-white/5 rounded-3xl overflow-hidden border border-white/10 p-12 text-center">
                        <div className="relative mx-auto w-16 h-16 mb-6">
                            <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                            <div className="relative p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                                <Clock className="text-white" size={32} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">
                            {searchQuery ? 'No Campaigns Found' : 'No Active Campaigns Yet'}
                        </h2>
                        <p className="text-white/70 mb-8 max-w-md mx-auto">
                            {searchQuery 
                                ? 'No campaigns match your current search criteria. Try adjusting your search or filters.'
                                : 'Start creating your first campaign to engage with your audience and drive meaningful results.'
                            }
                        </p>
                        <Link 
                            to="/select"
                            className="group relative inline-flex items-center h-14 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center justify-center">
                                <Plus size={18} className="mr-2" />
                                <span className="uppercase tracking-wider">Create Your First Campaign</span>
                            </span>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MixedAds;